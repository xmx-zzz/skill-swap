
import { Icon } from "@iconify/react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      {/* ロゴ */}
      <div className="sidebar-logo">
        SKILL SWAP
      </div>

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
          to="/skills"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">
            <Icon icon="carbon:skill-level-advanced" width="32" height="32" />
          </span>
          <span>スキル</span>
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
        <button className="sidebar-item logout-button" type="button">
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
