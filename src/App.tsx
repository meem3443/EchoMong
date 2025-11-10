// src/App.tsx
import MapPage from "./pages/MapPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="w-[390px] h-[844px] bg-black rounded-[50px] p-2 shadow-2xl">
        <div className="w-full h-full bg-white rounded-[44px] overflow-hidden relative">
          {/* Dynamic Island */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-b-3xl z-50" />

          <MapPage />
        </div>
      </div>
    </div>
  );
}

export default App;
