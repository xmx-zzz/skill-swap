// 申請管理で使うデータの形と、仮データ。
// いまは仮データを返すだけ。
// TODO: Supabase の exchange_requests テーブルにつなぐ。つなぐときは loadApplications の中身だけを差し替える。
//       DB の offered / wanted は「申請した側」から見た向きなので、
//       受け取った申請(direction: 'received')は、入れ替えて「自分から見た向き」にしてから返す。

// 状態: 申請中 / 承認済み / 成立
export type ApplicationStatus = 'pending' | 'approved' | 'completed'

// 向き: 自分が送った / 自分が受け取った
export type ApplicationDirection = 'sent' | 'received'

export type Application = {
    id: string
    direction: ApplicationDirection
    status: ApplicationStatus
    partner: {
        name: string
        prefecture: string
        age: number
        avatarColor: string // アイコンの色(画像が無いときの代わり)
    }
    offeredSkill: string // 自分が教えるスキル(カードの左に出す)
    wantedSkill: string // 自分が学びたいスキル(カードの右に出す)
    message: string
    date: string // YYYY-MM-DD
}

// 画面に出す文字(ここを直せば、全画面の表記が変わる)
export const STATUS_LABEL: Record<ApplicationStatus, string> = {
    pending: '申請中',
    approved: '承認済み',
    completed: '成立',
}

const MOCK_APPLICATIONS: Application[] = [
  // ---- 送った申請 ----
    {
    id: 'a1',
    direction: 'sent',
    status: 'pending',
    partner: { name: 'たくみ', prefecture: '大阪府', age: 23, avatarColor: '#5b84e0' },
    offeredSkill: 'Photoshop',
    wantedSkill: 'Figma',
    message: 'Figmaの使い方を教えて欲しいです！',
    date: '2026-10-25',
    },
    {
    id: 'a2',
    direction: 'sent',
    status: 'approved',
    partner: { name: 'あおい', prefecture: '東京都', age: 19, avatarColor: '#a259f7' },
    offeredSkill: 'Photoshop',
    wantedSkill: 'Figma',
    message: 'Figmaの使い方を教えて欲しいです！',
    date: '2026-10-20',
    },
    {
    id: 'a3',
    direction: 'sent',
    status: 'approved',
    partner: { name: 'かおり', prefecture: '広島県', age: 19, avatarColor: '#62b866' },
    offeredSkill: 'Photoshop',
    wantedSkill: 'Illustrator',
    message: '文字の加工方法を知りたいです！',
    date: '2026-10-20',
    },

  // ---- 受け取った申請(確認用の仮データ) ----
    {
        id: 'r1',
        direction: 'received',
        status: 'pending',
        partner: { name: 'ゆうと', prefecture: '京都府', age: 21, avatarColor: '#e0885b' },
        offeredSkill: 'Figma',
        wantedSkill: 'Photoshop',
        message: 'Photoshopの切り抜きを教えてもらえませんか？',
        date: '2026-10-27',
    },
    {
        id: 'r2',
        direction: 'received',
        status: 'approved',
        partner: { name: 'みなみ', prefecture: '福岡県', age: 20, avatarColor: '#3fb8c9' },
        offeredSkill: 'Illustrator',
        wantedSkill: 'Photoshop',
        message: 'ロゴの作り方を学びたいです！',
        date: '2026-10-22',
    },

    // ---- 成立した交換(確認用の仮データ) ----
    {
        id: 'c1',
        direction: 'sent',
        status: 'completed',
        partner: { name: 'さくら', prefecture: '愛知県', age: 22, avatarColor: '#e05b9a' },
        offeredSkill: 'Photoshop',
        wantedSkill: 'Figma',
        message: '交換できてよかったです！ありがとうございました！',
        date: '2026-10-10',
    },
    {
        id: 'c2',
        direction: 'received',
        status: 'completed',
        partner: { name: 'けんじ', prefecture: '北海道', age: 24, avatarColor: '#7a8a99' },
        offeredSkill: 'Figma',
        wantedSkill: 'Illustrator',
        message: 'また機会があればお願いします！',
        date: '2026-10-05',
    },
]

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

// 申請の一覧を読み込む。いまは仮データを、少し待ってから返す
export async function loadApplications(): Promise<Application[]> {
    await wait(200)
    return MOCK_APPLICATIONS
}

// 「2026-10-25」を「10/25(土)」の形にする
export function formatDate(iso: string): string {
    const date = new Date(`${iso}T00:00:00`)
    const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
    return `${date.getMonth() + 1}/${date.getDate()}(${weekday})`
}