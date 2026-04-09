import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const nominations = [
  { id: 1, title: "Slay SCHOOL King", emoji: "🤴", desc: "Лучший учитель-король школы" },
  { id: 2, title: "Slay SCHOOL Queen", emoji: "👸🏻", desc: "Лучшая учительница-королева школы" },
  { id: 3, title: "Slay SCHOOL преданный своей работе", emoji: "💼", desc: "Самый преданный своему делу" },
  { id: 4, title: "Slay SCHOOL завуч года", emoji: "🏆", desc: "Лучший завуч школы" },
  { id: 5, title: "Slay SCHOOL веселый учитель", emoji: "😄", desc: "Самый весёлый и позитивный" },
  { id: 6, title: "Slay SCHOOL активный в своей работе", emoji: "⚡", desc: "Самый активный и энергичный" },
  { id: 7, title: "Slay SCHOOL добрый учитель", emoji: "💛", desc: "Самый добрый и отзывчивый" },
  { id: 8, title: "Slay SCHOOL учитель технических наук", emoji: "🔧", desc: "Лучший учитель технических наук" },
  { id: 9, title: "Slay SCHOOL учитель русского языка", emoji: "📝", desc: "Лучший учитель русского языка" },
  { id: 10, title: "Slay SCHOOL учитель информатики", emoji: "💻", desc: "Лучший учитель информатики" },
  { id: 11, title: "Slay SCHOOL учитель иностранных языков", emoji: "🌍", desc: "Лучший учитель иностранных языков" },
  { id: 12, title: "Slay SCHOOL учитель обществознания", emoji: "🏛️", desc: "Лучший учитель обществознания" },
  { id: 13, title: "Slay SCHOOL учитель истории", emoji: "📜", desc: "Лучший учитель истории" },
];

const Nominations = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-8 transition-colors"
        >
          <Icon name="ArrowLeft" size={18} />
          На главную
        </button>

        <h1 className="text-4xl font-bold text-black mb-2">Номинации</h1>
        <p className="text-gray-500 mb-8">Выберите номинацию, чтобы проголосовать</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nominations.map((nom) => (
            <div
              key={nom.id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 hover:border-gray-300"
              onClick={() => navigate(`/vote/${nom.id}`)}
            >
              <div className="text-4xl mb-3">{nom.emoji}</div>
              <h2 className="font-bold text-gray-900 text-sm leading-tight mb-1">{nom.title}</h2>
              <p className="text-gray-400 text-xs">{nom.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-blue-500 text-xs font-medium">
                <span>Голосовать</span>
                <Icon name="ChevronRight" size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Nominations;