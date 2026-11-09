// 検索結果一覧
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    categoriesOf,
    filterByCategory,
    filterSkills,
    summarizeSkills,
    useMembers,
} from '../lib/skillswap';
import './SearchResults.css';

export default function SearchResults() {
    const [params, setParams] = useSearchParams();
    // ?q= を読む（無ければ空文字 = 全スキル表示）
    const keyword = params.get('q') ?? '';
    // ?category= を読む
    const category = params.get('category') ?? 'all';

    // 最初は9件だけ出し、「もっと見る」で全部表示する
    const [expanded, setExpanded] = useState(false);

    const { state, reload } = useMembers();

    // 取得した会員データから「スキルごとの人数」を作る（通信は増やさない）
    const allSkills = useMemo(
        () => summarizeSkills(state.status === 'success' ? state.data : []),
        [state],
    );
    const categories = useMemo(() => categoriesOf(allSkills), [allSkills]);

    // キーワード → カテゴリー の順に絞る
    const skills = useMemo(
        () => filterByCategory(filterSkills(allSkills, keyword), category),
        [allSkills, keyword, category],
    );

    const LIMIT = 9;
    const shown = expanded ? skills : skills.slice(0, LIMIT);

    /** カテゴリーを切り替える（URLを書き換える） */
    const changeCategory = (value: string) => {
        const next = new URLSearchParams(params);
        if (value === 'all') next.delete('category');
        else next.set('category', value);
        setParams(next);
        setExpanded(false);
    };

    return (
        <div className="ss-page">
            {/* ---------- 見出し ---------- */}
            <div className="ss-head">
                <span className="ss-eyebrow">SEARCH</span>
                <h1 className="ss-title">{keyword ? `「${keyword}」の検索結果` : 'スキルから探す'}</h1>
                <p className="ss-lead">
                    {keyword
                        ? 'スキルを選ぶと、教えられる人の一覧に移動します。'
                        : '登録されているスキルから探せます。人数が多い順に並んでいます。'}
                </p>
            </div>

            {/* ---------- エラー時 ---------- */}
            {state.status === 'error' ? (
                <div className="ss-error" role="alert">
                    <p>{state.message}</p>
                    <button type="button" className="ss-btn" onClick={() => void reload()}>
                        再読み込み
                    </button>
                </div>
            ) : (
                <>
                    {/* ---------- カテゴリーチップ ---------- */}
                    <div className="ss-chips">
                        <button
                            type="button"
                            className={`ss-chip ${category === 'all' ? 'is-active' : ''}`}
                            onClick={() => changeCategory('all')}
                        >
                            すべて
                        </button>
                        {categories.map((c) => (
                            <button
                                key={c}
                                type="button"
                                className={`ss-chip ${category === c ? 'is-active' : ''}`}
                                onClick={() => changeCategory(c)}
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    {/* ---------- 読み込み中 / 0件 / 一覧 ---------- */}
                    {state.status === 'loading' || state.status === 'idle' ? (
                        <div className="ss-skeletons" aria-busy="true" aria-label="読み込み中">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="ss-skeleton-row" />
                            ))}
                        </div>
                    ) : skills.length === 0 ? (
                        <div className="ss-empty">
                            <div className="ss-empty-icon" aria-hidden="true">
                                🔍
                            </div>
                            <h3 className="ss-empty-title">該当するスキルがありませんでした</h3>
                            <p className="ss-empty-text">
                                別のキーワードで検索するか、カテゴリーを「すべて」にしてみてください。
                            </p>
                            <button type="button" className="ss-btn" onClick={() => changeCategory('all')}>
                                カテゴリーをリセット
                            </button>
                        </div>
                    ) : (
                        <>
                            <ul className="ss-skill-list">
                                {shown.map(({ skill, holderCount }) => (
                                    <li key={skill.id}>
                                        {/* スキルを押すと「そのスキルを教えられる人」の一覧へ */}
                                        <Link to={`/members?skill=${skill.id}`} className="ss-skill-row">
                                            <div className="ss-skill-main">
                                                <span className="ss-skill-name">{skill.name}</span>
                                                <span className="ss-skill-cat">{skill.category}</span>
                                            </div>
                                            <span className="ss-skill-count">{holderCount}人</span>
                                            <span className="ss-skill-go" aria-hidden="true">
                                                →
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            {/* 9件を超えたら「もっと見る」 */}
                            {skills.length > LIMIT && !expanded && (
                                <button type="button" className="ss-more" onClick={() => setExpanded(true)}>
                                    もっと見る（残り {skills.length - LIMIT} 件）
                                </button>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}