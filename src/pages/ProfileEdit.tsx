import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import SkillTagEditor from '../components/SkillTagEditor'
import { PREFECTURES, loadProfile, saveProfile } from '../lib/profile'
import './ProfileEdit.css'

// 入力欄で使う形。年齢は、入力欄の都合で「文字」として扱う
type FormValues = {
    username: string
    age: string
    prefecture: string
    description: string
    avatar: string
    teaches: string[]
    learns: string[]
}

type Errors = Partial<Record<'username' | 'age', string>>

// メッセージの最大文字数
const MESSAGE_MAX = 200

// 入力内容を全部チェックして、見つかったエラーを返す
function validate(v: FormValues): Errors {
    const errors: Errors = {}

    const username = v.username.trim()
    if (!username) errors.username = '名前を入力してください'
    else if (username.length > 20) errors.username = '名前は20文字以内で入力してください'

    if (v.age !== '') {
        const age = Number(v.age)
        if (!Number.isInteger(age) || age < 0 || age > 120) {
            errors.age = '年齢は0〜120の整数で入力してください'
        }
    }

    return errors
}

// プロフィール画像が無いときの、人型のアイコン
function DefaultAvatar() {
    return (
        <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
            <circle cx="12" cy="12" r="12" fill="currentColor" />
            <circle cx="12" cy="9.5" r="4" fill="#fff" />
            <path d="M3.5 19.8C5 15.5 8.2 14 12 14s7 1.5 8.5 5.8A12 12 0 0 1 12 24a12 12 0 0 1-8.5-4.2Z" fill="#fff" />
        </svg>
    )
}

// 「項目名 + 入力欄 + 補足 + エラー」の1セット。デザインが変わったら、ここを直す
function Field({
    label,
    counter,
    error,
    children,
}: {
    label: string
    counter?: string
    error?: string
    children: ReactNode
}) {
    return (
        <label className="profile-edit__field">
            <span className="profile-edit__label">{label}</span>
            {children}
            {counter && <span className="profile-edit__counter">{counter}</span>}
            {error && (
                <span className="profile-edit__error" role="alert">
                    {error}
                </span>
            )}
        </label>
    )
}

export default function ProfileEdit() {
    const [values, setValues] = useState<FormValues>({
        username: '',
        age: '',
        prefecture: '',
        description: '',
        avatar: '',
        teaches: [],
        learns: [],
    })
    const [errors, setErrors] = useState<Errors>({})
    const [loading, setLoading] = useState(true)
    const [formError, setFormError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()

    // 画面が表示されたときに、1回だけ保存済みのプロフィールを入力欄に入れる
    useEffect(() => {
        async function load() {
            const saved = await loadProfile()
            setValues({
                username: saved.username,
                age: saved.age === null ? '' : String(saved.age),
                prefecture: saved.prefecture,
                description: saved.description,
                avatar: saved.avatar,
                teaches: saved.teaches,
                learns: saved.learns,
            })
            setLoading(false)
        }
        load()
    }, [])

    // 1つの項目だけ書き換える(他の項目はそのまま)
    function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
        setValues((prev) => ({ ...prev, [key]: value }))
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setFormError('')

        const next = validate(values)
        setErrors(next)
        if (Object.keys(next).length > 0) return

        setSubmitting(true)
        try {
            await saveProfile({
                username: values.username.trim(),
                age: values.age === '' ? null : Number(values.age),
                prefecture: values.prefecture,
                description: values.description.trim(),
                avatar: values.avatar,
                teaches: values.teaches,
                learns: values.learns,
            })
            navigate('/profile')
        } catch {
            setFormError('保存できませんでした。もう一度お試しください')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <p className="profile-edit__message">読み込み中...</p>

    return (
        <main className="profile-edit">
            <header className="profile-edit__head">
                <h1 className="profile-edit__title">プロフィール</h1>
                <p className="profile-edit__lead">あなたのプロフィールを編集できます。</p>
            </header>

            <form className="profile-edit__form" onSubmit={handleSubmit} noValidate>
                {/* 基本情報 */}
                <section className="profile-edit__card">
                    <h2 className="profile-edit__card-title">基本情報</h2>

                    <div className="profile-edit__basic">
                        <div className="profile-edit__avatar">
                            <DefaultAvatar />
                        </div>

                        <div className="profile-edit__basic-fields">
                            <div className="profile-edit__row">
                                <Field label="名前" error={errors.username}>
                                    <input
                                        className="profile-edit__input"
                                        type="text"
                                        value={values.username}
                                        onChange={(e) => setField('username', e.target.value)}
                                    />
                                </Field>

                                <Field label="年齢" error={errors.age}>
                                    <input
                                        className="profile-edit__input"
                                        type="number"
                                        inputMode="numeric"
                                        min={0}
                                        max={120}
                                        value={values.age}
                                        onChange={(e) => setField('age', e.target.value)}
                                    />
                                </Field>

                                <Field label="出身地">
                                    <select
                                        className="profile-edit__input profile-edit__select"
                                        value={values.prefecture}
                                        onChange={(e) => setField('prefecture', e.target.value)}
                                    >
                                        <option value="">選択してください</option>
                                        {PREFECTURES.map((name) => (
                                            <option key={name} value={name}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            <Field label="メッセージ" counter={`${values.description.length}/${MESSAGE_MAX}`}>
                                <textarea
                                    className="profile-edit__input"
                                    rows={4}
                                    maxLength={MESSAGE_MAX}
                                    value={values.description}
                                    onChange={(e) => setField('description', e.target.value)}
                                />
                            </Field>
                        </div>
                    </div>
                </section>

                {/* スキル */}
                <div className="profile-edit__skills">
                    <section className="profile-edit__card">
                        <SkillTagEditor
                            title="スキル登録"
                            skills={values.teaches}
                            onChange={(skills) => setField('teaches', skills)}
                        />
                    </section>

                    <section className="profile-edit__card">
                        <SkillTagEditor
                            title="交換したいスキル登録"
                            skills={values.learns}
                            onChange={(skills) => setField('learns', skills)}
                        />
                    </section>
                </div>

                {formError && (
                    <p className="profile-edit__error profile-edit__form-error" role="alert">
                        {formError}
                    </p>
                )}

                <div className="profile-edit__actions">
                    <button className="profile-edit__save" type="submit" disabled={submitting}>
                        プロフィールを保存する
                    </button>
                </div>
            </form>
        </main>
    )
}