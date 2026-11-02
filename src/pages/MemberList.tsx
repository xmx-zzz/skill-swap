// メンバー一覧（仮）
import { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
    MEMBER_SORT_LABEL,
    calcMatch,
    findSkill,
    holdersOf,
    parseSort,
    sortMembers,
    useMe,
    useMembers,
    type MemberSort,
} from '../lib/skillswap';
import { MemberCard } from '../components/MemberCard';
import './MemberList.css';


export default function MemberList() {
    const [params, setParams] = useSearchParams();

    // URLから条件を読む
    const skillIdRaw = params.get('skill');
    const skillId = skillIdRaw !== null && Number.isFinite(Number(skillIdRaw)) ? Number(skillIdRaw) : null;
    const sort = parseSort(params.get('sort'));

    const { state, reload } = useMembers();
    const me = useMe();

    const members = state.status === 'success' ? state.data : [];
    const skill = skillId !== null ? findSkill(members, skillId) : null;

    const navigate = useNavigate();

    // 「スキルで絞る」→「並び替える」の順に処理する
    const list = useMemo(() => {
        const base = skillId !== null ? holdersOf(members, skillId) : members;
        return sortMembers(base, sort);
    }, [members, skillId, sort]);

    /** 並び順を切り替える（URLを書き換える） */
    const changeSort = (value: MemberSort) => {
        const next = new URLSearchParams(params);
        if (value === 'popular') next.delete('sort'); // 既定値はURLに出さない
        else next.set('sort', value);
        setParams(next);
    };


    const goBack = () => {
        navigate('/');　// ホーム。未定義のうちは App.tsx の * が /search に流す
    };


    return (
        <div className="ml-page">
            {/* スキル一覧に戻る導線（検索結果から来た場合に効く） */}
            <button type="button" className="ml-back" onClick={goBack}>
                ← 戻る
            </button>

            <div className="ml-head">
                <span className="ml-eyebrow">{skillId !== null ? 'SKILL HOLDERS' : 'MEMBERS'}</span>
                <h1 className="ml-title">
                    {skill ? `「${skill.name}」を教えられる人` : 'メンバー一覧'}
                </h1>
                <p className="ml-lead">
                    {skill
                        ? `${skill.category} ／ ${list.length}人が登録しています`
                        : '登録されているメンバー全員です'}
                </p>
            </div>

            {state.status === 'error' ? (
                <div className="ml-error" role="alert">
                    <p>{state.message}</p>
                    <button type="button" className="ml-btn" onClick={() => void reload()}>
                        再読み込み
                    </button>
                </div>
            ) : (
                <>
                    {/* ---------- 並び替えタブ（人気順 / 新規順 / 古参順） ---------- */}
                    <div className="ml-sort" role="group" aria-label="並び順">
                        {(Object.keys(MEMBER_SORT_LABEL) as MemberSort[]).map((key) => (
                            <button
                                key={key}
                                type="button"
                                className={`ml-sort-tab ${sort === key ? 'is-active' : ''}`}
                                aria-pressed={sort === key}
                                onClick={() => changeSort(key)}
                            >
                                {MEMBER_SORT_LABEL[key]}
                            </button>
                        ))}
                        <span className="ml-count">{list.length}人</span>
                    </div>

                    {/* ---------- 読み込み中 / 0件 / カード一覧 ---------- */}
                    {state.status === 'loading' || state.status === 'idle' ? (
                        <div className="ml-grid" aria-busy="true" aria-label="読み込み中">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="ml-skeleton" />
                            ))}
                        </div>
                    ) : list.length === 0 ? (
                        <div className="ml-empty">
                            <div className="ml-empty-icon" aria-hidden="true">
                                🙁
                            </div>
                            <h3 className="ml-empty-title">該当するメンバーがいません</h3>
                            <p className="ml-empty-text">別のスキルを選んでみてください。</p>
                            <Link to="/search" className="ml-btn">
                                スキル一覧へ
                            </Link>
                        </div>
                    ) : (
                        <ul className="ml-grid">
                            {list.map((m) => (
                                <MemberCard key={m.id} member={m} matchScore={calcMatch(me, m).score} />
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}