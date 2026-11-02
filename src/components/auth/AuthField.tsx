import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
    label: string
    labelNote?: string // 「(確認用)」のような小さい補足
    icon: ReactNode
    error?: string
}

export default function AuthField({ label, labelNote, icon, error, ...inputProps }: Props) {
    const id = useId()
    const errorId = `${id}-error`

    return (
        <div className="auth-field">
        <label className="auth-field__label" htmlFor={id}>
            {label}
            {labelNote && <small>{labelNote}</small>}
        </label>
        <div className="auth-field__control" data-invalid={error ? 'true' : undefined}>
            <span className="auth-field__icon" aria-hidden="true">
            {icon}
            </span>
            <input
            id={id}
            className="auth-field__input"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            {...inputProps}
            />
        </div>
        {error && (
            <p id={errorId} className="auth-field__error" role="alert">
            {error}
            </p>
        )}
        </div>
    )
    }