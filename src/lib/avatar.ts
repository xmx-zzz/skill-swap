// 頭文字アイコンアイコン画像が無いときの代わり
/** 名前の1文字目を取り出す */
export function initialOf(name: string): string {
    const t = name.trim();
    return t ? t.slice(0, 1).toUpperCase() : '?';
}

/** 色相（0〜360）をIDから決める。IDが同じなら必ず同じ色 */
export function hueOf(id: string): number {
    let h = 0;
    for (let i = 0; i < id.length; i += 1) {
        h = (h * 31 + id.charCodeAt(i)) % 360;
    }
    return h;
}