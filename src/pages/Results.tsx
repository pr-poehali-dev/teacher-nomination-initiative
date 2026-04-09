import { useState } from "react";
import Icon from "@/components/ui/icon";

const VOTE_URL = "https://functions.poehali.dev/30fb8da2-823b-4110-b970-1f5233db5a7c";

const NOMINATIONS: Record<number, { title: string; emoji: string }> = {
  1: { title: "Slay SCHOOL King", emoji: "🤴" },
  2: { title: "Slay SCHOOL Queen", emoji: "👸🏻" },
  3: { title: "Slay SCHOOL преданный своей работе", emoji: "💼" },
  4: { title: "Slay SCHOOL завуч года", emoji: "🏆" },
  5: { title: "Slay SCHOOL веселый учитель", emoji: "😄" },
  6: { title: "Slay SCHOOL активный в своей работе", emoji: "⚡" },
  7: { title: "Slay SCHOOL добрый учитель", emoji: "💛" },
  8: { title: "Slay SCHOOL учитель технических наук", emoji: "🔧" },
  9: { title: "Slay SCHOOL учитель русского языка", emoji: "📝" },
  10: { title: "Slay SCHOOL учитель информатики", emoji: "💻" },
  11: { title: "Slay SCHOOL учитель иностранных языков", emoji: "🌍" },
  12: { title: "Slay SCHOOL учитель обществознания", emoji: "🏛️" },
  13: { title: "Slay SCHOOL учитель истории", emoji: "📜" },
};

interface Teacher {
  id: number;
  name: string;
  votes: number;
}

type Status = "login" | "loading" | "loaded" | "error" | "wrong";

const Results = () => {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("login");
  const [data, setData] = useState<Record<number, Teacher[]>>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(
        `${VOTE_URL}?action=all_results&password=${encodeURIComponent(password)}`
      );
      if (res.status === 403) {
        setStatus("wrong");
        return;
      }
      const json = await res.json();
      setData(json.results || {});
      setStatus("loaded");
    } catch {
      setStatus("error");
    }
  };

  const maxVotes = (teachers: Teacher[]) =>
    Math.max(...teachers.map((t) => t.votes), 1);

  if (status === "login" || status === "wrong" || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm">
          <div className="text-3xl mb-4 text-center">🔐</div>
          <h1 className="text-xl font-bold text-center mb-1">Результаты голосования</h1>
          <p className="text-gray-400 text-sm text-center mb-6">Введите пароль для доступа</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition-colors"
              autoFocus
            />
            {status === "wrong" && (
              <p className="text-red-500 text-sm text-center">Неверный пароль</p>
            )}
            <button
              type="submit"
              disabled={!password || status === "loading"}
              className="w-full py-3 rounded-xl bg-black text-white font-semibold text-sm disabled:opacity-40 hover:bg-gray-900 transition-colors"
            >
              {status === "loading" ? "Загрузка..." : "Войти"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">Ошибка загрузки. Попробуйте обновить страницу.</p>
      </div>
    );
  }

  const nominationIds = Object.keys(data)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Результаты</h1>
            <p className="text-gray-400 text-sm mt-1">Голосование в реальном времени</p>
          </div>
          <button
            onClick={() => { setStatus("login"); setPassword(""); setData({}); }}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-700 text-sm transition-colors"
          >
            <Icon name="LogOut" size={16} />
            Выйти
          </button>
        </div>

        {nominationIds.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm">
            Голосов пока нет
          </div>
        )}

        <div className="space-y-6">
          {nominationIds.map((nomId) => {
            const nom = NOMINATIONS[nomId];
            const teachers = data[nomId] || [];
            const max = maxVotes(teachers);
            const totalVotes = teachers.reduce((s, t) => s + t.votes, 0);

            return (
              <div key={nomId} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{nom?.emoji ?? "🏅"}</span>
                  <div>
                    <h2 className="font-bold text-gray-900 text-sm leading-tight">
                      {nom?.title ?? `Номинация ${nomId}`}
                    </h2>
                    <p className="text-gray-400 text-xs">Всего голосов: {totalVotes}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {teachers.map((t, i) => (
                    <div key={t.id}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className={`font-medium ${i === 0 && t.votes > 0 ? "text-black" : "text-gray-600"}`}>
                          {i === 0 && t.votes > 0 && "🥇 "}{t.name}
                        </span>
                        <span className="text-gray-400 text-xs font-medium">{t.votes}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-black rounded-full transition-all"
                          style={{ width: `${(t.votes / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Results;
