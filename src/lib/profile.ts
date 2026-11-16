// プロフィールの保存・読み込みの窓口。
// いまは仮実装で、ブラウザの localStorage に保存する(自分のブラウザの中だけに残る)。
// TODO: Supabase に接続したら、この中身だけを差し替える。画面側は変えない想定。

export type Profile = {
    username: string // 名前
    age: number | null // 年齢(未入力は null)
    prefecture: string // 出身地(未選択は '')
    description: string // メッセージ
    avatar: string // プロフィール画像(未設定は '')
    teaches: string[] // 教えられるスキル
    learns: string[] // 学びたいスキル
}

// まだ何も保存されていないときの、空のプロフィール
export const EMPTY_PROFILE: Profile = {
    username: '',
    age: null,
    prefecture: '',
    description: '',
    avatar: '',
    teaches: [],
    learns: [],
}

// 出身地の選択肢
export const PREFECTURES = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
]

const STORAGE_KEY = 'skillswap-profile'

export async function loadProfile(): Promise<Profile> {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return { ...EMPTY_PROFILE }

    try {
        // 保存されていない項目があっても壊れないように、空のプロフィールの上に重ねる
        return { ...EMPTY_PROFILE, ...JSON.parse(saved) }
    } catch {
        return { ...EMPTY_PROFILE }
    }
}

export async function saveProfile(profile: Profile): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

// 「HTML, CSS」のような入力文字を、スキルのリストに直す(空白・空の項目・重複を取り除く)
export function textToSkills(text: string): string[] {
    const skills = text
        .split(/[,，、]/)
        .map((skill) => skill.trim())
        .filter((skill) => skill !== '')
    return Array.from(new Set(skills))
}

// スキルのリストを、入力欄に入れる文字に直す
export function skillsToText(skills: string[]): string {
    return skills.join(', ')
}