// 入力チェック。エラーがなければ空文字、あればメッセージを返す。

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_PATTERN = /^[A-Za-z0-9]{8,}$/

export function validateEmail(value: string): string {
    const email = value.trim()
    if (!email) return 'メールアドレスを入力してください'
    if (!EMAIL_PATTERN.test(email)) return 'メールアドレスの形式で入力してください(例: sample@skillswap.com)'
    return ''
}

// 新規登録用。ログインでは入力済みかだけ確認する(登録時のルールを漏らさないため)
export function validatePassword(value: string): string {
    if (!value) return 'パスワードを入力してください'
    if (!PASSWORD_PATTERN.test(value)) return '8文字以上の半角英数字で入力してください'
    return ''
}

export function validateBirthDate(year: string, month: string, day: string): string {
    if (!year || !month || !day) return '生年月日を年・月・日すべて選んでください'
    const y = Number(year)
    const m = Number(month)
    const d = Number(day)
    const date = new Date(y, m - 1, d)
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
        return '存在しない日付です。年・月・日を確認してください'
    }
    if (date > new Date()) return '未来の日付は選べません'
    return ''
}