import { useMemo, useState } from "react";
import "./SkillExchange.css";

type User = {
  id: number;
  name: string;
  school: string;
  description: string;
  teaches: string[];
  learns: string[];
  avatar: string;
  category: string;
};

const users: User[] = [
  {
    id: 1,
    name: "佐藤 花子",
    school: "デザイン学科",
    description: "WebデザインやUIデザインを勉強しています！",
    teaches: ["HTML", "CSS", "Figma"],
    learns: ["JavaScript", "React"],
    avatar: "🌸",
    category: "デザイン",
  },
  {
    id: 2,
    name: "鈴木 健",
    school: "情報システム科",
    description: "Webアプリケーションの開発が得意です。",
    teaches: ["JavaScript", "React", "TypeScript"],
    learns: ["UIデザイン", "動画編集"],
    avatar: "👨‍💻",
    category: "プログラミング",
  },
  {
    id: 3,
    name: "高橋 美咲",
    school: "メディア学科",
    description: "動画編集や映像制作に取り組んでいます！",
    teaches: ["Premiere Pro", "動画編集"],
    learns: ["Illustrator", "Figma"],
    avatar: "🎨",
    category: "動画編集",
  },
  {
    id: 4,
    name: "伊藤 翔",
    school: "情報処理科",
    description: "Pythonを使ったプログラミングが好きです。",
    teaches: ["Python", "Java", "SQL"],
    learns: ["HTML", "CSS"],
    avatar: "🚀",
    category: "プログラミング",
  },
  {
    id: 5,
    name: "田中 太郎",
    school: "情報システム科",
    description: "Web制作やアプリ開発を勉強しています。",
    teaches: ["JavaScript", "React"],
    learns: ["Webデザイン", "Figma"],
    avatar: "💻",
    category: "プログラミング",
  },
];

const categories = [
  "すべて",
  "プログラミング",
  "デザイン",
  "動画編集",
];

function SkillExchange() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("すべて");
  const [tab, setTab] = useState<"all" | "matched">("all");
  const [requestedUsers, setRequestedUsers] = useState<number[]>([]);

  // 交換相性を計算
  const getMatchScore = (user: User) => {
    const commonSkills = user.teaches.filter((skill) =>
      user.learns.includes(skill)
    );

    return commonSkills.length > 0 ? 100 : 50;
  };

  // ユーザー検索・絞り込み
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        user.name.toLowerCase().includes(keyword) ||
        user.school.toLowerCase().includes(keyword) ||
        user.teaches.some((skill) =>
          skill.toLowerCase().includes(keyword)
        ) ||
        user.learns.some((skill) =>
          skill.toLowerCase().includes(keyword)
        );

      const matchesCategory =
        category === "すべて" || user.category === category;

      const matchesTab =
        tab === "all" || getMatchScore(user) === 100;

      return matchesSearch && matchesCategory && matchesTab;
    });
  }, [search, category, tab]);

  // 交換申し込み
  const handleRequest = (userId: number) => {
    setRequestedUsers((prev) => {
      if (prev.includes(userId)) return prev;
      return [...prev, userId];
    });
  };

  return (
    <div className="exchange-page">

      {/* ヘッダー */}
      <header className="exchange-header">
        <div className="exchange-header-inner">
          <a href="/discover" className="exchange-logo">
            Skill<span>Swap</span>
          </a>

          <div className="header-label">
            SKILL EXCHANGE
          </div>
        </div>
      </header>

      <main className="exchange-main">

        {/* 検索 */}
        <section className="exchange-search-section">
          <div className="exchange-search">
            <span className="search-icon">⌕</span>

            <input
              type="text"
              placeholder="ユーザー名・スキル名で検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}
          </div>

          {/* カテゴリー */}
          <div className="category-list">
            {categories.map((item) => (
              <button
                key={item}
                className={`category-button ${
                  category === item ? "active" : ""
                }`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* ユーザー一覧 */}
        <section className="exchange-users-section">

          <div className="exchange-section-heading">
            <div>
              <span className="section-label">
                FIND YOUR PARTNER
              </span>
              <h2>交換相手を探す</h2>
            </div>

            <span className="user-count">
              {filteredUsers.length} 人
            </span>
          </div>

          {/* タブ */}
          <div className="exchange-tabs">
            <button
              className={tab === "all" ? "active" : ""}
              onClick={() => setTab("all")}
            >
              すべてのユーザー
            </button>

            <button
              className={tab === "matched" ? "active" : ""}
              onClick={() => setTab("matched")}
            >
              おすすめ
            </button>
          </div>

          {/* カード一覧 */}
          <div className="exchange-user-grid">
            {filteredUsers.map((user) => {
              const isRequested = requestedUsers.includes(user.id);

              return (
                <article
                  className="exchange-user-card"
                  key={user.id}
                >
                  <div className="user-card-top">
                    <div className="user-avatar">
                      {user.avatar}
                    </div>

                    <div className="user-info">
                      <h3>{user.name}</h3>
                      <span>{user.school}</span>
                    </div>

                    <span className="match-badge">
                      おすすめ
                    </span>
                  </div>

                  <p className="user-description">
                    {user.description}
                  </p>

                  {/* 教えられるスキル */}
                  <div className="skill-group">
                    <div className="skill-heading">
                      <span className="skill-icon teach-icon">
                        ↑
                      </span>
                      <span>教えられるスキル</span>
                    </div>

                    <div className="skill-tags">
                      {user.teaches.map((skill) => (
                        <span
                          className="skill-tag teach-tag"
                          key={skill}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 学びたいスキル */}
                  <div className="skill-group">
                    <div className="skill-heading">
                      <span className="skill-icon learn-icon">
                        ↓
                      </span>
                      <span>学びたいスキル</span>
                    </div>

                    <div className="skill-tags">
                      {user.learns.map((skill) => (
                        <span
                          className="skill-tag learn-tag"
                          key={skill}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 交換ボタン */}
                  <div className="user-card-footer">
                    <button
                      className={`exchange-request-button ${
                        isRequested ? "requested" : ""
                      }`}
                      onClick={() => handleRequest(user.id)}
                      disabled={isRequested}
                    >
                      {isRequested
                        ? "✓ 申し込み済み"
                        : "交換を申し込む →"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* 検索結果なし */}
          {filteredUsers.length === 0 && (
            <div className="exchange-empty">
              <div>🔍</div>
              <h3>ユーザーが見つかりませんでした</h3>
              <p>
                検索条件を変更して、もう一度お試しください。
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setCategory("すべて");
                  setTab("all");
                }}
              >
                検索条件をリセット
              </button>
            </div>
          )}

        </section>
      </main>

      <footer className="exchange-footer">
        <p>SkillSwap © 2026</p>
        <span>Share your skills, grow together.</span>
      </footer>
    </div>
  );
}

export default SkillExchange;
