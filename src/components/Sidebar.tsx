
import { Icon } from "@iconify/react";
import HomeIcon from "../assets/icons/Vector.svg";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        SKILL SWAP
      </div>

      <nav className="sidebar-menu">

        <button className="sidebar-item active">
        <span className="sidebar-icon">
          <img src={HomeIcon} alt="ホーム" width="24" height="24" />
        </span>
          <span>ホーム</span>
        </button>

        <button className="sidebar-item">
          <span className="sidebar-icon">
            <Icon icon="gg:profile" width="24" height="24" />
          </span>
          <span>プロフィール</span>
        </button>

        <button className="sidebar-item">
          <span className="sidebar-icon">
            <Icon icon="akar-icons:bell" width="24" height="24" />
          </span>
          <span>お知らせ</span>
        </button>

        <button className="sidebar-item">
          <span className="sidebar-icon">
            <Icon icon="carbon:skill-level-advanced" width="32" height="32" />
          </span>
          <span>スキル</span>
        </button>

        <button className="sidebar-item">
          <span className="sidebar-icon">
            <Icon icon="circum:mail" width="24" height="24" />
          </span>
          <span>申請管理</span>
        </button>

        <button className="sidebar-item logout-button">
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
