import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Icon } from '@iconify/react'
import './SkillTagEditor.css'

type Props = {
    title: string // カードの見出し
    skills: string[] // いま登録されているスキル
    onChange: (skills: string[]) => void // スキルが変わったときに呼ぶ
    maxCount?: number // 登録できる最大数
    maxLength?: number // 1つのスキル名の最大文字数
}

export default function SkillTagEditor({ title, skills, onChange, maxCount = 10, maxLength = 20 }: Props) {
    // 追加の入力欄を開いているか / 入力中の文字 / エラー(この部品の中だけで使う)
    const [adding, setAdding] = useState(false)
    const [draft, setDraft] = useState('')
    const [error, setError] = useState('')

    function add() {
        const name = draft.trim()
        if (!name) {
            setError('スキル名を入力してください')
            return
        }
        if (name.length > maxLength) {
            setError(`スキル名は${maxLength}文字以内で入力してください`)
            return
        }
        if (skills.some((skill) => skill.toLowerCase() === name.toLowerCase())) {
            setError('すでに追加されています')
            return
        }
        if (skills.length >= maxCount) {
            setError(`スキルは${maxCount}個までです`)
            return
        }

        onChange([...skills, name])
        setDraft('')
        setError('')
    }

    function remove(name: string) {
        onChange(skills.filter((skill) => skill !== name))
    }

    function close() {
        setAdding(false)
        setDraft('')
        setError('')
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        // 日本語の変換を確定するEnterは、追加として扱わない
        if (e.key !== 'Enter' || e.nativeEvent.isComposing) return
        // Enterでフォーム全体が送信されないようにする
        e.preventDefault()
        add()
    }

    return (
        <div className="skill-editor">
            <div className="skill-editor__head">
                <h2 className="skill-editor__title">{title}</h2>
                <button
                    type="button"
                    className="skill-editor__add"
                    aria-expanded={adding}
                    onClick={() => setAdding(true)}
                >
                    <Icon icon="mdi:plus" width="20" height="20" aria-hidden="true" />
                    スキルを追加する
                </button>
            </div>

            {adding && (
                <div className="skill-editor__form">
                    <input
                        className="skill-editor__input"
                        type="text"
                        value={draft}
                        maxLength={maxLength}
                        placeholder="スキル名(例: Photoshop)"
                        aria-label={`${title}に追加するスキル名`}
                        autoFocus
                        onChange={(e) => {
                            setDraft(e.target.value)
                            setError('')
                        }}
                        onKeyDown={handleKeyDown}
                    />
                    <button type="button" className="skill-editor__confirm" onClick={add}>
                        追加
                    </button>
                    <button type="button" className="skill-editor__close" onClick={close}>
                        閉じる
                    </button>
                </div>
            )}

            {error && (
                <p className="skill-editor__error" role="alert">
                    {error}
                </p>
            )}

            {skills.length === 0 ? (
                <p className="skill-editor__empty">まだ登録されていません。</p>
            ) : (
                <ul className="skill-editor__tags">
                    {skills.map((name) => (
                        <li key={name} className="skill-editor__tag">
                            <span>{name}</span>
                            <button
                                type="button"
                                className="skill-editor__remove"
                                aria-label={`${name}を削除`}
                                onClick={() => remove(name)}
                            >
                                <Icon icon="mdi:close" width="16" height="16" aria-hidden="true" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}