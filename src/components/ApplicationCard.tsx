import { Icon } from '@iconify/react'
import { STATUS_LABEL, formatDate } from '../lib/applications'
import type { Application } from '../lib/applications'
import './ApplicationCard.css'

// スキル名に対応するアイコン。ここに足せば、ほかのスキルにもアイコンが付く
const SKILL_ICONS: Record<string, string> = {
  Photoshop: 'logos:adobe-photoshop',
  Illustrator: 'logos:adobe-illustrator',
  Figma: 'logos:figma',
}

// 相手のアイコン(画像が無いときの代わり。色だけ変えられる)
function Avatar({ color }: { color: string }) {
    return (
      <span className="app-card__avatar" style={{ color }} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <circle cx="12" cy="12" r="12" fill="currentColor" />
          <circle cx="12" cy="9.5" r="4" fill="#fff" />
          <path d="M3.5 19.8C5 15.5 8.2 14 12 14s7 1.5 8.5 5.8A12 12 0 0 1 12 24a12 12 0 0 1-8.5-4.2Z" fill="#fff" />
        </svg>
      </span>
    )
}

// スキル名の小さなタグ
function SkillChip({ name }: { name: string }) {
    const icon = SKILL_ICONS[name]
    return (
        <span className="app-card__skill">
        {icon && <Icon icon={icon} width="24" height="24" />}
        {name}
        </span>
    )
}

export default function ApplicationCard({ application }: { application: Application }) {
    const { partner, offeredSkill, wantedSkill, message, date, status } = application

    return (
        <li className="app-card">
        {/* 左: 相手 */}
        <div className="app-card__partner">
            <Avatar color={partner.avatarColor} />
            <div>
            <p className="app-card__name">{partner.name}</p>
            <p className="app-card__meta">
            <span>{partner.prefecture}</span>
            <span>{partner.age}歳</span>
          </p>
            </div>
        </div>

        {/* 中: スキルの交換とひとこと */}
        <div className="app-card__body">
            <div className="app-card__swap">
            <SkillChip name={offeredSkill} />
            <Icon className="app-card__arrow" icon="mdi:swap-horizontal" width="32" height="32" aria-hidden="true" />
            <SkillChip name={wantedSkill} />
            </div>
            <p className="app-card__message">{message}</p>
        </div>

        {/* 右: 日付と状態 */}
        <div className="app-card__status">
            <p className="app-card__date">{formatDate(date)}</p>
            <span className={`app-card__badge app-card__badge--${status}`}>
            {status === 'pending' && <Icon icon="mdi:clock" width="18" height="18" aria-hidden="true" />}
            {STATUS_LABEL[status]}
            </span>
        </div>
        </li>
    )
}