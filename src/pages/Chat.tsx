import { useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import "./Chat.css";

/* =========================
   型定義
========================= */

type Message = {
  id: number;
  sender: "me" | "other";
  text: string;
  time: string;
};

type ChatUser = {
  id: number;
  name: string;
  school: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  teaches: string[];
  learns: string[];
  messages: Message[];
};

/* =========================
   サンプルデータ
========================= */

const initialChats: ChatUser[] = [
  {
    id: 1,
    name: "佐藤 花子",
    school: "デザイン学科",
    avatar: "🌸",
    lastMessage: "Figmaについて教えてもらえますか？",
    lastTime: "14:30",
    unread: 2,
    online: true,
    teaches: ["HTML", "CSS", "Figma"],
    learns: ["JavaScript", "React"],
    messages: [
      {
        id: 1,
        sender: "other",
        text: "こんにちは！交換申請ありがとうございます！",
        time: "14:20",
      },
      {
        id: 2,
        sender: "me",
        text: "こんにちは！こちらこそありがとうございます！",
        time: "14:22",
      },
      {
        id: 3,
        sender: "other",
        text: "普段はどんなアプリを開発していますか？",
        time: "14:25",
      },
      {
        id: 4,
        sender: "me",
        text: "ReactとTypeScriptを使ったWebアプリを作っています！",
        time: "14:27",
      },
      {
        id: 5,
        sender: "other",
        text: "Figmaについて教えてもらえますか？",
        time: "14:30",
      },
    ],
  },
  {
    id: 2,
    name: "鈴木 健",
    school: "情報システム科",
    avatar: "👨‍💻",
    lastMessage: "Reactのコンポーネントについて話しましょう！",
    lastTime: "昨日",
    unread: 0,
    online: true,
    teaches: ["JavaScript", "React", "TypeScript"],
    learns: ["UIデザイン", "動画編集"],
    messages: [
      {
        id: 1,
        sender: "other",
        text: "はじめまして！",
        time: "昨日 16:10",
      },
      {
        id: 2,
        sender: "me",
        text: "はじめまして！よろしくお願いします！",
        time: "昨日 16:15",
      },
      {
        id: 3,
        sender: "other",
        text: "Reactのコンポーネントについて話しましょう！",
        time: "昨日 16:20",
      },
    ],
  },
  {
    id: 3,
    name: "高橋 美咲",
    school: "メディア学科",
    avatar: "🎨",
    lastMessage: "ありがとうございます！",
    lastTime: "月曜日",
    unread: 0,
    online: false,
    teaches: ["Premiere Pro", "動画編集"],
    learns: ["Illustrator", "Figma"],
    messages: [
      {
        id: 1,
        sender: "me",
        text: "動画編集についてお話を聞きたいです！",
        time: "月曜日 12:00",
      },
      {
        id: 2,
        sender: "other",
        text: "もちろんです！ぜひお話ししましょう！",
        time: "月曜日 12:05",
      },
      {
        id: 3,
        sender: "other",
        text: "ありがとうございます！",
        time: "月曜日 12:10",
      },
    ],
  },
];

/* =========================
   メインコンポーネント
========================= */

function Chat() {
  const [chats, setChats] = useState<ChatUser[]>(initialChats);
  const [selectedChatId, setSelectedChatId] = useState<number>(1);
  const [inputMessage, setInputMessage] = useState("");
  const [search, setSearch] = useState("");

  const selectedChat = chats.find(
    (chat) => chat.id === selectedChatId
  );

  /* =========================
     チャット一覧の検索
  ========================= */

  const filteredChats = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return chats.filter((chat) => {
      return (
        chat.name.toLowerCase().includes(keyword) ||
        chat.school.toLowerCase().includes(keyword)
      );
    });
  }, [chats, search]);

  /* =========================
     チャットの切り替え
  ========================= */

  const handleSelectChat = (chatId: number) => {
    setSelectedChatId(chatId);

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, unread: 0 }
          : chat
      )
    );
  };

  /* =========================
     メッセージ送信
  ========================= */

  const handleSendMessage = () => {
    const trimmedMessage = inputMessage.trim();

    if (!trimmedMessage || !selectedChat) {
      return;
    }

    const now = new Date();

    const time = now.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage: Message = {
      id: Date.now(),
      sender: "me",
      text: trimmedMessage,
      time,
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: trimmedMessage,
              lastTime: time,
            }
          : chat
      )
    );

    setInputMessage("");
  };

  /* =========================
     Enterキーで送信
  ========================= */

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  /* =========================
     JSX
  ========================= */

  return (
    <div className="chat-page">

      {/* ヘッダー */}

      <header className="chat-header">
        <div className="chat-header-inner">
          <a href="/discover" className="chat-logo">
            Skill<span>Swap</span>
          </a>

          <div className="chat-header-label">
            MESSAGE
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}

      <main className="chat-main">

        <div className="chat-page-heading">
          <div>
            <span className="chat-section-label">
              COMMUNICATION
            </span>

            <h1>メッセージ</h1>

            <p>
              スキル交換の相手とコミュニケーションを取りましょう。
            </p>
          </div>
        </div>

        <div className="chat-container">

          {/* =========================
              左側：チャット一覧
          ========================= */}

          <aside className="chat-sidebar">

            <div className="chat-sidebar-heading">
              <h2>メッセージ一覧</h2>

              <span>{chats.length}</span>
            </div>

            {/* ユーザー検索 */}

            <div className="chat-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="ユーザーを検索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* チャットユーザー */}

            <div className="chat-user-list">

              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  className={`chat-user-item ${
                    selectedChatId === chat.id ? "selected" : ""
                  }`}
                  onClick={() => handleSelectChat(chat.id)}
                >

                  <div className="chat-user-avatar">
                    {chat.avatar}

                    {chat.online && (
                      <span className="online-indicator" />
                    )}
                  </div>

                  <div className="chat-user-content">

                    <div className="chat-user-top">
                      <h3>{chat.name}</h3>

                      <span className="chat-user-time">
                        {chat.lastTime}
                      </span>
                    </div>

                    <div className="chat-user-bottom">
                      <p>{chat.lastMessage}</p>

                      {chat.unread > 0 && (
                        <span className="unread-badge">
                          {chat.unread}
                        </span>
                      )}
                    </div>

                  </div>

                </button>
              ))}

              {filteredChats.length === 0 && (
                <div className="chat-no-users">
                  ユーザーが見つかりませんでした。
                </div>
              )}

            </div>

          </aside>

          {/* =========================
              右側：会話画面
          ========================= */}

          <section className="chat-conversation">

            {selectedChat ? (
              <>

                {/* 相手のプロフィール */}

                <div className="conversation-header">

                  <div className="conversation-user">

                    <div className="conversation-avatar">
                      {selectedChat.avatar}

                      {selectedChat.online && (
                        <span className="online-indicator" />
                      )}
                    </div>

                    <div>
                      <h2>{selectedChat.name}</h2>

                      <p>
                        {selectedChat.online
                          ? "オンライン"
                          : selectedChat.school}
                      </p>
                    </div>

                  </div>

                  <div className="conversation-status">
                    <span className="status-dot" />

                    {selectedChat.online ? "ONLINE" : "OFFLINE"}
                  </div>

                </div>

                {/* スキル情報 */}

                <div className="conversation-profile">

                  <div className="profile-skill">

                    <span className="profile-skill-label">
                      ↑ 教えられるスキル
                    </span>

                    <div className="profile-tags">
                      {selectedChat.teaches.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>

                  </div>

                  <div className="profile-skill">

                    <span className="profile-skill-label">
                      ↓ 学びたいスキル
                    </span>

                    <div className="profile-tags learn">
                      {selectedChat.learns.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>

                  </div>

                </div>

                {/* メッセージ一覧 */}

                <div className="conversation-messages">

                  <div className="message-date">
                    <span>メッセージ</span>
                  </div>

                  {selectedChat.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message-row ${
                        message.sender === "me"
                          ? "my-message"
                          : "other-message"
                      }`}
                    >

                      {message.sender === "other" && (
                        <div className="message-avatar">
                          {selectedChat.avatar}
                        </div>
                      )}

                      <div className="message-content">

                        <div className="message-bubble">
                          {message.text}
                        </div>

                        <span className="message-time">
                          {message.time}
                        </span>

                      </div>

                    </div>
                  ))}

                </div>

                {/* メッセージ入力 */}

                <div className="message-input-area">

                  <textarea
                    value={inputMessage}
                    onChange={(e) =>
                      setInputMessage(e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="メッセージを入力してください..."
                    rows={1}
                  />

                  <button
                    className="message-send-button"
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                  >
                    <span>送信</span>
                    <span>➤</span>
                  </button>

                </div>

                <p className="message-input-note">
                  Enterで送信・Shift + Enterで改行
                </p>

              </>
            ) : (

              <div className="chat-empty">
                <div>💬</div>

                <h2>メッセージを選択してください</h2>

                <p>
                  左側の一覧から会話する相手を選択できます。
                </p>
              </div>

            )}

          </section>

        </div>

      </main>

      {/* フッター */}

      <footer className="chat-footer">
        <p>SkillSwap © 2026</p>

        <span>Share your skills, grow together.</span>
      </footer>

    </div>
  );
}

export default Chat;
