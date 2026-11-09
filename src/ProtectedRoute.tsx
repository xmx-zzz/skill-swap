// ログインしている人だけ中の画面を見せる。していなければ /login に戻す。
import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { isLoggedIn } from './lib/auth'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />
    }
    return <>{children}</>
}