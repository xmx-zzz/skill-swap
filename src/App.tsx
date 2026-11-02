// 画面全体の管理
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* TODO: Home.tsx ができたら差し替える(ログイン後の移動先を確認するための仮ページ) */}
            <Route
            path="/"
            element={
                <p style={{ padding: 24 }}>
                ホーム(仮)<Link to="/login">ログイン画面へ</Link>
                </p>
            }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        </BrowserRouter>
    )
}