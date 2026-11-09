// 型・相性判定・並び替え・DB接続・フック
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { MOCK_MEMBERS, MOCK_ME } from '../mocks/members';


// 型定義

/** スキルの向き。教えられる(teach) / 学びたい(learn) */
export type SkillKind = 'teach' | 'learn';

/** スキル1件（DB: skills テーブル） */
export interface Skill {
    id: number;
    name: string;
    category: string;
}

/** 会員1人（DB: profiles テーブル + スキル + 申請数） */
export interface Member {
    id: string;
    displayName: string;
    department: string;
    grade: number | null;
    bio: string;
    avatarUrl: string | null;
    /** 登録日。新規順・古参順の並び替えに使う */
    createdAt: string;
    /** 教えられるスキル */
    teaches: Skill[];
    /** 学びたいスキル */
    learns: Skill[];
    /** 受け取った交換申請の総数。人気順に使う */
    receivedRequestCount: number;
}

/** 相性の段階。mutual=お互い成立 / one_way=片方向 / none=共通点なし */
export type MatchTier = 'mutual' | 'one_way' | 'none';

/** 相性判定の結果。score をそのまま「％」として画面に出す */
export interface MatchResult {
    score: number;
    tier: MatchTier;
    /** 自分が教えられて、相手が学びたいスキル */
    give: Skill[];
    /** 相手が教えられて、自分が学びたいスキル */
    take: Skill[];
    /** 画面にそのまま出せる日本語の説明 */
    reason: string;
}

/** 検索結果一覧に出す「スキル1件 + 教えられる人の数」 */
export interface SkillSummary {
    skill: Skill;
    holderCount: number;
}

/** メンバー一覧の並び順 */
export type MemberSort = 'popular' | 'new' | 'old';

/** 画面に出すラベル（ここを直せば全画面の表記が変わる） */
export const MEMBER_SORT_LABEL: Record<MemberSort, string> = {
    popular: '人気順',
    new: '新規順',
    old: '古参順',
};


// 定数：エラー文言

export const ERROR_MESSAGES = {
    network: '通信に失敗しました。電波状況を確認してもう一度お試しください。',
    auth: 'メールアドレスまたはパスワードが違います。',
    unauthenticated: 'ログインの有効期限が切れました。もう一度ログインしてください。',
    notFound: 'データが見つかりませんでした。',
    conflict: 'すでに申請済みです。申請一覧をご確認ください。',
    permission: 'この操作を行う権限がありません。',
    unknown: '問題が発生しました。時間をおいてもう一度お試しください。',
} as const;

/** DBやHTTPのエラーを、画面に出せる日本語に変換する */
export function toErrorMessage(error: unknown): string {
    if (typeof error === 'string') return error;
    const e = error as { message?: string; code?: string; status?: number } | null;
    if (!e) return ERROR_MESSAGES.unknown;

    if (e.message === 'Invalid login credentials') return ERROR_MESSAGES.auth;
    if (e.status === 401) return ERROR_MESSAGES.unauthenticated;

    // PostgreSQL / PostgREST の代表的なエラーコード
    if (e.code === '23505') return ERROR_MESSAGES.conflict; // 二重申請
    if (e.code === '42501') return ERROR_MESSAGES.permission; // RLSで拒否
    if (e.code === 'PGRST116') return ERROR_MESSAGES.notFound; // 0件

    if (e.message && /fetch|network/i.test(e.message)) return ERROR_MESSAGES.network;
    return ERROR_MESSAGES.unknown;
}


// Supabase接続

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** .env が用意されているか。false ならモックデータで動く */
export const isSupabaseReady = Boolean(SUPABASE_URL && SUPABASE_KEY);

let client: SupabaseClient | null = null;

/** DBクライアントを取得する（初回だけ生成して使い回す） */
function db(): SupabaseClient {
    if (!isSupabaseReady) {
        throw new Error('環境変数が未設定です。cp .env.example .env を実行してください');
    }
    if (!client) {
        client = createClient(SUPABASE_URL as string, SUPABASE_KEY as string, {
            auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
        });
    }
    return client;
}


// データ変換：DBの行 → アプリの型

/** DBから返ってくる profiles の行の形 */
interface ProfileRow {
    id: string;
    display_name: string;
    department: string;
    grade: number | null;
    bio: string;
    avatar_url: string | null;
    created_at: string;
    /** 入れ子で返るスキル（1件なら object、複数なら配列になる点に注意） */
    user_skills?: { kind: SkillKind; skills: Skill | Skill[] | null }[] | null;
    /** exchange_requests(count) の集計結果 */
    exchange_requests?: { count: number }[] | null;
}

/** DBの1行を Member に変換する */
function toMember(row: ProfileRow): Member {
    const teaches: Skill[] = [];
    const learns: Skill[] = [];

    for (const link of row.user_skills ?? []) {
        const raw = Array.isArray(link.skills) ? link.skills[0] : link.skills;
        if (!raw) continue;
        const skill: Skill = { id: raw.id, name: raw.name, category: raw.category };
        if (link.kind === 'teach') teaches.push(skill);
        else learns.push(skill);
    }

    // 表示順を安定させる（同じデータなら毎回同じ並び）
    const byName = (a: Skill, b: Skill) => a.name.localeCompare(b.name, 'ja');

    return {
        id: row.id,
        displayName: row.display_name,
        department: row.department,
        grade: row.grade,
        bio: row.bio,
        avatarUrl: row.avatar_url,
        createdAt: row.created_at,
        teaches: teaches.sort(byName),
        learns: learns.sort(byName),
        receivedRequestCount: row.exchange_requests?.[0]?.count ?? 0,
    };
}


// 相性判定

const MUTUAL_BASE = 55;         // 相互マッチの基礎点
const MUTUAL_PAIR_BONUS = 20;   // 噛み合ったペア1組ごとの加点
const MUTUAL_VOLUME_BONUS = 5;  // 噛み合ったスキル1件ごとの加点
const ONE_WAY_BASE = 15;        // 片方向の基礎点
const ONE_WAY_VOLUME_BONUS = 10;

/** 2つのスキル配列の共通部分を返す（IDで比較） */
function overlap(a: Skill[], b: Skill[]): Skill[] {
    const ids = new Set(b.map((s) => s.id));
    return a.filter((s) => ids.has(s.id));
}

/** 「A」「B」形式の文字列にする */
function list(names: Skill[]): string {
    return names.map((s) => `「${s.name}」`).join('・');
}

/**
 * 自分と相手の相性を計算する
 * @example calcMatch(me, other) → { score: 85, tier: 'mutual', ... }
 */
export function calcMatch(me: Member, other: Member): MatchResult {
    // 自分自身とは比較しない（詳細画面で自分を開いた場合の保険）
    if (me.id === other.id) {
        return { score: 0, tier: 'none', give: [], take: [], reason: '自分自身です' };
    }

    const give = overlap(me.teaches, other.learns); // 自分が教えられる → 相手が学びたい
    const take = overlap(other.teaches, me.learns); // 相手が教えられる → 自分が学びたい
    const pairs = Math.min(give.length, take.length);

    // 相互マッチ
    if (pairs > 0) {
        const score = Math.min(
            100,
            MUTUAL_BASE + MUTUAL_PAIR_BONUS * Math.min(pairs, 2) + MUTUAL_VOLUME_BONUS * Math.min(give.length + take.length, 4),
        );
        return {
            score,
            tier: 'mutual',
            give,
            take,
            reason: `あなたの${list(give)}を相手が学びたく、相手の${list(take)}をあなたが学びたい（相互マッチ）`,
        };
    }

    // 片方向
    if (give.length + take.length > 0) {
        const score = Math.min(45, ONE_WAY_BASE + ONE_WAY_VOLUME_BONUS * Math.min(give.length + take.length, 3));
        return {
            score,
            tier: 'one_way',
            give,
            take,
            reason:
                give.length > 0
                    ? `あなたの${list(give)}を相手が学びたい（あなたが教える側）`
                    : `相手の${list(take)}をあなたが学びたい（あなたが学ぶ側）`,
        };
    }

    // 共通点なし
    return { score: 0, tier: 'none', give, take, reason: '共通するスキルの組み合わせはありません' };
}

/** ％を日本語ラベルに変換する（詳細画面の見出しに使う） */
export function scoreLabel(score: number): string {
    if (score >= 75) return '相性が良い';
    if (score >= 40) return '候補になり得る';
    if (score > 0) return '片方向のみ';
    return '共通点なし';
}


// 並び替え（フロー図：人気順 / 新規順 / 古参順）

export function sortMembers(members: Member[], sort: MemberSort): Member[] {
    const list = [...members];
    const byName = (a: Member, b: Member) => a.displayName.localeCompare(b.displayName, 'ja');

    if (sort === 'popular') {
        // 申請数が多い順 → 同数なら登録が新しい順 → それも同じなら名前順
        return list.sort(
            (a, b) =>
                b.receivedRequestCount - a.receivedRequestCount ||
                b.createdAt.localeCompare(a.createdAt) ||
                byName(a, b),
        );
    }
    if (sort === 'new') return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || byName(a, b));
    return list.sort((a, b) => a.createdAt.localeCompare(b.createdAt) || byName(a, b));
}

/** URLの ?sort= を安全に読む。不正な値は人気順にする */
export function parseSort(value: string | null): MemberSort {
    if (value === 'new' || value === 'old') return value;
    return 'popular';
}


// スキル集計（検索結果一覧で使う）

export function summarizeSkills(members: Member[]): SkillSummary[] {
    const map = new Map<number, SkillSummary>();

    for (const member of members) {
        for (const skill of member.teaches) {
            const found = map.get(skill.id);
            if (found) found.holderCount += 1;
            else map.set(skill.id, { skill, holderCount: 1 });
        }
    }

    // 人数が多い順 → 名前順
    return [...map.values()].sort(
        (a, b) => b.holderCount - a.holderCount || a.skill.name.localeCompare(b.skill.name, 'ja'),
    );
}

/** キーワードでスキルを絞る（スキル名・カテゴリー名の部分一致） */
export function filterSkills(skills: SkillSummary[], keyword: string): SkillSummary[] {
    const q = keyword.trim().toLowerCase();
    if (!q) return skills;
    return skills.filter(
        (s) => s.skill.name.toLowerCase().includes(q) || s.skill.category.toLowerCase().includes(q),
    );
}

/** カテゴリーでスキルを絞る（'all' は絞らない） */
export function filterByCategory(skills: SkillSummary[], category: string): SkillSummary[] {
    if (!category || category === 'all') return skills;
    return skills.filter((s) => s.skill.category === category);
}

/** 集計結果からカテゴリー一覧を作る（実データにあるものだけ出す） */
export function categoriesOf(skills: SkillSummary[]): string[] {
    return [...new Set(skills.map((s) => s.skill.category))].sort((a, b) => a.localeCompare(b, 'ja'));
}

/** そのスキルを「教えられる」と登録している人だけを返す */
export function holdersOf(members: Member[], skillId: number): Member[] {
    return members.filter((m) => m.teaches.some((s) => s.id === skillId));
}

/** スキルIDからスキル本体を探す（一覧の見出しに使う） */
export function findSkill(members: Member[], skillId: number): Skill | null {
    for (const m of members) {
        const hit = m.teaches.find((s) => s.id === skillId) ?? m.learns.find((s) => s.id === skillId);
        if (hit) return hit;
    }
    return null;
}


// データ取得API

/** 会員 + スキル + 申請数を1回の問い合わせで取る */
const SELECT_WITH_COUNT = `
  id, display_name, department, grade, bio, avatar_url, created_at,
  user_skills ( kind, skills ( id, name, category ) ),
  exchange_requests!exchange_requests_target_id_fkey ( count )
`;

/** 申請数の集計が使えない環境用（列名が違う／RLSで見えない場合の保険） */
const SELECT_SIMPLE = `
  id, display_name, department, grade, bio, avatar_url, created_at,
  user_skills ( kind, skills ( id, name, category ) )
`;

/** 全メンバーを取得する */
export async function listMembers(): Promise<Member[]> {
    // DB未接続ならモックを返す（画面のコードは変えずに動く）
    if (!isSupabaseReady) return MOCK_MEMBERS;

    const query = (select: string) => db().from('profiles').select(select).order('created_at', { ascending: false });

    let { data, error } = await query(SELECT_WITH_COUNT);
    // 集計付きの問い合わせが失敗したら、集計なしで取り直す（人気順は新規順と同じ並びになる）
    if (error) ({ data, error } = await query(SELECT_SIMPLE));
    if (error) throw new Error(toErrorMessage(error));

    return ((data ?? []) as unknown as ProfileRow[]).map(toMember);
}

/** 1人分を取得する（見つからなければ null） */
export async function getMember(id: string): Promise<Member | null> {
    if (!isSupabaseReady) return MOCK_MEMBERS.find((m) => m.id === id) ?? null;

    const { data, error } = await db()
        .from('profiles')
        .select(SELECT_WITH_COUNT)
        .eq('id', id)
        .maybeSingle();

    if (error) throw new Error(toErrorMessage(error));
    return data ? toMember(data as unknown as ProfileRow) : null;
}

/** 交換申請を送る（ヒロトさんの交換画面と共通で使える） */
export async function createRequest(input: {
    targetId: string;
    offeredSkillId: number;
    wantedSkillId: number;
    message: string;
}): Promise<void> {
    if (!isSupabaseReady) return; // モック時は何もしない（画面側で「申請済み」表示にする）

    // requester_id は送らない。DB側(RLS)がログイン中の人を自動で入れる
    const { error } = await db().from('exchange_requests').insert({
        target_id: input.targetId,
        offered_skill_id: input.offeredSkillId,
        wanted_skill_id: input.wantedSkillId,
        message: input.message,
    });
    if (error) throw new Error(toErrorMessage(error));
}


// Reactフック

export type AsyncState<T> =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'error'; message: string };

/** 全メンバーを読む（一覧・検索結果で使う） */
export function useMembers() {
    const [state, setState] = useState<AsyncState<Member[]>>({ status: 'loading' });
    const alive = useRef(true);

    const reload = useCallback(async () => {
        setState({ status: 'loading' });
        try {
            const data = await listMembers();
            if (alive.current) setState({ status: 'success', data });
        } catch (error) {
            if (alive.current) setState({ status: 'error', message: toErrorMessage(error) });
        }
    }, []);

    useEffect(() => {
        alive.current = true;
        void reload();
        // 画面を離れた後に setState しないようにする（警告対策）
        return () => {
            alive.current = false;
        };
    }, [reload]);

    return { state, reload };
}

/** 1人を読む（詳細画面で使う） */
export function useMember(id: string | undefined) {
    const [state, setState] = useState<AsyncState<Member | null>>({ status: 'loading' });
    const alive = useRef(true);

    const reload = useCallback(async () => {
        if (!id) {
            setState({ status: 'success', data: null });
            return;
        }
        setState({ status: 'loading' });
        try {
            const data = await getMember(id);
            if (alive.current) setState({ status: 'success', data });
        } catch (error) {
            if (alive.current) setState({ status: 'error', message: toErrorMessage(error) });
        }
    }, [id]);

    useEffect(() => {
        alive.current = true;
        void reload();
        return () => {
            alive.current = false;
        };
    }, [reload]);

    return { state, reload };
}

/**
 * 自分を返す
 * いまはログイン機能が未接続なのでデモ用の自分を返す。
 * 伊織のログインが入ったら、この中身だけを
 *   const { data } = await db().auth.getUser();
 *   return await getMember(data.user.id);
 * に差し替えれば、相性判定がそのまま本物になる。
 */

export function useMe(): Member {
    return useMemo(() => MOCK_ME, []);
}
