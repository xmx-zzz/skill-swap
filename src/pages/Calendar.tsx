import { useMemo, useState } from "react";
import "./Calendar.css";

type EventCategory = "teach" | "learn" | "other";

type CalendarEvent = {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  category: EventCategory;
  description: string;
};

const initialEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Reactの勉強会",
    date: "2026-11-08",
    startTime: "14:00",
    endTime: "15:30",
    category: "learn",
    description: "Reactの基礎について一緒に勉強する。",
  },
  {
    id: 2,
    title: "HTML・CSSを教える",
    date: "2026-11-10",
    startTime: "16:00",
    endTime: "17:00",
    category: "teach",
    description: "HTMLとCSSの基本を教える。",
  },
  {
    id: 3,
    title: "デザイン交流会",
    date: "2026-11-15",
    startTime: "13:00",
    endTime: "14:30",
    category: "other",
    description: "デザインについて意見交換する。",
  },
];

const categoryLabels: Record<EventCategory, string> = {
  teach: "教える",
  learn: "学ぶ",
  other: "その他",
};

const categoryColors: Record<EventCategory, string> = {
  teach: "teach",
  learn: "learn",
  other: "other",
};

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  return `${year}年${month}月${day}日`;
}

function Calendar() {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(formatDate(today));

  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(formatDate(today));
  const [startTime, setStartTime] = useState("13:00");
  const [endTime, setEndTime] = useState("14:00");
  const [category, setCategory] = useState<EventCategory>("learn");
  const [description, setDescription] = useState("");

  // カレンダーの日付一覧を作成
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // 月曜日始まりにする
    const startDay = (firstDay.getDay() + 6) % 7;

    const days: Date[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push(new Date(year, month, i - startDay + 1));
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    while (days.length % 7 !== 0) {
      const last = days[days.length - 1];

      days.push(
        new Date(
          last.getFullYear(),
          last.getMonth(),
          last.getDate() + 1
        )
      );
    }

    return days;
  }, [currentDate]);

  // 選択した日の予定
  const selectedEvents = events
    .filter((event) => event.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // 直近の予定
  const upcomingEvents = [...events]
    .filter((event) => event.date >= formatDate(today))
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);

      if (dateCompare !== 0) {
        return dateCompare;
      }

      return a.startTime.localeCompare(b.startTime);
    })
    .slice(0, 5);

  // 前月へ移動
  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      )
    );
  };

  // 翌月へ移動
  const handleNextMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      )
    );
  };

  // 今日へ戻る
  const handleToday = () => {
    const now = new Date();

    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(formatDate(now));
  };

  // 新規登録フォームを開く
  const handleOpenCreate = () => {
    setEditingEventId(null);
    setTitle("");
    setDate(selectedDate);
    setStartTime("13:00");
    setEndTime("14:00");
    setCategory("learn");
    setDescription("");
    setIsModalOpen(true);
  };

  // 編集フォームを開く
  const handleOpenEdit = (event: CalendarEvent) => {
    setEditingEventId(event.id);
    setTitle(event.title);
    setDate(event.date);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setCategory(event.category);
    setDescription(event.description);
    setIsModalOpen(true);
  };

  // 予定を保存
  const handleSaveEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("予定名を入力してください。");
      return;
    }

    if (startTime >= endTime) {
      alert("終了時刻は開始時刻より後にしてください。");
      return;
    }

    if (editingEventId !== null) {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === editingEventId
            ? {
                ...event,
                title: title.trim(),
                date,
                startTime,
                endTime,
                category,
                description,
              }
            : event
        )
      );
    } else {
      const newEvent: CalendarEvent = {
        id: Date.now(),
        title: title.trim(),
        date,
        startTime,
        endTime,
        category,
        description,
      };

      setEvents((prev) => [...prev, newEvent]);
    }

    setSelectedDate(date);

    const [year, month] = date.split("-").map(Number);

    setCurrentDate(new Date(year, month - 1, 1));

    setIsModalOpen(false);
  };

  // 予定を削除
  const handleDeleteEvent = (id: number) => {
    const confirmed = window.confirm("この予定を削除しますか？");

    if (!confirmed) return;

    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return (
    <div className="calendar-page">
      <div className="calendar-container">

        {/* ページヘッダー */}
        <div className="calendar-page-header">
          <div>
            <p className="calendar-eyebrow">SCHEDULE MANAGEMENT</p>
            <h1>カレンダー</h1>
            <p className="calendar-header-description">
              スキル交換の予定を管理しましょう。
            </p>
          </div>

          <button
            className="calendar-add-button"
            onClick={handleOpenCreate}
          >
            <span>＋</span> 予定を追加
          </button>
        </div>

        <div className="calendar-layout">

          {/* 左側：カレンダー */}
          <section className="calendar-main-card">

            <div className="calendar-month-header">
              <div>
                <h2>
                  {currentDate.getFullYear()}年
                  {currentDate.getMonth() + 1}月
                </h2>
                <p>Schedule Calendar</p>
              </div>

              <div className="calendar-month-controls">
                <button onClick={handleToday}>今日</button>

                <button
                  className="calendar-arrow-button"
                  onClick={handlePreviousMonth}
                  aria-label="前の月"
                >
                  ‹
                </button>

                <button
                  className="calendar-arrow-button"
                  onClick={handleNextMonth}
                  aria-label="次の月"
                >
                  ›
                </button>
              </div>
            </div>

            {/* 曜日 */}
            <div className="calendar-weekdays">
              {["月", "火", "水", "木", "金", "土", "日"].map(
                (day, index) => (
                  <div
                    key={day}
                    className={
                      index === 6
                        ? "calendar-weekday sunday"
                        : index === 5
                        ? "calendar-weekday saturday"
                        : "calendar-weekday"
                    }
                  >
                    {day}
                  </div>
                )
              )}
            </div>

            {/* 日付 */}
            <div className="calendar-days">
              {calendarDays.map((day, index) => {
                const dateString = formatDate(day);

                const isCurrentMonth =
                  day.getMonth() === currentDate.getMonth();

                const isToday = dateString === formatDate(today);

                const isSelected = dateString === selectedDate;

                const dayEvents = events.filter(
                  (event) => event.date === dateString
                );

                return (
                  <button
                    key={`${dateString}-${index}`}
                    className={[
                      "calendar-day",
                      !isCurrentMonth ? "other-month" : "",
                      isToday ? "today" : "",
                      isSelected ? "selected" : "",
                    ].join(" ")}
                    onClick={() => setSelectedDate(dateString)}
                  >
                    <span className="calendar-day-number">
                      {day.getDate()}
                    </span>

                    <div className="calendar-day-events">
                      {dayEvents.slice(0, 2).map((event) => (
                        <span
                          key={event.id}
                          className={`calendar-event-dot ${categoryColors[event.category]}`}
                        >
                          {event.title}
                        </span>
                      ))}

                      {dayEvents.length > 2 && (
                        <span className="calendar-more-events">
                          +{dayEvents.length - 2}件
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 凡例 */}
            <div className="calendar-legend">
              <span>
                <i className="legend-dot teach"></i>
                教える
              </span>

              <span>
                <i className="legend-dot learn"></i>
                学ぶ
              </span>

              <span>
                <i className="legend-dot other"></i>
                その他
              </span>
            </div>
          </section>

          {/* 右側：予定一覧 */}
          <aside className="calendar-sidebar">

            <section className="calendar-side-card">
              <div className="calendar-side-heading">
                <div>
                  <h3>選択した日の予定</h3>
                  <p>{formatDisplayDate(selectedDate)}</p>
                </div>
                <span className="calendar-event-count">
                  {selectedEvents.length}件
                </span>
              </div>

              {selectedEvents.length === 0 ? (
                <div className="calendar-empty">
                  <div className="calendar-empty-icon">📅</div>
                  <p>予定はありません</p>
                  <span>新しい予定を追加してみましょう。</span>
                </div>
              ) : (
                <div className="calendar-event-list">
                  {selectedEvents.map((event) => (
                    <div
                      className="calendar-event-card"
                      key={event.id}
                    >
                      <div
                        className={`calendar-event-color ${categoryColors[event.category]}`}
                      ></div>

                      <div className="calendar-event-content">
                        <span
                          className={`calendar-category-label ${categoryColors[event.category]}`}
                        >
                          {categoryLabels[event.category]}
                        </span>

                        <h4>{event.title}</h4>

                        <p className="calendar-event-time">
                          {event.startTime} - {event.endTime}
                        </p>

                        {event.description && (
                          <p className="calendar-event-description">
                            {event.description}
                          </p>
                        )}

                        <div className="calendar-event-actions">
                          <button onClick={() => handleOpenEdit(event)}>
                            編集
                          </button>

                          <button
                            className="delete"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="calendar-add-small-button"
                onClick={handleOpenCreate}
              >
                ＋ この日に予定を追加
              </button>
            </section>

            {/* 直近の予定 */}
            <section className="calendar-side-card upcoming-card">
              <div className="calendar-side-heading">
                <div>
                  <h3>直近の予定</h3>
                  <p>Upcoming Events</p>
                </div>
              </div>

              {upcomingEvents.length === 0 ? (
                <p className="calendar-no-upcoming">
                  今後の予定はありません。
                </p>
              ) : (
                <div className="upcoming-event-list">
                  {upcomingEvents.map((event) => (
                    <button
                      className="upcoming-event-item"
                      key={event.id}
                      onClick={() => {
                        const [year, month] = event.date
                          .split("-")
                          .map(Number);

                        setCurrentDate(
                          new Date(year, month - 1, 1)
                        );

                        setSelectedDate(event.date);
                      }}
                    >
                      <div
                        className={`upcoming-event-line ${categoryColors[event.category]}`}
                      ></div>

                      <div className="upcoming-event-info">
                        <span>{formatDisplayDate(event.date)}</span>
                        <strong>{event.title}</strong>
                        <small>
                          {event.startTime} - {event.endTime}
                        </small>
                      </div>

                      <span className="upcoming-event-arrow">›</span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>

      {/* 予定追加・編集モーダル */}
      {isModalOpen && (
        <div
          className="calendar-modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="calendar-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="calendar-modal-header">
              <div>
                <p>SCHEDULE</p>
                <h2>
                  {editingEventId !== null
                    ? "予定を編集"
                    : "新しい予定を追加"}
                </h2>
              </div>

              <button
                className="calendar-modal-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="閉じる"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveEvent}>
              <div className="calendar-form-group">
                <label>予定名 *</label>
                <input
                  type="text"
                  placeholder="例：Reactの勉強会"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="calendar-form-group">
                <label>日付 *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="calendar-time-row">
                <div className="calendar-form-group">
                  <label>開始時刻</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>

                <div className="calendar-form-group">
                  <label>終了時刻</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="calendar-form-group">
                <label>予定の種類</label>

                <div className="calendar-category-options">
                  {(
                    [
                      ["teach", "教える"],
                      ["learn", "学ぶ"],
                      ["other", "その他"],
                    ] as [EventCategory, string][]
                  ).map(([value, label]) => (
                    <button
                      type="button"
                      key={value}
                      className={`calendar-category-option ${value} ${
                        category === value ? "active" : ""
                      }`}
                      onClick={() => setCategory(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="calendar-form-group">
                <label>メモ・詳細</label>
                <textarea
                  placeholder="予定の内容を入力してください。"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="calendar-modal-actions">
                <button
                  type="button"
                  className="calendar-cancel-button"
                  onClick={() => setIsModalOpen(false)}
                >
                  キャンセル
                </button>

                <button
                  type="submit"
                  className="calendar-save-button"
                >
                  {editingEventId !== null ? "変更を保存" : "予定を登録"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;