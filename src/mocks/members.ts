// ダミーデータ8人
import type { Member, Skill } from '../lib/skillswap';

/* ---------- スキルマスタ（DBの skills テーブルと同じ内容にしておく） ---------- */
const S = (id: number, name: string, category: string): Skill => ({ id, name, category });

const TS = S(1, 'TypeScript', 'プログラミング');
const REACT = S(2, 'React', 'プログラミング');
const PYTHON = S(3, 'Python', 'プログラミング');
const FIGMA = S(4, 'Figma', 'デザイン');
const ILLUST = S(5, 'イラスト', 'デザイン');
const MOVIE = S(6, '動画編集', 'デザイン');
const PHOTO = S(7, '写真撮影', 'デザイン');
const ENGLISH = S(8, '英語', '語学');
const KOREAN = S(9, '韓国語', '語学');
const GUITAR = S(11, 'ギター', '音楽');
const DTM = S(12, 'DTM', '音楽');
const STATS = S(13, '統計学', 'その他');
const EXCEL = S(15, 'Excel', 'その他');


/* ---------- 会員8人 ----------
 * receivedRequestCount = 受け取った交換申請の数（「人気順」の材料）
 * createdAt            = 登録日（「新規順」「古参順」の材料）
 */

export const MOCK_MEMBERS: Member[] = [
    {
        id: '00000000-0000-4000-8000-000000000000',
        displayName: '自分（デモ）',
        department: '情報デザイン学科',
        grade: 3,
        bio: 'フロントエンドを勉強中。デザインと英語を学びたい。',
        avatarUrl: null,
        createdAt: '2026-10-01T09:00:00.000Z',
        teaches: [TS, REACT],
        learns: [FIGMA, ENGLISH],
        receivedRequestCount: 2,
    },
    {
        id: '11111111-1111-4111-8111-111111111111',
        displayName: '佐藤 美咲',
        department: 'ビジュアルデザイン学科',
        grade: 3,
        bio: 'FigmaでUIを作っています。コードを書けるようになりたい。',
        avatarUrl: null,
        createdAt: '2026-10-02T10:00:00.000Z',
        teaches: [FIGMA, ILLUST],
        learns: [TS],
        receivedRequestCount: 9,
    },
    {
        id: '22222222-2222-4222-8222-222222222222',
        displayName: '田中 蓮',
        department: '国際文化学科',
        grade: 2,
        bio: '留学経験あり。英語と中国語なら教えられます。',
        avatarUrl: null,
        createdAt: '2026-10-03T10:00:00.000Z',
        teaches: [ENGLISH],
        learns: [REACT, MOVIE],
        receivedRequestCount: 5,
    },
    {
        id: '33333333-3333-4333-8333-333333333333',
        displayName: '鈴木 蒼',
        department: '情報デザイン学科',
        grade: 4,
        bio: 'Pythonでデータ分析。統計の相談に乗ります。',
        avatarUrl: null,
        createdAt: '2026-10-04T10:00:00.000Z',
        teaches: [PYTHON, STATS],
        learns: [FIGMA],
        receivedRequestCount: 3,
    },
    {
        id: '44444444-4444-4444-8444-444444444444',
        displayName: '高橋 結衣',
        department: '音楽学科',
        grade: 1,
        bio: 'ギターとDTM。映像にも興味があります。',
        avatarUrl: null,
        createdAt: '2026-10-05T10:00:00.000Z',
        teaches: [GUITAR, DTM],
        learns: [MOVIE, KOREAN],
        receivedRequestCount: 1,
    },
    {
        id: '55555555-5555-4555-8555-555555555555',
        displayName: '伊藤 悠真',
        department: '情報デザイン学科',
        grade: 3,
        bio: 'ReactとTypeScriptでアプリを作っています。',
        avatarUrl: null,
        createdAt: '2026-10-06T10:00:00.000Z',
        teaches: [TS, REACT],
        learns: [PYTHON],
        receivedRequestCount: 6,
    },
    {
        id: '66666666-6666-4666-8666-666666666666',
        displayName: '渡辺 さくら',
        department: '映像学科',
        grade: 2,
        bio: '動画編集と写真。発表資料づくりが苦手です。',
        avatarUrl: null,
        createdAt: '2026-10-07T10:00:00.000Z',
        teaches: [MOVIE, PHOTO],
        learns: [EXCEL],
        receivedRequestCount: 4,
    },
    {
        id: '77777777-7777-4777-8777-777777777777',
        displayName: '山本 湊',
        department: '経済学科',
        grade: 3,
        bio: 'Excelと統計でレポートを書いています。',
        avatarUrl: null,
        createdAt: '2026-10-08T10:00:00.000Z',
        teaches: [STATS, EXCEL],
        learns: [GUITAR],
        receivedRequestCount: 0,
    },
];

/* ---------- ログイン中の自分（ログイン機能ができるまでの代役） ---------- */
export const MOCK_ME: Member = MOCK_MEMBERS[0];