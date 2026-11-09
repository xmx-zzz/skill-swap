// スキルタグ部品
import type { Skill } from '../lib/skillswap';
import './SkillTag.css';


interface Props {
    skill: Skill;
    tone?: 'teach' | 'learn' | 'plain';
    /** true にするとカテゴリー名を小さく併記する */
    showCategory?: boolean;
}

export function SkillTag({ skill, tone = 'plain', showCategory = false }: Props) {
    return (
        <span className={`ss-tag ss-tag--${tone}`}>
            {skill.name}
            {showCategory && <span className="ss-tag__cat">{skill.category}</span>}
        </span>
    );
}