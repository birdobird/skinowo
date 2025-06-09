import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="container mx-auto py-16 px-4">
            <h1 className="text-2xl font-bold text-center mb-8">404 - Strona nie znaleziona</h1>
            <p className="text-gray-400 text-center">Przepraszamy, nie znaleziono strony, której szukasz.</p>
            <button onClick={() => navigate('/')} className="mt-8 w-full flex items-center justify-center gap-3 bg-[var(--btnColor)] hover:opacity-90 transition-colors text-[var(--bgColor)] py-3 px-4 rounded-lg cursor-pointer">Powrot do strony glownej</button>
        </div>
    );
};

export default NotFound;