// 画面全体の管理
import { Navigate, Route, Routes } from 'react-router-dom';
import SearchResults from './pages/SearchResults';
import MemberList from './pages/MemberList';
import MemberDetail from './pages/MemberDetail';


export default function App() {
    return (
        <Routes>
            {/* 検索結果一覧（スキル一覧）*/}
            <Route path="search" element={<SearchResults />} />
            {/* メンバー一覧（?skill=ID でスキル保持者のみ / ?sort= で並び順）*/}
            <Route path="members" element={<MemberList />} />
            {/* 個人User詳細（％表示 + 交換申請）*/}
            <Route path="members/:id" element={<MemberDetail />} />
            {/* 想定外のURLは検索画面へ */}
            <Route path="*" element={<Navigate to="/search" replace />} />
        </Routes>
    );
}