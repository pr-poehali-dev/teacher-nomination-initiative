import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const VOTE_URL = "https://functions.poehali.dev/30fb8da2-823b-4110-b970-1f5233db5a7c";

const nominations: Record<number, { title: string; emoji: string }> = {
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
}

type Status = "loading" | "selecting" | "sending" | "success" | "error" | "already_voted" | "no_teachers";

const Vote = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const nominationId = Number(id);
  const nomination = nominations[nominationId];

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!nominationId || !nomination) return;
    fetch(`${VOTE_URL}?action=teachers&nomination_id=${nominationId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.teachers && data.teachers.length > 0) {
          setTeachers(data.teachers);
          setStatus("selecting");
        } else {
          setStatus("no_teachers");
        }
      })
      .catch(() => setStatus("error"));
  }, [nominationId]);

  const handleVote = async () => {
    if (!selected) return;
    setStatus("sending");
    try {
      const res = await fetch(VOTE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomination_id: nominationId, teacher_id: selected }),
      });
      const data = await res.json();
      if (res.status === 409 || data.error === "already_voted") {
        setStatus("already_voted");
      } else if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (!nomination) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Номинация не найдена</p>
          <button onClick={() => navigate("/nominations")} className="text-blue-500 underline">
            Назад к номинациям
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate("/nominations")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-8 transition-colors"
        >
          <Icon name="ArrowLeft" size={18} />
          Назад
        </button>

        <div className="text-5xl mb-3">{nomination.emoji}</div>
        <h1 className="text-2xl font-bold text-black mb-1">{nomination.title}</h1>
        <p className="text-gray-500 mb-8">Выберите одного учителя и нажмите «Голосовать»</p>

        {status === "loading" && (
          <div className="text-center text-gray-400 py-12">Загрузка...</div>
        )}

        {status === "no_teachers" && (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-400 shadow-sm">
            Для этой номинации пока нет кандидатов
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-50 rounded-2xl p-6 text-center text-red-500 shadow-sm">
            Произошла ошибка. Попробуйте позже.
          </div>
        )}

        {status === "already_voted" && (
          <div className="bg-yellow-50 rounded-2xl p-6 text-center shadow-sm">
            <div className="text-4xl mb-3">🗳️</div>
            <p className="font-semibold text-gray-800 mb-1">Вы уже проголосовали</p>
            <p className="text-gray-500 text-sm">В каждой номинации можно голосовать только один раз</p>
          </div>
        )}

        {status === "success" && (
          <div className="bg-green-50 rounded-2xl p-6 text-center shadow-sm">
            <div className="text-4xl mb-3">🎉</div>
            <p className="font-semibold text-gray-800 mb-1">Голос принят!</p>
            <p className="text-gray-500 text-sm mb-4">Спасибо за участие в голосовании</p>
            <button
              onClick={() => navigate("/nominations")}
              className="text-blue-500 text-sm font-medium hover:underline"
            >
              Проголосовать в другой номинации
            </button>
          </div>
        )}

        {(status === "selecting" || status === "sending") && (
          <>
            <div className="space-y-2 mb-6">
              {teachers.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t.id)}
                  className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all font-medium ${
                    selected === t.id
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white text-gray-800 hover:border-gray-400"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            <button
              onClick={handleVote}
              disabled={!selected || status === "sending"}
              className="w-full py-4 rounded-2xl bg-black text-white font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors"
            >
              {status === "sending" ? "Отправляем..." : "Голосовать"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Vote;