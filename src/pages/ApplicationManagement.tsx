// 申請管理画面
// 小川
import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import ApplicationCard from '../components/ApplicationCard'
import { loadApplications } from '../lib/applications'
import type { Application, ApplicationDirection } from '../lib/applications'
import './ApplicationManagement.css'

type Tab = 'sent' | 'received' | 'completed'

// タブの名前とアイコン(ここを直せば、タブの表示が変わる)
const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'sent', label: '送った申請', icon: 'mdi:send-outline' },
    { key: 'received', label: '受け取った申請', icon: 'mdi:tray-arrow-down' },
    { key: 'completed', label: '成立した交換', icon: 'mdi:check-circle' },
]

// 1ページに出す件数
const PAGE_SIZE = 5

// 選んでいるタブに合う申請だけを残す
function filterByTab(list: Application[], tab: Tab): Application[] {
    if (tab === 'completed') return list.filter((a) => a.status === 'completed')

    const direction: ApplicationDirection = tab === 'sent' ? 'sent' : 'received'
    return list.filter((a) => a.direction === direction && a.status !== 'completed')
    }

    export default function ApplicationManagement() {
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState<Tab>('sent')
    const [page, setPage] = useState(1)

    // 画面が表示されたときに、1回だけ申請の一覧を読み込む
    useEffect(() => {
        async function load() {
        setApplications(await loadApplications())
        setLoading(false)
        }
        load()
    }, [])

    // タブを切り替えたら、1ページ目に戻す
    function changeTab(next: Tab) {
        setTab(next)
        setPage(1)
    }

    // ここから下は「覚えている値」から計算で求めたもの
    const sentCount = filterByTab(applications, 'sent').length
    const visible = filterByTab(applications, tab)
    const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
    const pageItems = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
        <main className="app-mgmt">
        <header className="app-mgmt__head">
            <h1 className="app-mgmt__title">申請管理</h1>
            <p className="app-mgmt__lead">スキル交換の申請を確認、管理ができます。</p>
        </header>

        {/* タブ */}
        <div className="app-mgmt__tabs" role="tablist">
            {TABS.map(({ key, label, icon }) => (
            <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                className={`app-mgmt__tab ${tab === key ? 'is-active' : ''}`}
                onClick={() => changeTab(key)}
            >
                <Icon icon={icon} width="24" height="24" aria-hidden="true" />
                {label}
                {key === 'sent' && sentCount > 0 && (
                <span className="app-mgmt__count" aria-label={`${sentCount}件`}>
                    {sentCount}
                </span>
                )}
            </button>
            ))}
        </div>

        {/* 一覧 */}
        <div role="tabpanel">
            {loading ? (
            <p className="app-mgmt__message">読み込み中...</p>
            ) : visible.length === 0 ? (
            <p className="app-mgmt__message">該当する申請はありません。</p>
            ) : (
            <ul className="app-mgmt__list">
                {pageItems.map((application) => (
                <ApplicationCard key={application.id} application={application} />
                ))}
            </ul>
            )}
        </div>

        {/* ページ送り */}
        {!loading && (
            <nav className="app-mgmt__pager" aria-label="ページ送り">
            <button
                type="button"
                className="app-mgmt__arrow"
                aria-label="前のページ"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
            >
                <Icon icon="mdi:chevron-left" width="40" height="40" aria-hidden="true" />
            </button>

            {pages.map((n) => (
                <button
                key={n}
                type="button"
                className={`app-mgmt__page ${n === page ? 'is-current' : ''}`}
                aria-current={n === page ? 'page' : undefined}
                onClick={() => setPage(n)}
                >
                {n}
                </button>
            ))}

            <button
                type="button"
                className="app-mgmt__arrow"
                aria-label="次のページ"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
            >
                <Icon icon="mdi:chevron-right" width="40" height="40" aria-hidden="true" />
            </button>
            </nav>
        )}
        </main>
    )
}