// 申請に付ける一言コメントの決まり。
import { moderationError } from './moderation'

// 一言コメントの最大文字数
export const COMMENT_MAX = 50

// 入力された文字を整える(改行や連続した空白を1つのスペースにして、前後の空白を取る)
export function normalizeComment(text: string): string {
    return text.replace(/\s+/g, ' ').trim()
}

// 問題があればエラーメッセージを、なければ空文字を返す
export function commentError(text: string): string {
    if (text.length > COMMENT_MAX) {
        return `一言コメントは${COMMENT_MAX}文字以内で入力してください`
    }
    return moderationError(text)
}