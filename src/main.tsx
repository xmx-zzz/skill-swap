// アプリの入口。URLの振り分けは AppRouter が担当する。
// ルーター(<BrowserRouter>)は AppRouter の中で用意しているので、ここでは包まない。
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import AppRouter from './AppRouter.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
