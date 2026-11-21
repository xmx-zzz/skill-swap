
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import "./Groups.css";

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

// ========================================
// 初期グループ
// ========================================

const initialGroups: Group[] = [
  {
    id: 1,
    name: "React",
    description: "Reactについて一緒に学習・情報交換するグループです。",
    icon: "⚛️",
    members: 8,
  },
  {
    id: 2,
    name: "Python",
    description: "Python初心者から経験者まで一緒に学ぼう！",
    icon: "🐍",
    members: 12,
  },
];

// ========================================
// グループ画面
// ========================================

function Groups() {
  // グループ一覧
  const [groups, setGroups] = useState<Group[]>(() => {
    const savedGroups = localStorage.getItem("skillSwapGroups");

    if (savedGroups) {
      try {
        return JSON.parse(savedGroups) as Group[];
      } catch {
        return initialGroups;
      }
    }

    return initialGroups;
  });

  // グループ作成フォーム
  const [isCreating, setIsCreating] = useState(false);

  // 入力内容
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [groupIcon, setGroupIcon] = useState("👥");

  // ========================================
  // localStorageに保存
  // ========================================

  useEffect(() => {
    localStorage.setItem("skillSwapGroups", JSON.stringify(groups));
  }, [groups]);

  // ========================================
  // グループ作成
  // ========================================

  const createGroup = () => {
    if (!name.trim()) {
      alert("グループ名を入力してください。");
      return;
    }

    const newGroup: Group = {
      id: Date.now(),
      name: name.trim(),
      description: description.trim(),
      icon: groupIcon,
      members: 1,
    };

    setGroups((prev) => [...prev, newGroup]);

    // 入力内容をリセット
    setName("");
    setDescription("");
    setGroupIcon("👥");
    setIsCreating(false);
  };

  // ========================================
  // グループ画面表示
  // ========================================

  return (
    <div className="groups-page">

      {/* ページ見出し */}
      <div className="groups-heading">
        <div>
          <h1>グループ</h1>
          <p>同じ興味を持つ仲間と一緒に学ぼう！</p>
        </div>

        <button
          className="create-group-button"
          onClick={() => setIsCreating(true)}
        >
          <Icon icon="material-symbols:add" />
          グループを作成
        </button>
      </div>

      {/* ========================================
          グループ作成モーダル
      ======================================== */}

      {isCreating && (
        <div className="group-modal-overlay">
          <div className="group-modal">

            <h2>グループを作成</h2>

            {/* アイコン選択 */}
            <label>グループアイコン</label>

            <div className="group-icon-options">
              {["👥", "⚛️", "🐍", "💻", "🎨", "📚"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={groupIcon === item ? "selected" : ""}
                  onClick={() => setGroupIcon(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* グループ名 */}
            <label htmlFor="group-name">
              グループ名
            </label>

            <input
              id="group-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：React勉強会"
            />

            {/* グループ説明 */}
            <label htmlFor="group-description">
              グループ説明
            </label>

            <textarea
              id="group-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="グループの説明を入力してください"
            />

            {/* ボタン */}
            <div className="group-modal-buttons">

              <button
                className="cancel-button"
                onClick={() => {
                  setIsCreating(false);
                  setName("");
                  setDescription("");
                  setGroupIcon("👥");
                }}
              >
                キャンセル
              </button>

              <button
                className="submit-button"
                onClick={createGroup}
              >
                作成する
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ========================================
          グループ一覧
      ======================================== */}

      <div className="groups-list">

        {groups.map((group) => (
          <div className="group-card" key={group.id}>

            <div className="group-card-icon">
              {group.icon}
            </div>

            <div className="group-card-content">
              <h2>{group.name}</h2>

              <p>{group.description}</p>

              <span>
                <Icon icon="material-symbols:group-outline" />
                {group.members}人
              </span>
            </div>

            <Link
              to={`/groups/${group.id}`}
              className="group-detail-button"
            >
              詳細を見る
              <Icon icon="material-symbols:chevron-right" />
            </Link>

          </div>
        ))}

      </div>

      {/* グループがない場合 */}
      {groups.length === 0 && (
        <p className="no-groups">
          まだグループがありません。
        </p>
      )}

    </div>
  );
}

export default Groups;
