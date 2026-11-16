// プロフィール画像を、小さな正方形に縮めて、文字(data URL)にする。
// いまは localStorage に保存するため、小さくしている。
// TODO: Supabase Storage につなぐときは、ここで縮めたあとの画像を、アップロードする形に変える。

const AVATAR_SIZE = 256 // 縦横のピクセル数
const MAX_FILE_BYTES = 5 * 1024 * 1024 // 選べる画像は5MBまで
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp']

// 失敗したときは、画面にそのまま出せる日本語のメッセージで Error を投げる
export async function fileToAvatarDataUrl(file: File): Promise<string> {
    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error('PNG・JPEG・WebPの画像を選んでください')
    }
    if (file.size > MAX_FILE_BYTES) {
        throw new Error('画像は5MB以下のものを選んでください')
    }

    let bitmap: ImageBitmap
    try {
        bitmap = await createImageBitmap(file)
    } catch {
        throw new Error('画像を読み込めませんでした。別の画像を選んでください')
    }

    try {
        // 長い辺を切り落として、真ん中の正方形を取り出す
        const side = Math.min(bitmap.width, bitmap.height)
        const sx = (bitmap.width - side) / 2
        const sy = (bitmap.height - side) / 2

        const canvas = document.createElement('canvas')
        canvas.width = AVATAR_SIZE
        canvas.height = AVATAR_SIZE

        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('画像を処理できませんでした')

        // 透明な部分が黒くならないように、先に白で塗る
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE)
        ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE)

        return canvas.toDataURL('image/jpeg', 0.85)
    } finally {
        bitmap.close()
    }
}