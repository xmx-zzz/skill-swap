
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Icon } from "@iconify/react";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!keyword.trim()) return;

    navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
  };

  return (
    <header className="main-header">

      {/* 検索バー */}
      <form className="header-search" onSubmit={handleSearch}>
        <Icon
          icon="material-symbols:search"
          width="28"
          height="28"
          className="search-icon"
        />

        <input
          type="text"
          placeholder="スキル、メンバーを検索"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </form>

      {/* チャットボタン */}
      <Link to="/chat" className="header-chat-button">
        <Icon
          icon="bi:chat"
          width="26"
          height="26"
        />
        <span>チャット</span>
        <span className="header-chat-badge">4</span>
      </Link>

    </header>
  );
}

export default Header;
