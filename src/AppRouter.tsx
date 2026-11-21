
// ========================================
// ルーティング設定
// URLごとに表示する画面を振り分ける
// ========================================

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// アプリ本体
import SkillExchange from "./App";

// 認証関連
import ProtectedRoute from "./ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";

// プロフィール関連
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";

// ホーム・検索関連
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import PopularSkills from "./pages/PopularSkills";

// メンバー関連
import MemberList from "./pages/MemberList";
import MemberDetail from "./pages/MemberDetail";

// その他の画面
import Notice from "./pages/Notice";
import Chat from "./pages/Chat";
import Calendar from "./pages/Calendar";
import ApplicationManagement from "./pages/ApplicationManagement";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import GroupChat from "./pages/GroupChat";

// 共通レイアウト
import MainLayout from "./layouts/MainLayout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* トップページ */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ログイン・新規登録 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* サイドバー付き画面 */}
        <Route element={<MainLayout />}>

          {/* グループ */}
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
          <Route path="/groups/:id/chat" element={<GroupChat />} />

          {/* ホーム・スキル交換 */}
          <Route path="/discover" element={<SkillExchange />} />
          <Route path="/home" element={<Home />} />

          {/* 検索・スキル一覧 */}
          <Route path="/search" element={<SearchResults />} />
          <Route path="/skills" element={<PopularSkills />} />

          {/* メンバー */}
          <Route path="/members" element={<MemberList />} />
          <Route path="/members/:id" element={<MemberDetail />} />

          {/* お知らせ・チャット・カレンダー */}
          <Route path="/notice" element={<Notice />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/calendar" element={<Calendar />} />

          {/* 申請管理 */}
          <Route
            path="/application"
            element={<ApplicationManagement />}
          />

          {/* プロフィール（ログイン必須） */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* プロフィール編集（ログイン必須） */}
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <ProfileEdit />
              </ProtectedRoute>
            }
          />

        </Route>

        {/* 存在しないURLはログイン画面へ */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
