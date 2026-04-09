import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative z-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-black">Добро пожаловать!</h1>
        <p className="text-xl text-gray-600 mb-8">Вы попали на голосование. Здесь вы можете отдать свой голос в номинациях за разных учителей.</p>
        <Button onClick={() => navigate("/nominations")} size="lg" className="text-white">
          Перейти к голосованию
        </Button>
      </div>
    </div>
  );
};

export default Index;