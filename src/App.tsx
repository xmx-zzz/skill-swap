import Chat from "./pages/Chat";
import { useMemo, useState } from "react";
import "./App.css";


function SkillExchange() {
const handleOpenChat = () => {
    setCurrentPage("chat");
    setHasUnreadMessages(false);
  };

  // スキル検索画面へ戻る
  const handleBackToDiscover = () => {
    setCurrentPage("discover");
  };

  // チャット画面
  if (currentPage === "chat") {
    return (
      <div className="chat-page-wrapper">

        {/* チャット画面上部のナビゲーション */}
        <div className="chat-navigation">
          <button
            className="back-to-discover-button"
            onClick={handleBackToDiscover}
          >
              },
            ← スキル検索に戻る
          </button>
        </div>

        {/* チャット本体 */}
        <Chat />

      </div>
    );
  }


// 画面全体の管理
export default function App() {
    return <div>Skill Swap</div>
}
