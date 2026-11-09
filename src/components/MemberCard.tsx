// カード部品（一覧で使う）
import { Link } from 'react-router-dom';
import type { Member } from '../lib/skillswap';
import { hueOf, initialOf } from '../lib/avatar';
import { SkillTag } from './SkillTag';
import './MemberCard.css';


interface Props {
    member: Member;
    /** 相性スコア。渡されたときだけ右上に「％」を出す */
    matchScore?: number;
}

export function MemberCard({ member, matchScore }: Props) {
    const hue = hueOf(member.id);

    return (
        <li className="mc-item">
            <Link to={`/members/${member.id}`} className="mc" aria-label={`${member.displayName}の詳細`}>
                {/* 頭文字アイコン + 名前 + 学科 */}
                <div className="mc-head">
                    <span
                        className="mc-avatar"
                        style={{ background: `hsl(${hue} 62% 95%)`, color: `hsl(${hue} 55% 38%)` }}
                        aria-hidden="true"
                    >
                        {initialOf(member.displayName)}
                    </span>
                    <div className="mc-names">
                        <p className="mc-name">{member.displayName}</p>
                        <p className="mc-meta">
                            {member.department}
                            {member.grade !== null && <span className="mc-grade">{member.grade}年</span>}
                        </p>
                    </div>
                    {typeof matchScore === 'number' && (
                        <span className={`mc-score ${matchScore < 40 ? 'is-low' : ''}`}>{matchScore}%</span>
                    )}
                </div>

                {member.bio && <p className="mc-bio">{member.bio}</p>}

                {/* 教えられる / 学びたい */}
                <div className="mc-skills">
                    <div>
                        <p className="mc-label">
                            <span className="mc-icon" style={{ color: '#2b9c79', background: '#e8f8f1' }} aria-hidden="true">↑</span>
                            教えられるスキル
                        </p>
                        <div className="mc-tags">
                            {member.teaches.length > 0 ? (
                                member.teaches.map((s) => <SkillTag key={s.id} skill={s} tone="teach" />)
                            ) : (
                                <span className="mc-none">未登録</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <p className="mc-label">
                            <span className="mc-icon" style={{ color: '#4388e7', background: '#edf5ff' }} aria-hidden="true">↓</span>
                            学びたいスキル
                        </p>
                        <div className="mc-tags">
                            {member.learns.length > 0 ? (
                                member.learns.map((s) => <SkillTag key={s.id} skill={s} tone="learn" />)
                            ) : (
                                <span className="mc-none">未登録</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mc-foot">
                    <span className="mc-more">詳細を見る →</span>
                </div>
            </Link>
        </li>
    );
}