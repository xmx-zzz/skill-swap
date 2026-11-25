// 不適切な表現のチェック。申請コメントやチャットなど、文字を送る所で共通で使う。
// 画面側の「最初の防御」。サーバー側のチェックや、通報・ブロックの仕組みと組み合わせて使う。
// 言葉の一覧は完全にはできないので、使いながら足したり直したりする(最初は少なめ)。

// ---- 文字をそろえる ----
// 全角・半角、大文字・小文字、ひらがな・カタカナの違いや、
// 間に挟んだ空白・記号で、すり抜けられないようにする。

// 全角・半角と、大文字・小文字だけそろえる(メールアドレスやURLのチェック用)
function lightNormalize(text: string): string {
    return text.normalize('NFKC').toLowerCase()
}

// さらに、カタカナをひらがなにして、空白・記号・長音を取り除く
function heavyNormalize(text: string): string {
    return lightNormalize(text)
        .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
        .replace(/[\s\u200b-\u200d\ufeff・._\-~〜ー,、。!?*]/g, '')
}

// ---- チェックのルール ----
type Rule = {
    category: string // 画面に出す分類名(具体的な言葉は出さない)
    words: string[] // 含まれていたら止める言葉
    lightPatterns: RegExp[] // 含まれていたら止める形(空白・記号を残した文字で比べる)
    heavyPatterns: RegExp[] // 含まれていたら止める形(空白・記号を取った文字で比べる)
}

function makeRule(
    category: string,
    options: { words?: string[]; light?: RegExp[]; heavy?: RegExp[] },
): Rule {
    return {
        category,
        // 言葉は、チェックする文字と同じようにそろえておく
        words: (options.words ?? []).map(heavyNormalize),
        lightPatterns: options.light ?? [],
        heavyPatterns: options.heavy ?? [],
    }
}

// 「オンライン」「アップデート」「ばかり」のように、ふつうの言葉の一部にならないものだけを入れる
const RULES: Rule[] = [
    makeRule('性的な表現', {
        words: ['せっくす', 'えっち', 'えろい', 'おっぱい', 'すりーさいず'],
    }),
    makeRule('私生活・容姿への不適切な質問', {
        words: [
            'かれしいる',
            'かれしはいる',
            'かれしいます',
            'かれしはいます',
            'かのじょいる',
            'かのじょはいる',
            'かのじょいます',
            'かのじょはいます',
            '彼氏いる',
            '彼氏はいる',
            '彼氏います',
            '彼氏はいます',
            '彼女いる',
            '彼女はいる',
            '彼女います',
            '彼女はいます',
            'たいじゅうおしえ',
            'たいじゅう教え',
            'たいじゅういくつ',
            '体重おしえ',
            '体重教え',
            '体重いくつ',
        ],
    }),
    makeRule('暴言・中傷', {
        words: ['死ね', '殺す', 'ころす', '消えろ', 'きえろ', 'きもい', 'うざい', 'ばかやろう', 'あほか', 'くたばれ', 'ぶさいく'],
    }),
    makeRule('連絡先のやり取り', {
        words: [
            'らいんこうかん',
            'らいん交換',
            'らいんをおしえ',
            'らいんおしえ',
            'らいんを教え',
            'らいん教え',
            'らいんid',
            'line交換',
            'lineを教え',
            'line教え',
            'lineをおしえ',
            'lineおしえ',
            'lineid',
            'lineやってる',
            'らいんやってる',
            'いんすたをおしえ',
            'いんすたおしえ',
            'いんすたを教え',
            'いんすた教え',
            'れんらくさきをおしえ',
            'れんらくさきおしえ',
            '連絡先をおしえ',
            '連絡先おしえ',
            '連絡先を教え',
            '連絡先教え',
            'でんわばんごうをおしえ',
            '電話番号をおしえ',
            '電話番号を教え',
            '電話番号教え',
        ],
        // メールアドレス・URL
        light: [/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/, /https?:\/\/|www\./],
        // 電話番号(ハイフンを取ったあとの、0から始まる10〜11桁)
        heavy: [/(?<!\d)0\d{9,10}(?!\d)/],
    }),
]

export type ModerationResult = { ok: true } | { ok: false; category: string }

// 文字を調べて、止めるべきなら、その分類名を返す
export function checkText(text: string): ModerationResult {
    const light = lightNormalize(text)
    const heavy = heavyNormalize(text)

    for (const rule of RULES) {
        const hit =
            rule.words.some((word) => heavy.includes(word)) ||
            rule.lightPatterns.some((pattern) => pattern.test(light)) ||
            rule.heavyPatterns.some((pattern) => pattern.test(heavy))
        if (hit) return { ok: false, category: rule.category }
    }
    return { ok: true }
}

// 問題があれば画面に出すメッセージを、なければ空文字を返す
export function moderationError(text: string): string {
    const result = checkText(text)
    if (result.ok) return ''
    return `「${result.category}」にあたる表現が含まれている可能性があります。別の言い方にしてください。`
}

// 不適切な表現で止めたときに投げるエラー。画面側で、メッセージをそのまま表示できる目印になる
export class ModerationError extends Error {}