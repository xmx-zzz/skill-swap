// プロフィールの保存・読み込みの窓口。
// いまは仮実装で、ブラウザの localStorage に保存する(自分のブラウザの中だけに残る)。
// TODO: Supabase に接続したら、この中身だけを差し替える。画面側は変えない想定。

export type Profile = {
    username: string
    school: string // 学校・学科
    description: string // 自己紹介
    teaches: string[] // 教えられるスキル
    learns: string[] // 学びたいスキル
}

// まだ何も保存されていないときの、空のプロフィール
export const EMPTY_PROFILE: Profile = {
    username: '',
    school: '',
    description: '',
    teaches: [],
    learns: [],
}

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