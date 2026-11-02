// URLごとに表示する画面を振り分ける。
// App.tsx はスキル交換画面(別の人が作成)なので、ここから呼び出している。
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import Login from './pages/Login'
import Register from './pages/Register'

export default function AppRouter() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* それ以外のURLは、いまのところスキル交換画面を表示する */}
            <Route path="*" element={<App />} />
        </Routes>
        </BrowserRouter>
    )
}