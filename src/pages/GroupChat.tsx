
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useParams } from "react-router-dom";
import "./GroupChat.css";

// ========================================
// データ型
// ========================================

type Group = {
  id: number;
  name: string;
  description: string;
  icon: string;
  members: number;
};

type Message = {
  id: number;
  groupId: number;
  author: string;
  content: string;
  createdAt: string;
};

// ========================================
// 仮ユーザー情報
// ========================================

const CURRENT_USER = "自分";

// ========================================
// グループチャット
// ========================================

function GroupChat() {
  const { id } = useParams();
  const groupId = Number(id);

  // グループ情報
  const [groups] = useState<Group[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("skillSwapGroups") || "[]"
      ) as Group[];
    } catch {
      return [];
    }
  });

  const group = groups.find((item) => item.id === groupId);

  // メッセージ一覧
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("skillSwapGroupMessages") || "[]"
      ) as Message[];
    } catch {
      return [];
    }
  });

  const [message, setMessage] = useState("");

  // ========================================
  // 保存
  // ========================================

  useEffect(() => {
    localStorage.setItem(
      "skillSwapGroupMessages",
      JSON.stringify(messages)
    );
  }, [messages]);

  // ========================================
  // メッセージ送信
  // ========================================

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      groupId,
      author: CURRENT_USER,
      content: message.trim(),
      createdAt: new Date().toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  // Enterで送信（Shift + Enterは改行）
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing
    ) {
      e.preventDefault();
      sendMessage();
    }
  };
  

  // ========================================
  // グループが見つからない場合
  // ========================================

  if (!group) {
    return (
      <div className="group-chat-page">
        <h2>グループが見つかりません。</h2>
        <Link to="/groups">グループ一覧に戻る</Link>
      </div>
    );
  }

  // ========================================
  // 画面表示
  // ========================================

  return (
    <div className="group-chat-page">

      {/* ヘッダー */}
      <header className="group-chat-header">
        <Link
          to={`/groups/${groupId}`}
          className="group-chat-back"
        >
          <Icon icon="material-symbols:arrow-back" />
        </Link>

        <div className="group-chat-group-icon">
          {group.icon}
        </div>

        <div className="group-chat-group-info">
          <h1>{group.name}</h1>
          <span>{group.members}人のメンバー</span>
        </div>
      </header>

      {/* メッセージ一覧 */}
      <main className="group-chat-messages">

        {messages
          .filter((item) => item.groupId === groupId)
          .map((item) => {
            const isMine = item.author === CURRENT_USER;

            return (
              <div
                key={item.id}
                className={`group-chat-message ${
                  isMine ? "mine" : "other"
                }`}
              >
                {!isMine && (
                  <span className="group-chat-author">
                    {item.author}
                  </span>
                )}

                <div className="group-chat-message-row">

                  {!isMine && (
                    <div className="group-chat-avatar">
                      <Icon icon="material-symbols:person" />
                    </div>
                  )}

                  <div className="group-chat-bubble">
                    {item.content}
                  </div>

                  <span className="group-chat-time">
                    {item.createdAt}
                  </span>

                </div>
              </div>
            );
          })}

        {messages.filter((item) => item.groupId === groupId).length === 0 && (
          <div className="group-chat-empty">
            <Icon icon="material-symbols:chat-outline" />
            <p>まだメッセージがありません。</p>
            <span>最初のメッセージを送ってみよう！</span>
          </div>
        )}

      </main>

      {/* メッセージ入力 */}
      <footer className="group-chat-input-area">

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="メッセージを入力..."
          rows={1}
        />

        <button
          className="group-chat-send-button"
          onClick={sendMessage}
          disabled={!message.trim()}
        >
          <Icon icon="material-symbols:send" />
        </button>

      </footer>

    </div>
  );
}

export default GroupChat;
