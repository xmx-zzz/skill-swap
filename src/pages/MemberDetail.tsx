// 個人詳細画面 （％表示）
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    calcMatch,
    createRequest,
    scoreLabel,
    toErrorMessage,
    useMe,
    useMember,
} from '../lib/skillswap';
import { hueOf, initialOf } from '../lib/avatar';
import { SkillTag } from '../components/SkillTag';
import './MemberDetail.css';

export default function MemberDetail() {
    // URLの :id（/members/xxxx の xxxx）を読む
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { state, reload } = useMember(id);
    const me = useMe();

    // 申請ボタンの状態（送信中 / 送信済み / エラー）
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const goBack = () => {
        const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
        if (idx > 0) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };


    /* ---------- 読み込み中 ---------- */
    if (state.status === 'loading' || state.status === 'idle') {
        return (
            <div className="md-page">
                <p className="md-loading">読み込み中…</p>
            </div>
        );
    }

    /* ---------- エラー ---------- */
    if (state.status === 'error') {
        return (
            <div className="md-page">
                <div className="md-empty" role="alert">
                    <p className="md-empty-text">{state.message}</p>
                    <button type="button" className="md-btn" onClick={() => void reload()}>
                        再読み込み
                    </button>
                </div>
            </div>
        );
    }

    /* ---------- 見つからない ---------- */
    const member = state.data;
    if (!member) {
        return (
            <div className="md-page">
                <div className="md-empty">
                    <h3 className="md-empty-title">メンバーが見つかりませんでした</h3>
                    <p className="md-empty-text">削除されたか、URLが間違っている可能性があります。</p>
                    <button type="button" className="md-btn" onClick={goBack}>
                        一覧に戻る
                    </button>
                </div>
            </div>
        );
    }

    /* ---------- 相性を計算（この1行が％の正体） ---------- */
    const match = calcMatch(me, member);
    const label = scoreLabel(match.score);
    // 相互マッチのときだけ申請できる（片方向では相手のメリットが無いため）
    const canRequest = match.tier === 'mutual';

    /** 交換申請を送る */
    const onRequest = async () => {
        if (!canRequest) return;
        setError('');
        setSending(true);
        try {
            await createRequest({
                targetId: member.id,
                offeredSkillId: match.give[0].id, // 自分が教えるスキル
                wantedSkillId: match.take[0].id, // 自分が学びたいスキル
                message: `${match.give[0].name}を教えるので、${match.take[0].name}を教えてください！`,
            });
            setSent(true);
        } catch (e) {
            setError(toErrorMessage(e));
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="md-page">
            <button type="button" className="md-back" onClick={() => navigate(-1)}>
                ← 戻る
            </button>

            {/* ---------- プロフィール ---------- */}
            <section className="md-profile">
                <span
                    className="md-avatar"
                    style={{
                        background: `hsl(${hueOf(member.id)} 62% 95%)`,
                        color: `hsl(${hueOf(member.id)} 55% 38%)`,
                    }}
                    aria-hidden="true"
                >
                    {initialOf(member.displayName)}
                </span>

                <div className="md-body">
                    <h1 className="md-name">{member.displayName}</h1>
                    <p className="md-meta">
                        {member.department}
                        {member.grade !== null && ` ／ ${member.grade}年`}
                    </p>
                    {member.bio && <p className="md-bio">{member.bio}</p>}
                </div>

                <div className="md-actions">
                    <button
                        type="button"
                        className="md-btn"
                        onClick={() => void onRequest()}
                        disabled={!canRequest || sent || sending}
                        title={canRequest ? undefined : '相互マッチした相手にのみ申請できます'}
                    >
                        {sent
                            ? '✓ 申請済み'
                            : sending
                                ? '送信中…'
                                : canRequest
                                    ? '交換を申請する'
                                    : '相互マッチなし'}
                    </button>
                    <Link to="/search" className="md-btn-ghost">
                        他の相手を探す
                    </Link>
                </div>
            </section>

            {error && (
                <p className="md-error" role="alert">
                    {error}
                </p>
            )}

            {/* ---------- ％表示 ---------- */}
            <section className="md-match" aria-label="相性">
                <div className="md-match-figure">
                    <span className={`md-match-num ${match.score < 40 ? 'is-low' : ''}`}>{match.score}</span>
                    <span className="md-match-percent">%</span>
                </div>
                <div className="md-match-text">
                    <p className="md-match-title">{label}</p>
                    <p className="md-match-reason">{match.reason}</p>
                    <div className="md-match-bar" aria-hidden="true">
                        <div className="md-match-fill" style={{ width: `${match.score}%` }} />
                    </div>
                </div>
            </section>

            {/* ---------- スキル2列 ---------- */}
            <div className="md-columns">
                <section className="md-panel" aria-labelledby="md-teach">
                    <h2 id="md-teach" className="md-panel-title">
                        教えられるスキル
                        <span className="md-panel-count">{member.teaches.length}</span>
                    </h2>
                    <div className="md-panel-tags">
                        {member.teaches.length > 0 ? (
                            member.teaches.map((s) => <SkillTag key={s.id} skill={s} tone="teach" showCategory />)
                        ) : (
                            <span className="md-panel-empty">まだ登録されていません</span>
                        )}
                    </div>
                </section>

                <section className="md-panel" aria-labelledby="md-learn">
                    <h2 id="md-learn" className="md-panel-title">
                        学びたいスキル
                        <span className="md-panel-count">{member.learns.length}</span>
                    </h2>
                    <div className="md-panel-tags">
                        {member.learns.length > 0 ? (
                            member.learns.map((s) => <SkillTag key={s.id} skill={s} tone="learn" showCategory />)
                        ) : (
                            <span className="md-panel-empty">まだ登録されていません</span>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}