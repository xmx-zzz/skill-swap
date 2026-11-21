
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useParams } from "react-router-dom";
import "./GroupDetail.css";

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

type Post = {
  id: number;
  groupId: number;
  author: string;
  content: string;
  createdAt: string;
};

type Reply = {
  id: number;
  postId: number;
  author: string;
  content: string;
  createdAt: string;
};

// ========================================
// 仮ユーザー情報
// ========================================

const CURRENT_USER = "自分";

// ========================================
// グループ詳細画面
// ========================================

function GroupDetail() {
  const { id } = useParams();
  const groupId = Number(id);

  // グループ一覧
  const [groups, setGroups] = useState<Group[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("skillSwapGroups") || "[]"
      ) as Group[];
    } catch {
      return [];
    }
  });

  const group = groups.find((item) => item.id === groupId);

  // 掲示板投稿
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("skillSwapPosts") || "[]"
      ) as Post[];
    } catch {
      return [];
    }
  });

  // 返信一覧
  const [replies, setReplies] = useState<Reply[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("skillSwapPostReplies") || "[]"
      ) as Reply[];
    } catch {
      return [];
    }
  });

  // 入力内容
  const [content, setContent] = useState("");
  const [replyContents, setReplyContents] = useState<
    Record<number, string>
  >({});

  // 編集モード
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(group?.name || "");
  const [editDescription, setEditDescription] = useState(
    group?.description || ""
  );
  const [editIcon, setEditIcon] = useState(group?.icon || "👥");

  // ========================================
  // 保存
  // ========================================

  useEffect(() => {
    localStorage.setItem("skillSwapGroups", JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem("skillSwapPosts", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(
      "skillSwapPostReplies",
      JSON.stringify(replies)
    );
  }, [replies]);

  // ========================================
  // グループ情報編集
  // ========================================

  const saveGroup = () => {
    if (!editName.trim()) {
      alert("グループ名を入力してください。");
      return;
    }

    setGroups((prev) =>
      prev.map((item) =>
        item.id === groupId
          ? {
              ...item,
              name: editName.trim(),
              description: editDescription.trim(),
              icon: editIcon,
            }
          : item
      )
    );

    setIsEditing(false);
  };

  // ========================================
  // 掲示板投稿
  // ========================================

  const createPost = () => {
    if (!content.trim()) {
      alert("投稿内容を入力してください。");
      return;
    }

    const newPost: Post = {
      id: Date.now(),
      groupId,
      author: CURRENT_USER,
      content: content.trim(),
      createdAt: new Date().toLocaleString("ja-JP"),
    };

    setPosts((prev) => [newPost, ...prev]);
    setContent("");
  };

  // ========================================
  // 投稿削除
  // ========================================

  const deletePost = (postId: number) => {
    const target = posts.find((post) => post.id === postId);

    if (!target) return;

    if (target.author !== CURRENT_USER) {
      alert("この投稿を削除する権限がありません。");
      return;
    }

    if (!window.confirm("この投稿を削除しますか？")) return;

    setPosts((prev) =>
      prev.filter((post) => post.id !== postId)
    );

    // 投稿に紐づく返信も削除
    setReplies((prev) =>
      prev.filter((reply) => reply.postId !== postId)
    );
  };

  // ========================================
  // 返信投稿
  // ========================================

  const createReply = (postId: number) => {
    const replyContent = replyContents[postId]?.trim();

    if (!replyContent) {
      alert("返信内容を入力してください。");
      return;
    }

    const newReply: Reply = {
      id: Date.now(),
      postId,
      author: CURRENT_USER,
      content: replyContent,
      createdAt: new Date().toLocaleString("ja-JP"),
    };

    setReplies((prev) => [...prev, newReply]);

    setReplyContents((prev) => ({
      ...prev,
      [postId]: "",
    }));
  };

  // ========================================
  // 返信削除
  // ========================================

  const deleteReply = (replyId: number) => {
    const target = replies.find((reply) => reply.id === replyId);

    if (!target || target.author !== CURRENT_USER) return;

    if (!window.confirm("この返信を削除しますか？")) return;

    setReplies((prev) =>
      prev.filter((reply) => reply.id !== replyId)
    );
  };

  // ========================================
  // グループが見つからない場合
  // ========================================

  if (!group) {
    return (
      <div className="group-detail-page">
        <h2>グループが見つかりません。</h2>
        <Link to="/groups">グループ一覧に戻る</Link>
      </div>
    );
  }

  // ========================================
  // 画面表示
  // ========================================

  return (
    <div className="group-detail-page">

      <Link to="/groups" className="back-groups-link">
        <Icon icon="material-symbols:arrow-back" />
        グループ一覧に戻る
      </Link>

      {/* グループ情報 */}
      <section className="group-detail-header">
        <div className="group-detail-main">
          <div className="group-detail-icon">
            {group.icon}
          </div>

          <div>
            <h1>{group.name}</h1>
            <p>{group.description}</p>
            <span>
              <Icon icon="material-symbols:group-outline" />
              {group.members}人
            </span>
          </div>
        </div>

        <div className="group-detail-actions">
          <button
            className="edit-group-button"
            onClick={() => {
              setEditName(group.name);
              setEditDescription(group.description);
              setEditIcon(group.icon);
              setIsEditing(true);
            }}
          >
            <Icon icon="material-symbols:edit-outline" />
            グループ編集
          </button>

          <Link
            to={`/groups/${groupId}/chat`}
            className="group-chat-link"
          >
            <Icon icon="material-symbols:chat-outline" />
            チャット
          </Link>
        </div>
      </section>

      {/* 編集フォーム */}
      {isEditing && (
        <div className="group-modal-overlay">
          <div className="group-modal">
            <h2>グループ情報を編集</h2>

            <label>グループアイコン</label>

            <div className="group-icon-options">
              {["👥", "⚛️", "🐍", "💻", "🎨", "📚"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={editIcon === item ? "selected" : ""}
                  onClick={() => setEditIcon(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <label htmlFor="edit-group-name">グループ名</label>
            <input
              id="edit-group-name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <label htmlFor="edit-group-description">グループ説明</label>
            <textarea
              id="edit-group-description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />

            <div className="group-modal-buttons">
              <button
                className="cancel-button"
                onClick={() => setIsEditing(false)}
              >
                キャンセル
              </button>

              <button
                className="submit-button"
                onClick={saveGroup}
              >
                保存する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 掲示板 */}
      <section className="group-board">
        <div className="group-board-heading">
          <h2>掲示板</h2>
          <p>質問や学習記録を共有しよう！</p>
        </div>

        {/* 投稿フォーム */}
        <div className="group-post-form">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="グループに投稿する..."
          />

          <button
            className="group-post-button"
            onClick={createPost}
          >
            <Icon icon="material-symbols:send" />
            投稿する
          </button>
        </div>

        {/* 投稿一覧 */}
        <div className="group-post-list">
          {posts
            .filter((post) => post.groupId === groupId)
            .map((post) => {
              const postReplies = replies.filter(
                (reply) => reply.postId === post.id
              );

              return (
                <article className="group-post-card" key={post.id}>

                  {/* 投稿者情報 */}
                  <div className="group-post-top">
                    <div className="group-post-author">
                      <div className="group-post-avatar">
                        <Icon icon="material-symbols:person" />
                      </div>

                      <div>
                        <strong>{post.author}</strong>
                        <span>{post.createdAt}</span>
                      </div>
                    </div>

                    {post.author === CURRENT_USER && (
                      <button
                        className="delete-post-button"
                        onClick={() => deletePost(post.id)}
                        title="投稿を削除"
                      >
                        <Icon icon="material-symbols:delete-outline" />
                      </button>
                    )}
                  </div>

                  {/* 投稿内容 */}
                  <p className="group-post-content">
                    {post.content}
                  </p>

                  {/* 返信件数 */}
                  <div className="group-reply-count">
                    <Icon icon="material-symbols:chat-bubble-outline" />
                    返信 {postReplies.length}件
                  </div>

                  {/* 返信一覧 */}
                  {postReplies.map((reply) => (
                    <div className="group-reply-card" key={reply.id}>
                      <div className="group-reply-top">
                        <div>
                          <strong>{reply.author}</strong>
                          <span>{reply.createdAt}</span>
                        </div>

                        {reply.author === CURRENT_USER && (
                          <button
                            className="delete-reply-button"
                            onClick={() => deleteReply(reply.id)}
                            title="返信を削除"
                          >
                            <Icon icon="material-symbols:delete-outline" />
                          </button>
                        )}
                      </div>

                      <p>{reply.content}</p>
                    </div>
                  ))}

                  {/* 返信入力欄 */}
                  <div className="group-reply-form">
                    <textarea
                      value={replyContents[post.id] || ""}
                      onChange={(e) =>
                        setReplyContents((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      placeholder="この投稿に返信する..."
                      rows={2}
                    />

                    <button
                      onClick={() => createReply(post.id)}
                      disabled={!replyContents[post.id]?.trim()}
                    >
                      <Icon icon="material-symbols:send" />
                      返信する
                    </button>
                  </div>

                </article>
              );
            })}

          {posts.filter((post) => post.groupId === groupId).length === 0 && (
            <p className="no-group-posts">
              まだ投稿がありません。最初の投稿をしてみよう！
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default GroupDetail;
