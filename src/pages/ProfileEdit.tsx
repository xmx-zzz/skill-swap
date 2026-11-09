import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loadProfile, saveProfile, skillsToText, textToSkills } from '../lib/profile'
import './ProfileEdit.css'

// 入力欄で使う形。スキルは「HTML, CSS」のような1つの文字として扱う
type FormValues = {
    username: string
    school: string
    description: string
    teaches: string
    learns: string
}

type Errors = Partial<Record<keyof FormValues, string>>

// スキル欄のチェック(10個まで、1つ20文字まで)
function checkSkills(text: string): string {
    const skills = textToSkills(text)
    if (skills.length > 10) return 'スキルは10個までです'
    if (skills.some((skill) => skill.length > 20)) return '1つのスキルは20文字以内で入力してください'
    return ''
}

// 入力内容を全部チェックして、見つかったエラーを返す
function validate(v: FormValues): Errors {
    const errors: Errors = {}

    const username = v.username.trim()
    if (!username) errors.username = 'ユーザー名を入力してください'
    else if (username.length > 20) errors.username = 'ユーザー名は20文字以内で入力してください'

    if (v.school.trim().length > 30) errors.school = '学校・学科は30文字以内で入力してください'
    if (v.description.length > 200) errors.description = '自己紹介は200文字以内で入力してください'

    const teachesError = checkSkills(v.teaches)
    if (teachesError) errors.teaches = teachesError

    const learnsError = checkSkills(v.learns)
    if (learnsError) errors.learns = learnsError

    return errors
}

// 「項目名 + 入力欄 + 補足 + エラー」の1セット。デザインが決まったら、ここを直す
function Field({
    label,
    hint,
    error,
    children,
    }: {
    label: string
    hint?: string
    error?: string
    children: ReactNode
    }) {
    return (
        <label className="profile-edit__field">
        <span className="profile-edit__label">{label}</span>
        {children}
        {hint && <span className="profile-edit__hint">{hint}</span>}
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
        school: '',
        description: '',
        teaches: '',
        learns: '',
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
            school: saved.school,
            description: saved.description,
            teaches: skillsToText(saved.teaches),
            learns: skillsToText(saved.learns),
        })
        setLoading(false)
        }
        load()
    }, [])

    // 1つの項目だけ書き換える(他の項目はそのまま)
    function setField(key: keyof FormValues, value: string) {
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
            await saveProfile({
                username: values.username.trim(),
                school: values.school.trim(),
                description: values.description.trim(),
                teaches: textToSkills(values.teaches),
                learns: textToSkills(values.learns),
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
        <h1 className="profile-edit__title">プロフィール編集</h1>

        <form className="profile-edit__form" onSubmit={handleSubmit} noValidate>
            <Field label="ユーザー名" error={errors.username}>
            <input
                className="profile-edit__input"
                type="text"
                value={values.username}
                onChange={(e) => setField('username', e.target.value)}
            />
            </Field>

            <Field label="学校・学科" error={errors.school}>
            <input
                className="profile-edit__input"
                type="text"
                value={values.school}
                onChange={(e) => setField('school', e.target.value)}
            />
            </Field>

            <Field label="自己紹介" hint="200文字まで" error={errors.description}>
            <textarea
                className="profile-edit__input"
                rows={5}
                value={values.description}
                onChange={(e) => setField('description', e.target.value)}
            />
            </Field>

            <Field label="教えられるスキル" hint="カンマ(,)で区切って入力(例: HTML, CSS)" error={errors.teaches}>
            <input
                className="profile-edit__input"
                type="text"
                value={values.teaches}
                onChange={(e) => setField('teaches', e.target.value)}
            />
            </Field>

            <Field label="学びたいスキル" hint="カンマ(,)で区切って入力(例: React, Figma)" error={errors.learns}>
            <input
                className="profile-edit__input"
                type="text"
                value={values.learns}
                onChange={(e) => setField('learns', e.target.value)}
            />
            </Field>

            {formError && (
            <p className="profile-edit__error" role="alert">
                {formError}
            </p>
            )}

            <div className="profile-edit__actions">
            <button className="profile-edit__save" type="submit" disabled={submitting}>
                保存する
            </button>
            <Link className="profile-edit__cancel" to="/profile">
                キャンセル
            </Link>
            </div>
        </form>
        </main>
    )
}