
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./Home.css";

// ========================================
// データ型
// ========================================

// 人気スキル
type Skill = {
  id: number;
  name: string;
};

// ユーザー情報
type User = {
  id: number;
  name: string;
  school: string;
  description: string;
  avatar: string;
  teaches: string[];
  learns: string[];
  matchScore?: number;
};

// お知らせ
type Notification = {
  id: number;
  title: string;
  date: string;
  type: string;
};

// ========================================
// 仮データ
// ※後からSupabaseのデータに差し替える
// ========================================

// 人気スキルの仮データ
const popularSkills: Skill[] = [
  { id: 1, name: "Illustrator" },
  { id: 2, name: "Photoshop" },
  { id: 3, name: "Figma" },
  { id: 4, name: "HTML/CSS" },
  { id: 5, name: "React" },
  { id: 6, name: "プログラミング" },
];

// 相性のいい人の仮データ
const recommendedUsers: User[] = [
  {
    id: 1,
    name: "佐藤 花子",
    school: "デザイン学科",
    description: "WebデザインやUIデザインを勉強しています。",
    avatar: "🌸",
    teaches: ["HTML", "CSS", "Figma"],
    learns: ["JavaScript", "React"],
    matchScore: 95,
  },
  {
    id: 2,
    name: "鈴木 健",
    school: "情報システム科",
    description: "Webアプリケーションの開発が得意です。",
    avatar: "👨‍💻",
    teaches: ["JavaScript", "React"],
    learns: ["UIデザイン", "Figma"],
    matchScore: 90,
  },
  {
    id: 3,
    name: "高橋 美咲",
    school: "メディア学科",
    description: "動画編集や映像制作に取り組んでいます。",
    avatar: "🎨",
    teaches: ["動画編集", "Premiere Pro"],
    learns: ["Illustrator", "Figma"],
    matchScore: 85,
  },
];

// お知らせの仮データ
const notifications: Notification[] = [
  {
    id: 1,
    title: "新しいスキルが登録されました",
    date: "2026/11/01",
    type: "スキル",
  },
  {
    id: 2,
    title: "交換申請の進捗が更新されました",
    date: "2026/10/31",
    type: "申請",
  },
  {
    id: 3,
    title: "新しいメンバーが参加しました",
    date: "2026/10/30",
    type: "メンバー",
  },
];

// ========================================
// ホーム画面
// ========================================

function Home() {
  return (
    <main className="home">

      {/* ヒーローセクション */}
      <section className="hero-section">
        <h1>
          スキルを交換して
          <br />
          もっと広がる。
        </h1>

        <Link to="/search" className="hero-button">
          スキルを探す
          <Icon icon="material-symbols:chevron-right" width="24" />
        </Link>
      </section>

      {/* 人気スキル・お知らせ */}
      <div className="home-middle">

        {/* 人気スキル */}
        <section className="popular-skills-section">

          <div className="section-heading">
            <h2>人気のスキル</h2>

            <Link to="/skills" className="more-button">
              もっと見る
              <Icon icon="material-symbols:chevron-right" width="22" />
            </Link>
          </div>

          <div className="popular-skills-list">
            {popularSkills.map((skill) => (
              <Link
                to="/skills"
                className="popular-skill-card"
                key={skill.id}
              >
                <span>{skill.name}</span>
              </Link>
            ))}
          </div>

        </section>

        {/* お知らせ */}
        <section className="notifications-section">

          <div className="notification-heading">
            <Icon icon="akar-icons:bell" width="34" height="34" />
            <h2>お知らせ</h2>
          </div>

          <div className="notification-list">
            {notifications.map((notification) => (
              <div
                className="notification-item"
                key={notification.id}
              >
                <span className="notification-date">
                  {notification.date.slice(5).replace("/", "/")}
                </span>

                <p>{notification.title}</p>
              </div>
            ))}
          </div>

        </section>

      </div>

      {/* マッチユーザー */}
      <section className="recommended-section">

        <div className="section-heading">
          <h2>マッチユーザー</h2>

          <Link to="/members" className="more-button">
            もっと見る
            <Icon icon="material-symbols:chevron-right" width="22" />
          </Link>
        </div>

        <div className="user-card-list">
          {recommendedUsers.map((user) => (
            <article className="user-card" key={user.id}>

              <div className="user-avatar">
                {user.avatar}
              </div>

              <h3>{user.name}</h3>

              <div className="user-skill-tags">
                {user.teaches.slice(0, 2).map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

              <p>{user.description}</p>

              <Link
                to={`/members/${user.id}`}
                className="detail-button"
              >
                プロフィールを見る
              </Link>

            </article>
          ))}
        </div>

        <Link to="/members" className="members-button">
          ユーザー一覧
          <Icon icon="material-symbols:chevron-right" width="24" />
        </Link>

      </section>

    </main>
  );
}

export default Home;
