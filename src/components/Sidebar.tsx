import { Icon } from "@iconify/react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "../lib/auth";
import "./Sidebar.css";
import logo from "../assets/icons/SKILL_SWAP_rog.png";

function Sidebar() {
  const navigate = useNavigate();

  // ログアウト: ログイン中の印を消して、ログイン画面に戻る
  function handleLogout() {
    signOut();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="sidebar">
      {/* ロゴ */}
      <NavLink to="/discover" className="sidebar-logo">
        <img src={logo} alt="SKILL SWAP" />
      </NavLink>

      <nav className="sidebar-menu">

        {/* ホーム */}
        <NavLink
          to="/discover"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">
            <Icon
              icon="material-symbols:home-rounded"
              width="24"
              height="24"
            />
          </span>
          <span>ホーム</span>
        </NavLink>

        {/* プロフィール */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">
            <Icon icon="gg:profile" width="24" height="24" />
          </span>
          <span>プロフィール</span>
        </NavLink>

        {/* お知らせ */}
        <NavLink
          to="/notice"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">
            <Icon icon="akar-icons:bell" width="24" height="24" />
          </span>
          <span>お知らせ</span>
        </NavLink>

        {/* スキル */}
        <NavLink
          to="/search"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">
            <Icon
              icon="carbon:skill-level-advanced"
              width="32"
              height="32"
            />
          </span>
          <span>スキル</span>
        </NavLink>

        {/* カレンダー */}
        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">
            <Icon
              icon="andrsrxn:calendar-days"
              width="24"
              height="24"
            />
          </span>
          <span>カレンダー</span>
        </NavLink>

        {/* グループ */}
        <NavLink
          to="/groups"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">
            <Icon
              icon="material-symbols:groups-outline"
              width="24"
              height="24"
            />
          </span>
          <span>グループ</span>
        </NavLink>

        {/* 申請管理 */}
        <NavLink
          to="/application"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">
            <Icon icon="circum:mail" width="24" height="24" />
          </span>
          <span>申請管理</span>
        </NavLink>

        {/* ログアウト */}
        <button
          className="sidebar-item logout-button"
          type="button"
          onClick={handleLogout}
        >
          <span className="sidebar-icon">
            <Icon icon="bx:log-out" width="24" height="24" />
          </span>
          <span>ログアウト</span>
        </button>

      </nav>
    </aside>
  );
}

export default Sidebar;