import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthDivider from '../components/auth/AuthDivider'
import AuthField from '../components/auth/AuthField'
import AuthLogo from '../components/auth/AuthLogo'
import GoogleButton from '../components/auth/GoogleButton'
import { CalendarIcon, LockIcon, MailIcon, UserIcon } from '../components/auth/AuthIcons'
import { validateBirthDate, validateEmail, validatePassword } from '../lib/validation'
import { signInWithGoogle, signUp } from '../lib/auth'
import '../components/auth/auth.css'
import './Register.css'

    type Values = {
    username: string
    email: string
    year: string
    month: string
    day: string
    password: string
    passwordConfirm: string
    gender: string // 未選択は ''
    }

    type Errors = {
    username?: string
    email?: string
    birthDate?: string
    password?: string
    passwordConfirm?: string
    }

    // 選択肢の元になる配列
    const THIS_YEAR = new Date().getFullYear()
    const YEARS = Array.from({ length: THIS_YEAR - 1940 + 1 }, (_, i) => THIS_YEAR - i)
    const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
    const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

    const GENDER_OPTIONS = [
    { value: 'male', label: '男' },
    { value: 'female', label: '女' },
    { value: 'other', label: 'その他' },
    { value: 'no_answer', label: '回答しない' },
    ]

    // 入力内容を全部チェックして、見つかったエラーを返す
    function validate(v: Values): Errors {
    const errors: Errors = {}

    const username = v.username.trim()
    if (!username) errors.username = 'ユーザー名を入力してください'
    else if (username.length > 20) errors.username = 'ユーザー名は20文字以内で入力してください'

    const emailError = validateEmail(v.email)
    if (emailError) errors.email = emailError

    const birthError = validateBirthDate(v.year, v.month, v.day)
    if (birthError) errors.birthDate = birthError

    const passwordError = validatePassword(v.password)
    if (passwordError) errors.password = passwordError

    if (!v.passwordConfirm) errors.passwordConfirm = '確認のため、もう一度パスワードを入力してください'
    else if (v.password !== v.passwordConfirm) errors.passwordConfirm = 'パスワードが一致しません'

    return errors
    }

    export default function Register() {
    const [values, setValues] = useState<Values>({
        username: '',
        email: '',
        year: '',
        month: '',
        day: '',
        password: '',
        passwordConfirm: '',
        gender: '',
    })
    const [errors, setErrors] = useState<Errors>({})
    const [formError, setFormError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()

    // 1つの項目だけ書き換える(他の項目はそのまま)
    function setField(key: keyof Values, value: string) {
        setValues({ ...values, [key]: value })
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setFormError('')

        const next = validate(values)
        setErrors(next)
        if (Object.keys(next).length > 0) return

        setSubmitting(true)
        try {
        await signUp({
            username: values.username.trim(),
            email: values.email.trim(),
            password: values.password,
            birthDate: `${values.year}-${values.month.padStart(2, '0')}-${values.day.padStart(2, '0')}`,
            gender: values.gender,
        })
        navigate('/')
        } catch {
        setFormError('登録できませんでした。入力内容を確認して、もう一度お試しください')
        } finally {
        setSubmitting(false)
        }
    }

    async function handleGoogle() {
        setFormError('')
        setSubmitting(true)
        try {
        await signInWithGoogle()
        navigate('/')
        } catch {
        setFormError('Googleで登録できませんでした。もう一度お試しください')
        } finally {
        setSubmitting(false)
        }
    }

    const birthInvalid = errors.birthDate ? 'true' : undefined

    return (
        <div className="auth-page">
        <header className="auth-header">
            <AuthLogo />
            <p className="auth-header__switch">
            すでにアカウントをお持ちの方<Link to="/login">ログイン</Link>
            </p>
        </header>

        <form className="register__form" onSubmit={handleSubmit} noValidate>
            {/* 上のまとまり */}
            <div className="register__col">
            <section className="auth-banner register__banner">
                <h1 className="register__title">新規会員登録</h1>
                <p className="register__lead">
                あなたの得意なスキルを教えて、新しいスキルを学びましょう。まずは基本情報を入力してください。
                </p>
            </section>

            <AuthField
                label="ユーザー名"
                icon={<UserIcon />}
                type="text"
                name="username"
                autoComplete="nickname"
                placeholder="例) SKILL SWAP"
                value={values.username}
                onChange={(e) => setField('username', e.target.value)}
                error={errors.username}
            />

            <AuthField
                label="メールアドレス"
                icon={<MailIcon />}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="例) sample@skillswap.com"
                value={values.email}
                onChange={(e) => setField('email', e.target.value)}
                error={errors.email}
            />

            <fieldset className="register__group">
                <legend className="auth-field__label">生年月日</legend>
                <div className="register__birth-row">
                <div className="register__select-box" data-invalid={birthInvalid}>
                    <CalendarIcon />
                    <select
                    aria-label="年"
                    name="birth-year"
                    value={values.year}
                    onChange={(e) => setField('year', e.target.value)}
                    >
                    <option value="">年</option>
                    {YEARS.map((y) => (
                        <option key={y} value={y}>
                        {y}
                        </option>
                    ))}
                    </select>
                </div>

                <div className="register__select-box" data-invalid={birthInvalid}>
                    <select
                    aria-label="月"
                    name="birth-month"
                    value={values.month}
                    onChange={(e) => setField('month', e.target.value)}
                    >
                    <option value="">月</option>
                    {MONTHS.map((m) => (
                        <option key={m} value={m}>
                        {m}
                        </option>
                    ))}
                    </select>
                </div>

                <div className="register__select-box" data-invalid={birthInvalid}>
                    <select
                    aria-label="日"
                    name="birth-day"
                    value={values.day}
                    onChange={(e) => setField('day', e.target.value)}
                    >
                    <option value="">日</option>
                    {DAYS.map((d) => (
                        <option key={d} value={d}>
                        {d}
                        </option>
                    ))}
                    </select>
                </div>
                </div>
                {errors.birthDate && (
                <p className="auth-field__error register__birth-error" role="alert">
                    {errors.birthDate}
                </p>
                )}
            </fieldset>
            </div>

            {/* 下のまとまり */}
            <div className="register__col">
            <AuthField
                label="パスワード"
                icon={<LockIcon />}
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="8文字以上の半角英数字で入力"
                value={values.password}
                onChange={(e) => setField('password', e.target.value)}
                error={errors.password}
            />

            <AuthField
                label="パスワード"
                labelNote="(確認用)"
                icon={<LockIcon />}
                type="password"
                name="password-confirm"
                autoComplete="new-password"
                placeholder="8文字以上の半角英数字で入力"
                value={values.passwordConfirm}
                onChange={(e) => setField('passwordConfirm', e.target.value)}
                error={errors.passwordConfirm}
            />

            <fieldset className="register__group">
                <legend className="auth-field__label">
                性別<small>(任意)</small>
                </legend>
                <div className="register__gender-row">
                <span className="register__gender-icon" aria-hidden="true">
                    <UserIcon />
                </span>
                {GENDER_OPTIONS.map((option) => (
                    <label key={option.value} className="register__radio">
                    <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={values.gender === option.value}
                        onChange={() => setField('gender', option.value)}
                    />
                    {option.label}
                    </label>
                ))}
                </div>
            </fieldset>

            <div className="register__submit">
            {formError && (
                <p className="auth-form-error" role="alert">
                    {formError}
                </p>
            )}

                <button className="auth-button auth-button--primary" type="submit" disabled={submitting}>
                登録する
            </button>

            <AuthDivider>または</AuthDivider>

            <GoogleButton onClick={handleGoogle} disabled={submitting}>
                Googleで登録する
            </GoogleButton>

                {/* TODO: 利用規約・プライバシーポリシーのページができたら、リンク先を確認する */}
                <p className="register__note">
                登録することで、<Link to="/terms">利用規約</Link> と <Link to="/privacy">プライバシーポリシー</Link>{' '}
                に同意したものとみなします。
                </p>
            </div>
            </div>
        </form>
        </div>
    )
}