// プロフィール画面
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EMPTY_PROFILE, loadProfile } from '../lib/profile'
import type { Profile as ProfileData } from '../lib/profile'
import './Profile.css'

// スキルを並べて表示する小さな部品
function SkillList({ skills }: { skills: string[] }) {
    if (skills.length === 0) return <span>未設定</span>

    return (
        <ul className="profile__skills">
        {skills.map((skill) => (
            <li key={skill} className="profile__skill">
            {skill}
            </li>
        ))}
        </ul>
    )
    }

    export default function Profile() {
    const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE)
    const [loading, setLoading] = useState(true)

    // 画面が表示されたときに、1回だけ保存済みのプロフィールを読み込む
    useEffect(() => {
        async function load() {
        setProfile(await loadProfile())
        setLoading(false)
        }
        load()
    }, [])

    if (loading) return <p className="profile__message">読み込み中...</p>

    const isEmpty =
        !profile.username &&
        !profile.school &&
        !profile.description &&
        profile.teaches.length === 0 &&
        profile.learns.length === 0

    return (
        <main className="profile">
        <h1 className="profile__title">プロフィール</h1>

        {isEmpty ? (
            <p className="profile__message">まだプロフィールが登録されていません。</p>
        ) : (
            <dl className="profile__list">
            <div className="profile__item">
                <dt>ユーザー名</dt>
                <dd>{profile.username || '未設定'}</dd>
            </div>
            <div className="profile__item">
                <dt>学校・学科</dt>
                <dd>{profile.school || '未設定'}</dd>
            </div>
            <div className="profile__item">
                <dt>自己紹介</dt>
                <dd>{profile.description || '未設定'}</dd>
            </div>
            <div className="profile__item">
                <dt>教えられるスキル</dt>
                <dd>
                <SkillList skills={profile.teaches} />
                </dd>
            </div>
            <div className="profile__item">
                <dt>学びたいスキル</dt>
                <dd>
                <SkillList skills={profile.learns} />
                </dd>
            </div>
            </dl>
        )}

        <Link className="profile__edit-link" to="/profile/edit">
            プロフィールを編集する
        </Link>
        </main>
    )
}