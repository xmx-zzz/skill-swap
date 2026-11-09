// 認証まわりの窓口。いまは仮実装(少し待って成功扱いにするだけ)。
// TODO: Supabase Auth と接続する。画面側は変えずに、この関数の中身だけ差し替える想定。
//       service_role キーはフロントに置かない。

export type SignUpInput = {
    username: string
    email: string
    password: string
    birthDate: string // YYYY-MM-DD
    gender: string // 未選択は ''
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

// ブラウザに「ログイン中」の印を保存するときの名前
const STORAGE_KEY = 'skillswap_logged_in'

export async function signIn(email: string, password: string): Promise<void> {
    void email
    void password
    await wait(400)
    localStorage.setItem(STORAGE_KEY, 'true')
}

export async function signUp(input: SignUpInput): Promise<void> {
    void input
    await wait(400)
    localStorage.setItem(STORAGE_KEY, 'true')
}

export async function signInWithGoogle(): Promise<void> {
    await wait(400)
    localStorage.setItem(STORAGE_KEY, 'true')
}

// ログアウトする(印を消す)
export function signOut(): void {
    localStorage.removeItem(STORAGE_KEY)
}

// ログインしているか調べる
export function isLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_KEY) === 'true'
}