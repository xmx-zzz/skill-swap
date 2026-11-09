// URLごとに表示する画面を振り分ける。
// App.tsx はスキル交換画面(別の人が作成)なので、ここから呼び出している。
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SkillExchange from './App'
import ProtectedRoute from './ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ProfileEdit from './pages/ProfileEdit'

export default function AppRouter() {
    return (
        <BrowserRouter>
        <Routes>
            {/* トップ(/)を開いたら、ログイン画面に移動する */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* ログインしている人だけが見られる画面 */}
            <Route
            path="/profile"
            element={
                <ProtectedRoute>
                <Profile />
                </ProtectedRoute>
            }
            />
            <Route
            path="/profile/edit"
            element={
                <ProtectedRoute>
                <ProfileEdit />
                </ProtectedRoute>
            }
            />
            <Route path="/discover" element={<SkillExchange />} />
            {/* それ以外のURLも、いまのところログイン画面に移動する */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        </BrowserRouter>
    )
}