import { useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import TopNav from '@/components/common/TopNav'

const FILTER_OPTIONS = {
  ecosystem: ['육지', '바다', '하늘', '습지'],
  risk: ['멸종위기', '취약', '관심대상', '안전'],
  sort: ['최신순', '오래된순', '가나다순'],
}

export function DictionaryPage() {
  const [activeTab, setActiveTab] = useState<'animal' | 'plant'>('animal')

  const [openFilter, setOpenFilter] = useState<
    'ecosystem' | 'risk' | 'sort' | null
  >(null)

  const [selectedFilters, setSelectedFilters] = useState({
    ecosystem: '생태계',
    risk: '위험도',
    sort: '시간순',
  })

  const toggleFilter = (filterName: 'ecosystem' | 'risk' | 'sort') => {
    setOpenFilter((prev) => (prev === filterName ? null : filterName))
  }

  const handleSelectOption = (
    filterName: 'ecosystem' | 'risk' | 'sort',
    value: string,
  ) => {
    setSelectedFilters((prev) => ({ ...prev, [filterName]: value }))
    setOpenFilter(null)
  }

  const items = [
    ...Array.from({ length: 3 }).map((_, i) => ({
      id: `eco1-${i}`,
      isCollected: true,
      name: '하늘다람쥐',
      rank: '취약',
      bg: '/echosystem_1.png',
      char: '/echomong_1.png',
    })),
    ...Array.from({ length: 3 }).map((_, i) => ({
      id: `eco2-${i}`,
      isCollected: true,
      name: '하늘다람쥐',
      rank: '취약',
      bg: '/echosystem_2.png',
      char: '/echomong_1.png',
    })),
    ...Array.from({ length: 3 }).map((_, i) => ({
      id: `eco3-${i}`,
      isCollected: true,
      name: '하늘다람쥐',
      rank: '취약',
      bg: '/echosystem_3.png',
      char: '/echomong_1.png',
    })),
  ]

  return (
    <div
      className="flex flex-col w-full h-full bg-white relative"
      onClick={() => setOpenFilter(null)}
    >
      <TopNav title="도감" />
      <div
        className="flex flex-col px-5 pb-10 overflow-y-auto h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mt-2 mb-4 relative">
          <input
            type="text"
            placeholder="검색"
            className="w-full border border-blue-500 rounded-full py-2 pl-4 pr-10 text-lg text-blue-900 placeholder-blue-300 outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500">
            <Search size={24} />
          </button>
        </div>

        <div className="flex w-full border border-blue-500 rounded-full overflow-hidden mb-4 shrink-0">
          <button
            onClick={() => setActiveTab('animal')}
            className={`flex-1 py-2 text-center font-bold transition-colors ${
              activeTab === 'animal'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-400 hover:bg-gray-50'
            }`}
          >
            동물보기
          </button>
          <div className="w-px bg-blue-500"></div>
          <button
            onClick={() => setActiveTab('plant')}
            className={`flex-1 py-2 text-center font-bold transition-colors ${
              activeTab === 'plant'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-400 hover:bg-gray-50'
            }`}
          >
            식물보기
          </button>
        </div>

        <div className="flex gap-2 mb-6 relative z-20">
          <div className="relative">
            <button
              onClick={() => toggleFilter('ecosystem')}
              className={`flex items-center px-3 py-1 border rounded-full text-sm font-medium transition-colors ${
                openFilter === 'ecosystem'
                  ? 'bg-blue-50 border-blue-600 text-blue-700'
                  : 'bg-white border-blue-500 text-black hover:bg-gray-50'
              }`}
            >
              {selectedFilters.ecosystem}
              <ChevronDown
                size={16}
                className={`ml-1 transition-transform ${openFilter === 'ecosystem' ? 'rotate-180' : ''}`}
              />
            </button>

            {openFilter === 'ecosystem' && (
              <div className="absolute top-full left-0 mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {FILTER_OPTIONS.ecosystem.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelectOption('ecosystem', option)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => toggleFilter('risk')}
              className={`flex items-center px-3 py-1 border rounded-full text-sm font-medium transition-colors ${
                openFilter === 'risk'
                  ? 'bg-blue-50 border-blue-600 text-blue-700'
                  : 'bg-white border-blue-500 text-black hover:bg-gray-50'
              }`}
            >
              {selectedFilters.risk}
              <ChevronDown
                size={16}
                className={`ml-1 transition-transform ${openFilter === 'risk' ? 'rotate-180' : ''}`}
              />
            </button>

            {openFilter === 'risk' && (
              <div className="absolute top-full left-0 mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {FILTER_OPTIONS.risk.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelectOption('risk', option)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => toggleFilter('sort')}
              className={`flex items-center px-3 py-1 border rounded-full text-sm font-medium transition-colors ${
                openFilter === 'sort'
                  ? 'bg-blue-50 border-blue-600 text-blue-700'
                  : 'bg-white border-blue-500 text-black hover:bg-gray-50'
              }`}
            >
              {selectedFilters.sort}
              <ChevronDown
                size={16}
                className={`ml-1 transition-transform ${openFilter === 'sort' ? 'rotate-180' : ''}`}
              />
            </button>

            {openFilter === 'sort' && (
              <div className="absolute top-full left-0 mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {FILTER_OPTIONS.sort.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelectOption('sort', option)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 z-0">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative aspect-3/4 w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50"
            >
              <img
                src={item.bg}
                alt="배경"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {item.isCollected && (
                <>
                  <div className="absolute inset-0 flex items-center justify-center pt-4">
                    <img
                      src={item.char}
                      alt={item.name}
                      className="w-3/4 h-3/4 object-contain drop-shadow-md"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-[rgba(255,249,196,0.9)] to-transparent flex flex-col justify-end p-2">
                    <div className="flex items-center gap-1">
                      <span className="bg-yellow-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                        {item.rank}
                      </span>
                      <span className="text-xs font-bold text-gray-800 truncate">
                        {item.name}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
