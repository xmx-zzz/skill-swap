import { useState } from 'react'
import type { FormEvent } from 'react'
import { COMMENT_MAX, commentError, normalizeComment } from '../lib/requestComment'
import './RequestCommentForm.css'

type Props = {
    sending: boolean // 送信中か
    onSubmit: (comment: string) => void // 「申請を送る」を押したとき
    onCancel: () => void // 「キャンセル」を押したとき
}

export default function RequestCommentForm({ sending, onSubmit, onCancel }: Props) {
    const [comment, setComment] = useState('')
    const [error, setError] = useState('')

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const text = normalizeComment(comment)
        const message = commentError(text)
        setError(message)
        if (message) return

        onSubmit(text)
    }

    return (
        <form className="request-comment" onSubmit={handleSubmit} noValidate>
            <label className="request-comment__label" htmlFor="request-comment-input">
                一言コメント(任意)
            </label>

            <input
                id="request-comment-input"
                className="request-comment__input"
                type="text"
                value={comment}
                maxLength={COMMENT_MAX}
                placeholder="例) Figmaの使い方を教えてほしいです！"
                autoFocus
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'request-comment-error' : undefined}
                onChange={(e) => setComment(e.target.value)}
            />
            <p className="request-comment__counter">
                {comment.length}/{COMMENT_MAX}
            </p>

            {error && (
                <p id="request-comment-error" className="request-comment__error" role="alert">
                    {error}
                </p>
            )}

            <div className="request-comment__actions">
                <button type="submit" className="request-comment__send" disabled={sending}>
                    {sending ? '送信中…' : '申請を送る'}
                </button>
                <button type="button" className="request-comment__cancel" onClick={onCancel} disabled={sending}>
                    キャンセル
                </button>
            </div>
        </form>
    )
}