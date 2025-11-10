// src/pages/MapPage.tsx
import { useState } from "react";
import {
  Search,
  Home,
  MapPin,
  BookOpen,
  Locate,
  ChevronLeft,
} from "lucide-react";
import BoothModal from "../components/BoothModal";
import TimelineModal from "../components/TimelineModal";
import ClubDetailModal from "../components/ClubDetailModal";
import EcomongDetailModal from "../components/EcomongDetailModal";
import SpecialMarker from "../components/SpecialMarker";
import SpecialMarkerModal from "../components/SpecialMarkerModal";
import type { Booth } from "../types/Booth";
import type { Club } from "../types/Club";

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"home" | "map" | "guide">("home");
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showSpecialMarker, setShowSpecialMarker] = useState(false);
  const [showEcomongDetail, setShowEcomongDetail] = useState(false);

  const performances = [
    {
      id: "1",
      time: "14:00 - 14:30",
      title: "개막식 축가",
      artist: "충남대학교 합창단",
      stage: "메인무대",
    },
    {
      id: "2",
      time: "14:30 - 15:00",
      title: "밴드 공연",
      artist: "전자음악동아리",
      stage: "메인무대",
    },
    {
      id: "3",
      time: "15:30 - 16:00",
      title: "K-pop 커버 공연",
      artist: "댄스팀 SOUL",
      stage: "메인무대",
    },
    {
      id: "4",
      time: "16:30 - 17:00",
      title: "우쿨렐레 공연",
      artist: "우쿨렐레동아리",
      stage: "소공연장",
    },
    {
      id: "5",
      time: "17:30 - 18:00",
      title: "성악 독창회",
      artist: "음악학과",
      stage: "메인무대",
    },
    {
      id: "6",
      time: "18:30 - 19:30",
      title: "유명 가수 공연",
      artist: "초대 가수",
      stage: "메인무대",
    },
  ];

  // 에코몽 마커 (부스)
  const booths: Booth[] = [
    {
      id: "1",
      position: { top: "18%", left: "15%" },
      emoji: "🐕",
      name: "2025 충남대 축제",
      time: "17:30 - 17:35",
      location: "광장1",
      image: "",
    },
    {
      id: "2",
      position: { top: "25%", left: "17%" },
      emoji: "🦮",
      name: "문화 공연 부스",
      time: "16:00 - 17:00",
      location: "체육관 앞 10번",
      image: "",
    },
    {
      id: "3",
      position: { top: "38%", left: "50%" },
      emoji: "🐩",
      name: "음식 부스",
      time: "12:00 - 20:00",
      location: "중앙광장",
      image: "",
    },
    {
      id: "4",
      position: { top: "62%", left: "42%" },
      emoji: "🐶",
      name: "체험 부스",
      time: "14:00 - 18:00",
      location: "학생회관",
      image: "",
    },
  ];

  // 동아리 부스
  const clubs: Club[] = [
    {
      id: "club1",
      name: "댄스팀 SOUL",
      history:
        "충남대학교의 대표 댄스팀으로 2010년부터 설립되어 K-pop 문화를 널리 알리고 있습니다. 매 축제마다 멋진 공연으로 관객들의 마음을 사로잡고 있습니다.",
      poster: "🎭",
      emoji: "💃",
      position: { top: "20%", left: "45%" },
      boothDescription:
        "댄스팀 SOUL의 공식 굿즈 판매 및 댄스 클래스 신청을 받고 있습니다. 현장에서 무료 댄스 레슨도 진행합니다!",
      boothTime: "10:00 - 18:00",
      location: "중앙광장 부스",
    },
    {
      id: "club2",
      name: "충남대 밴드동아리",
      history:
        "2005년에 설립된 충남대학교 밴드동아리는 다양한 장르의 음악을 연주하며 캠퍼스 문화를 풍요롭게 만들어가고 있습니다.",
      poster: "🎸",
      emoji: "🎸",
      position: { top: "42%", left: "28%" },
      boothDescription:
        "라이브 공연 관람, 악기 체험, 밴드 가입 설명회를 진행합니다. 특별 게스트 공연도 있습니다!",
      boothTime: "11:00 - 19:00",
      location: "공연장 근처",
    },
    {
      id: "club3",
      name: "사진동아리 LENS",
      history:
        "캠퍼스의 아름다운 순간들을 담아내는 사진동아리 LENS입니다. 2015년 설립 이후 많은 전시회를 개최했습니다.",
      poster: "📷",
      emoji: "📷",
      position: { top: "55%", left: "58%" },
      boothDescription:
        "현장 프로필 촬영, 사진 인화 서비스, 카메라 체험 부스를 운영합니다. 원본 사진은 SNS로 받으실 수 있습니다!",
      boothTime: "10:00 - 20:00",
      location: "학생광장",
    },
  ];

  return (
    <div className="relative w-full h-full bg-white overflow-hidden flex flex-col">
      {/* Status Bar */}
      <div className="px-6 pt-3 pb-2 flex items-center justify-between text-sm font-semibold">
        <span>9:41</span>
        <div className="flex items-center gap-1 text-xs">
          <span>📶</span>
          <span>📡</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Header */}
      <div className="px-5 pb-4 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">2025 충남대 축제</h1>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="부스 / 장소를 검색해보세요."
            className="w-full pl-5 pr-12 py-3.5 bg-white border-2 border-gray-300 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 overflow-hidden">
        {/* Map Background Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-40">
          <line
            x1="0"
            y1="30%"
            x2="100%"
            y2="30%"
            stroke="#cbd5e1"
            strokeWidth="3"
          />
          <line
            x1="0"
            y1="55%"
            x2="100%"
            y2="55%"
            stroke="#cbd5e1"
            strokeWidth="3"
          />
          <line
            x1="30%"
            y1="0"
            x2="30%"
            y2="100%"
            stroke="#cbd5e1"
            strokeWidth="3"
          />
          <line
            x1="65%"
            y1="0"
            x2="65%"
            y2="100%"
            stroke="#cbd5e1"
            strokeWidth="2"
          />
          <line
            x1="15%"
            y1="0"
            x2="15%"
            y2="100%"
            stroke="#e2e8f0"
            strokeWidth="1.5"
          />
          <line
            x1="45%"
            y1="0"
            x2="45%"
            y2="100%"
            stroke="#e2e8f0"
            strokeWidth="1.5"
          />
          <line
            x1="80%"
            y1="0"
            x2="80%"
            y2="100%"
            stroke="#e2e8f0"
            strokeWidth="1.5"
          />
          <line
            x1="0"
            y1="15%"
            x2="100%"
            y2="15%"
            stroke="#e2e8f0"
            strokeWidth="1.5"
          />
          <line
            x1="0"
            y1="45%"
            x2="100%"
            y2="45%"
            stroke="#e2e8f0"
            strokeWidth="1.5"
          />
          <line
            x1="0"
            y1="70%"
            x2="100%"
            y2="70%"
            stroke="#e2e8f0"
            strokeWidth="1.5"
          />
        </svg>

        {/* Map Labels */}
        <div className="absolute top-[12%] left-[5%] text-xs text-blue-400 font-medium opacity-70">
          차양대학대학교 2호관
        </div>
        <div className="absolute top-[15%] right-[15%] text-xs text-blue-400 font-medium opacity-70">
          창조적통합광장
        </div>
        <div className="absolute top-[20%] left-[8%] text-xs text-gray-600 font-medium opacity-60">
          체육관 앞 10번
        </div>
        <div className="absolute top-[30%] right-[5%] text-xs text-blue-400 font-medium opacity-70">
          대학본부 E7동
        </div>
        <div className="absolute top-[32%] right-[25%] text-xs text-gray-500 font-medium opacity-60">
          인화분부
        </div>
        <div className="absolute bottom-[45%] left-[25%] text-xs text-gray-600 font-medium opacity-60">
          대리뮤직스
        </div>
        <div className="absolute bottom-[35%] left-[15%] text-xs text-gray-600 font-medium opacity-60">
          학생회관
        </div>
        <div className="absolute bottom-[25%] right-[15%] text-xs text-blue-400 font-medium opacity-70">
          공과대학교 E2동
        </div>
        <div className="absolute bottom-[15%] right-[10%] text-xs text-blue-400 font-medium opacity-70">
          봉명초등학교
        </div>
        <div className="absolute bottom-[5%] left-[35%] text-xs text-gray-500 font-medium opacity-60">
          CNU 법대입구
        </div>

        {/* Park Circles */}
        <div className="absolute top-[35%] left-[35%] w-8 h-8 bg-blue-200 rounded-full opacity-30" />
        <div className="absolute top-[50%] left-[60%] w-6 h-6 bg-blue-200 rounded-full opacity-30" />
        <div className="absolute bottom-[20%] right-[20%] w-10 h-10 bg-blue-200 rounded-full opacity-30" />

        {/* 에코몽 마커 (파란색 핀) */}
        {booths.map((booth) => (
          <button
            key={booth.id}
            onClick={() => setShowEcomongDetail(true)}
            className="absolute transition-transform duration-200 hover:scale-110 cursor-pointer"
            style={{ top: booth.position.top, left: booth.position.left }}
          >
            <div className="relative">
              <div className="w-14 h-14 bg-white rounded-full border-4 border-blue-500 shadow-lg flex items-center justify-center relative z-10">
                <span className="text-2xl">{booth.emoji}</span>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-[85%] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-blue-500" />
            </div>
          </button>
        ))}

        {/* 동아리 마커 (보라색 핀) */}
        {clubs.map((club) => (
          <button
            key={club.id}
            onClick={() => setSelectedClub(club)}
            className="absolute transition-transform duration-200 hover:scale-110 cursor-pointer"
            style={{ top: club.position.top, left: club.position.left }}
          >
            <div className="relative">
              <div className="w-14 h-14 bg-white rounded-full border-4 border-purple-500 shadow-lg flex items-center justify-center relative z-10">
                <span className="text-2xl">{club.emoji}</span>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-[85%] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-purple-500" />
            </div>
          </button>
        ))}

        {/* 특별 마커 - 현재 위치 */}
        <SpecialMarker onPopClick={() => setShowSpecialMarker(true)} />

        {/* 공연 일정 버튼 */}
        <button
          onClick={() => setShowTimeline(true)}
          className="absolute bottom-24 left-4 px-4 py-2 bg-white rounded-full shadow-lg text-sm font-semibold text-blue-600 hover:bg-gray-50 transition-colors border border-blue-200"
        >
          🎤 공연 일정
        </button>

        {/* Location Button */}
        <button className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors active:scale-95">
          <Locate className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200">
        <div className="flex items-center justify-around px-6 py-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 py-2 transition-colors ${
              activeTab === "home" ? "text-red-500" : "text-gray-400"
            }`}
          >
            <Home
              className="w-7 h-7"
              fill={activeTab === "home" ? "currentColor" : "none"}
            />
            <span className="text-xs font-medium">홈</span>
          </button>

          <button
            onClick={() => setActiveTab("map")}
            className={`flex flex-col items-center gap-1 py-2 transition-colors ${
              activeTab === "map" ? "text-red-500" : "text-gray-400"
            }`}
          >
            <MapPin
              className="w-7 h-7"
              fill={activeTab === "map" ? "currentColor" : "none"}
            />
            <span className="text-xs font-medium">지도</span>
          </button>

          <button
            onClick={() => setActiveTab("guide")}
            className={`flex flex-col items-center gap-1 py-2 transition-colors ${
              activeTab === "guide" ? "text-red-500" : "text-gray-400"
            }`}
          >
            <BookOpen
              className="w-7 h-7"
              fill={activeTab === "guide" ? "currentColor" : "none"}
            />
            <span className="text-xs font-medium">도감</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      {selectedBooth && (
        <BoothModal
          booth={selectedBooth}
          onClose={() => setSelectedBooth(null)}
        />
      )}

      {selectedClub && (
        <ClubDetailModal
          club={selectedClub}
          onClose={() => setSelectedClub(null)}
        />
      )}

      {showTimeline && (
        <TimelineModal
          performances={performances}
          onClose={() => setShowTimeline(false)}
        />
      )}

      {showSpecialMarker && (
        <SpecialMarkerModal onClose={() => setShowSpecialMarker(false)} />
      )}

      {showEcomongDetail && (
        <EcomongDetailModal
          booth={booths[0]}
          onClose={() => setShowEcomongDetail(false)}
        />
      )}
    </div>
  );
}
