
// URLごとに表示する画面を振り分ける。
// App.tsx はスキル交換画面(別の人が作成)なので、ここから呼び出している。
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import SkillExchange from './App'
import ProtectedRoute from './ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ProfileEdit from './pages/ProfileEdit'

// メンバー・検索担当の3画面
import SearchResults from './pages/SearchResults'
import MemberList from './pages/MemberList'
import MemberDetail from './pages/MemberDetail'

import PopularSkills from './pages/PopularSkills'
import Home from './pages/Home'
import ApplicationManagement from './pages/ApplicationManagement'
import Notice from './pages/Notice'

import MainLayout from './layouts/MainLayout'

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* トップ(/)を開いたら、ログイン画面に移動する */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* サイドバーを表示する画面 */}
                <Route element={<MainLayout />}>
                    <Route path="/discover" element={<SkillExchange />} />
                    <Route path="/home" element={<Home />} />

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

                    <Route path="/skills" element={<PopularSkills />} />
                    <Route path="/notice" element={<Notice />} />
                    <Route path="/application" element={<ApplicationManagement />} />

                    {/* 検索結果一覧（スキル一覧）*/}
                    <Route path="/search" element={<SearchResults />} />
                    {/* メンバー一覧（?skill=ID でスキル保持者のみ / ?sort= で並び順）*/}
                    <Route path="/members" element={<MemberList />} />
                    {/* 個人User詳細（％表示 + 交換申請）*/}
                    <Route path="/members/:id" element={<MemberDetail />} />
                </Route>

                {/* それ以外のURLも、いまのところログイン画面に移動する */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}
