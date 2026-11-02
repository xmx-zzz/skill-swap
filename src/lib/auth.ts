// 認証まわりの窓口。いまは仮実装(少し待って成功扱いにするだけ)。
// TODO: Supabase Auth と接続する。画面側は変えずに、この3つの中身だけ差し替える想定。
//       service_role キーはフロントに置かない。

export type SignUpInput = {
    username: string
    email: string
    password: string
    birthDate: string // YYYY-MM-DD
    gender: string // 未選択は ''
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function signIn(email: string, password: string): Promise<void> {
    void email
    void password
    await wait(400)
}

export async function signUp(input: SignUpInput): Promise<void> {
    void input
    await wait(400)
}

export async function signInWithGoogle(): Promise<void> {
    await wait(400)
}