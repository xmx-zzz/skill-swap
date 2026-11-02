
import "./Home.css";

// ========================================
// データ型
// ========================================

// 人気スキル
type Skill = {
  id: number;
  name: string;
  userCount: number;
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
  { id: 1, name: "HTML", userCount: 20 },
  { id: 2, name: "CSS", userCount: 18 },
  { id: 3, name: "JavaScript", userCount: 15 },
  { id: 4, name: "Python", userCount: 12 },
  { id: 5, name: "React", userCount: 10 },
  { id: 6, name: "Figma", userCount: 8 },
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
  {
    id: 4,
    title: "新しいおすすめメンバーが追加されました",
    date: "2026/10/29",
    type: "おすすめ",
  },
];

// メンバー一覧の仮データ
// おすすめ欄とは別のユーザーを表示する
const members: User[] = [
  {
    id: 4,
    name: "伊藤 翔",
    school: "情報処理科",
    description: "Pythonを使った開発が好きです。",
    avatar: "🚀",
    teaches: ["Python", "Java"],
    learns: ["HTML", "CSS"],
  },
  {
    id: 5,
    name: "田中 太郎",
    school: "情報システム科",
    description: "Web制作やアプリ開発を勉強しています。",
    avatar: "💻",
    teaches: ["JavaScript", "React"],
    learns: ["Webデザイン"],
  },
  {
    id: 6,
    name: "山田 美月",
    school: "デザイン学科",
    description: "イラストやデザインを勉強しています。",
    avatar: "🌷",
    teaches: ["Illustrator", "Figma"],
    learns: ["HTML", "CSS"],
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
          スキル交換して
          <br />
          もっと広がる世界
        </h1>

        <p>
          自分の得意を誰かの学びに。
          <br />
          新しいスキルとの出会いを見つけよう。
        </p>

        <button type="button" className="hero-button">
          スキルを探す
        </button>
      </section>

      {/* 人気スキル */}
      <section className="popular-skills-section">

        <div className="section-heading">
          <div>
            <span className="section-subtitle">
              POPULAR SKILLS
            </span>
            <h2>人気スキル</h2>
          </div>

          <button type="button" className="more-button">
            もっと見る →
          </button>
        </div>

        <div className="popular-skills-list">
          {popularSkills.map((skill) => (
            <div className="popular-skill-card" key={skill.id}>
              <h3>{skill.name}</h3>
              <span>{skill.userCount}人が登録</span>
            </div>
          ))}
        </div>

      </section>

      {/* おすすめ欄 */}
      <section className="recommended-section">

        <div className="section-heading">
          <div>
            <span className="section-subtitle">
              RECOMMENDED
            </span>
            <h2>あなたにおすすめの人</h2>
          </div>

        </div>

        <div className="user-card-list">
          {recommendedUsers.map((user) => (
            <article className="user-card" key={user.id}>

              <div className="user-avatar">
                {user.avatar}
              </div>

              <div className="user-card-info">
                <h3>{user.name}</h3>
                <span>{user.school}</span>
              </div>

              <span className="match-score">
                相性 {user.matchScore}%
              </span>

              <p>{user.description}</p>

              <div className="user-skill-list">
                <span>教えられる：</span>
                {user.teaches.join("・")}
              </div>

              <div className="user-skill-list">
                <span>学びたい：</span>
                {user.learns.join("・")}
              </div>

              <button type="button" className="detail-button">
                プロフィールを見る →
              </button>

            </article>
          ))}
        </div>

      </section>

      {/* お知らせ欄 */}
      <section className="notifications-section">

        <div className="section-heading">
          <div>
            <span className="section-subtitle">
              NOTIFICATIONS
            </span>
            <h2>お知らせ</h2>
          </div>

          <button type="button" className="more-button">
            もっと見る →
          </button>
        </div>

        <div className="notification-list">
          {notifications.map((notification) => (
            <div
              className="notification-item"
              key={notification.id}
            >
              <span className="notification-type">
                {notification.type}
              </span>

              <p>{notification.title}</p>

              <span className="notification-date">
                {notification.date}
              </span>
            </div>
          ))}
        </div>

      </section>

      {/* メンバー一覧 */}
      <section className="members-section">

        <div className="section-heading">
          <div>
            <span className="section-subtitle">
              MEMBERS
            </span>
            <h2>メンバー一覧</h2>
          </div>

          <button type="button" className="more-button">
            もっと見る →
          </button>
        </div>

        <div className="user-card-list">
          {members.map((user) => (
            <article className="member-card" key={user.id}>

              <div className="user-avatar">
                {user.avatar}
              </div>

              <h3>{user.name}</h3>
              <span>{user.school}</span>

              <p>{user.description}</p>

              <div className="user-skill-list">
                <span>教えられる：</span>
                {user.teaches.join("・")}
              </div>

              <div className="user-skill-list">
                <span>学びたい：</span>
                {user.learns.join("・")}
              </div>

              <button type="button" className="detail-button">
                プロフィールを見る →
              </button>

            </article>
          ))}
        </div>

      </section>

    </main>
  );
}

export default Home;
