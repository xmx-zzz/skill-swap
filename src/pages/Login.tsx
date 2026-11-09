import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthDivider from '../components/auth/AuthDivider'
import AuthField from '../components/auth/AuthField'
import AuthLogo from '../components/auth/AuthLogo'
import GoogleButton from '../components/auth/GoogleButton'
import { LockIcon, MailIcon } from '../components/auth/AuthIcons'
import { signIn, signInWithGoogle } from '../lib/auth'
import { validateEmail } from '../lib/validation'
import '../components/auth/auth.css'
import './Login.css'

type Errors = { email?: string; password?: string }

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<Errors>({})
    const [formError, setFormError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setFormError('')

        const next: Errors = {}
        const emailError = validateEmail(email)
        if (emailError) next.email = emailError
        if (!password) next.password = 'パスワードを入力してください'
        setErrors(next)
        if (Object.keys(next).length > 0) return

        setSubmitting(true)
        try {
        await signIn(email.trim(), password)
        navigate('/discover')
        } catch {
        setFormError('ログインできませんでした。メールアドレスとパスワードを確認してください')
        } finally {
        setSubmitting(false)
        }
    }

    async function handleGoogle() {
        setFormError('')
        setSubmitting(true)
        try {
        await signInWithGoogle()
        navigate('/discover')
        } catch {
        setFormError('Googleでログインできませんでした。もう一度お試しください')
        } finally {
        setSubmitting(false)
        }
    }

    return (
        <div className="auth-page">
        <header className="auth-header">
            <AuthLogo />
        </header>

        <main className="login__main">
            <section className="auth-banner login__banner">
            <Link className="login__register-link" to="/register">
                新規会員登録
            </Link>
            </section>

            <AuthDivider className="login__divider">すでにアカウントをお持ちの方</AuthDivider>

            <form className="login__form" onSubmit={handleSubmit} noValidate>
            <AuthField
                label="メールアドレス"
                icon={<MailIcon />}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="例) sample@skillswap.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
            />
            <AuthField
                label="パスワード"
                icon={<LockIcon />}
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="8文字以上の半角英数字で入力"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
            />

            {formError && (
                <p className="auth-form-error" role="alert">
                {formError}
                </p>
            )}

            <button className="auth-button auth-button--primary" type="submit" disabled={submitting}>
                ログイン
            </button>

            <AuthDivider>または</AuthDivider>

            <GoogleButton onClick={handleGoogle} disabled={submitting}>
                Googleでログイン
            </GoogleButton>
            </form>
        </main>
        </div>
    )
}