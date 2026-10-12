import { useState, useRef, useEffect, useCallback } from 'react';

interface Planet {
  name: string;
  nameEn: string;
  radius: number; // visual radius in pixels
  orbitRadius: number; // orbit radius in pixels
  distance: string; // distance from sun in km
  period: string; // orbital period
  periodYears: number; // orbital period in Earth years (for animation speed)
  color: string;
  description: string;
  diameter: string;
  moons: number;
}

const planets: Planet[] = [
  {
    name: '水星',
    nameEn: 'Mercury',
    radius: 4,
    orbitRadius: 60,
    distance: '5790万公里',
    period: '88天',
    periodYears: 0.24,
    color: '#b5b5b5',
    description: '太阳系中最小的行星，也是距离太阳最近的行星。表面布满陨石坑，昼夜温差极大。',
    diameter: '4,879公里',
    moons: 0,
  },
  {
    name: '金星',
    nameEn: 'Venus',
    radius: 7,
    orbitRadius: 95,
    distance: '1.082亿公里',
    period: '225天',
    periodYears: 0.62,
    color: '#e8cda0',
    description: '太阳系中最热的行星，拥有浓密的二氧化碳大气层，产生强烈的温室效应。',
    diameter: '12,104公里',
    moons: 0,
  },
  {
    name: '地球',
    nameEn: 'Earth',
    radius: 8,
    orbitRadius: 130,
    distance: '1.496亿公里',
    period: '365.25天',
    periodYears: 1,
    color: '#4da6ff',
    description: '我们的家园，太阳系中唯一已知存在生命的行星。拥有液态水和适宜的大气层。',
    diameter: '12,756公里',
    moons: 1,
  },
  {
    name: '火星',
    nameEn: 'Mars',
    radius: 6,
    orbitRadius: 170,
    distance: '2.279亿公里',
    period: '687天',
    periodYears: 1.88,
    color: '#e85d3a',
    description: '被称为"红色星球"，表面富含氧化铁。拥有太阳系最高的山峰——奥林帕斯山。',
    diameter: '6,792公里',
    moons: 2,
  },
  {
    name: '木星',
    nameEn: 'Jupiter',
    radius: 18,
    orbitRadius: 230,
    distance: '7.786亿公里',
    period: '11.86年',
    periodYears: 11.86,
    color: '#d4a574',
    description: '太阳系中最大的行星，是一颗气态巨行星。著名的大红斑是一个持续数百年的风暴。',
    diameter: '142,984公里',
    moons: 95,
  },
  {
    name: '土星',
    nameEn: 'Saturn',
    radius: 15,
    orbitRadius: 290,
    distance: '14.34亿公里',
    period: '29.46年',
    periodYears: 29.46,
    color: '#f0d68a',
    description: '以壮观的环系统闻名，主要由冰和岩石碎片组成。是太阳系中密度最小的行星。',
    diameter: '120,536公里',
    moons: 146,
  },
  {
    name: '天王星',
    nameEn: 'Uranus',
    radius: 11,
    orbitRadius: 345,
    distance: '28.71亿公里',
    period: '84.01年',
    periodYears: 84.01,
    color: '#7de8e8',
    description: '一颗冰巨星，独特之处在于它几乎"躺着"绕太阳公转，自转轴倾斜约98度。',
    diameter: '51,118公里',
    moons: 28,
  },
  {
    name: '海王星',
    nameEn: 'Neptune',
    radius: 10,
    orbitRadius: 395,
    distance: '45.04亿公里',
    period: '164.8年',
    periodYears: 164.8,
    color: '#4169e1',
    description: '太阳系中最远的行星，拥有太阳系中最强的风速，可达2,100公里/小时。',
    diameter: '49,528公里',
    moons: 16,
  },
];

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);
  const planetPositionsRef = useRef<{ x: number; y: number; planet: Planet }[]>([]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const drawSolarSystem = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
      const x = (Math.sin(i * 1234.5678) * 0.5 + 0.5) * width;
      const y = (Math.cos(i * 8765.4321) * 0.5 + 0.5) * height;
      const size = (Math.sin(i * 111.111) * 0.5 + 0.5) * 1.5 + 0.5;
      const alpha = (Math.sin(time * 0.001 + i) * 0.3 + 0.7);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw orbits
    planets.forEach((planet) => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, planet.orbitRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw sun glow
    const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 45);
    sunGradient.addColorStop(0, 'rgba(255, 200, 50, 1)');
    sunGradient.addColorStop(0.5, 'rgba(255, 150, 0, 0.8)');
    sunGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 45, 0, Math.PI * 2);
    ctx.fill();

    // Draw sun
    const sunCoreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 28);
    sunCoreGradient.addColorStop(0, '#fff7e6');
    sunCoreGradient.addColorStop(0.3, '#ffdd44');
    sunCoreGradient.addColorStop(0.7, '#ffaa00');
    sunCoreGradient.addColorStop(1, '#ff6600');
    ctx.fillStyle = sunCoreGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 28, 0, Math.PI * 2);
    ctx.fill();

    // Draw planets
    const positions: { x: number; y: number; planet: Planet }[] = [];
    planets.forEach((planet) => {
      const angle = (time * 0.0003) / planet.periodYears;
      const x = centerX + Math.cos(angle) * planet.orbitRadius;
      const y = centerY + Math.sin(angle) * planet.orbitRadius;

      positions.push({ x, y, planet });

      // Planet shadow/glow
      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, planet.radius + 4);
      glowGradient.addColorStop(0, planet.color);
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(x, y, planet.radius + 4, 0, Math.PI * 2);
      ctx.fill();

      // Planet body
      const planetGradient = ctx.createRadialGradient(
        x - planet.radius * 0.3,
        y - planet.radius * 0.3,
        0,
        x,
        y,
        planet.radius
      );
      planetGradient.addColorStop(0, lightenColor(planet.color, 40));
      planetGradient.addColorStop(1, planet.color);
      ctx.fillStyle = planetGradient;
      ctx.beginPath();
      ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
      ctx.fill();

      // Saturn rings
      if (planet.name === '土星') {
        ctx.strokeStyle = 'rgba(210, 180, 120, 0.6)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(x, y, planet.radius + 8, (planet.radius + 8) * 0.3, 0.3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(210, 180, 120, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(x, y, planet.radius + 12, (planet.radius + 12) * 0.3, 0.3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Planet name label
      const isHovered = hoveredPlanet === planet.name;
      const isSelected = selectedPlanet?.name === planet.name;
      if (isHovered || isSelected) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(planet.name, x, y - planet.radius - 8);
      }
    });

    planetPositionsRef.current = positions;
  }, [hoveredPlanet, selectedPlanet]);

  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp;
    }

    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    if (isPlayingRef.current) {
      timeRef.current += delta * speedRef.current;
    }

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    drawSolarSystem(ctx, rect.width, rect.height, timeRef.current);

    animationRef.current = requestAnimationFrame(animate);
  }, [drawSolarSystem]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let clicked: Planet | null = null;
    for (const pos of planetPositionsRef.current) {
      const dx = x - pos.x;
      const dy = y - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= pos.planet.radius + 8) {
        clicked = pos.planet;
        break;
      }
    }

    setSelectedPlanet(clicked);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let hovered: string | null = null;
    for (const pos of planetPositionsRef.current) {
      const dx = x - pos.x;
      const dy = y - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= pos.planet.radius + 8) {
        hovered = pos.planet.name;
        break;
      }
    }

    setHoveredPlanet(hovered);
    canvas.style.cursor = hovered ? 'pointer' : 'default';
  };

  return (
    <div className="w-full h-screen bg-[#0a0a1a] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-[#0d1b2a] to-[#1b2838] border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <span className="text-sm">☀️</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">交互式太阳系</h1>
          <span className="text-xs text-gray-400 ml-2 hidden sm:inline">Solar System Explorer</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="hidden md:inline">点击行星查看详细信息</span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Canvas */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
          />

          {/* Planet Legend */}
          <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <h3 className="text-xs font-semibold text-gray-300 mb-2">行星列表</h3>
            <div className="grid grid-cols-2 gap-1">
              {planets.map((planet) => (
                <button
                  key={planet.name}
                  onClick={() => setSelectedPlanet(planet)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all ${
                    selectedPlanet?.name === planet.name
                      ? 'bg-white/20 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: planet.color }}
                  ></span>
                  <span>{planet.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info Panel */}
        {selectedPlanet && (
          <div className="w-80 bg-gradient-to-b from-[#0d1b2a] to-[#162032] border-l border-white/10 p-5 overflow-y-auto animate-slide-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">{selectedPlanet.name}</h2>
              <button
                onClick={() => setSelectedPlanet(null)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-4">{selectedPlanet.nameEn}</p>

            {/* Planet visual */}
            <div className="flex justify-center mb-6">
              <div
                className="rounded-full shadow-lg animate-spin-slow"
                style={{
                  width: `${Math.max(selectedPlanet.radius * 4, 50)}px`,
                  height: `${Math.max(selectedPlanet.radius * 4, 50)}px`,
                  background: `radial-gradient(circle at 35% 35%, ${lightenColor(selectedPlanet.color, 40)}, ${selectedPlanet.color})`,
                  boxShadow: `0 0 30px ${selectedPlanet.color}40`,
                }}
              ></div>
            </div>

            {/* Info cards */}
            <div className="space-y-3">
              <InfoCard icon="📏" label="直径" value={selectedPlanet.diameter} />
              <InfoCard icon="🌞" label="距太阳距离" value={selectedPlanet.distance} />
              <InfoCard icon="🔄" label="公转周期" value={selectedPlanet.period} />
              <InfoCard icon="🌙" label="卫星数量" value={`${selectedPlanet.moons} 颗`} />
            </div>

            {/* Description */}
            <div className="mt-5 p-3 bg-white/5 rounded-lg border border-white/5">
              <h4 className="text-xs font-semibold text-gray-300 mb-2">📖 简介</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{selectedPlanet.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="px-6 py-3 bg-gradient-to-r from-[#0d1b2a] to-[#1b2838] border-t border-white/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
          >
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="3" y="2" width="4" height="12" rx="1" />
                <rect x="9" y="2" width="4" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 2l10 6-10 6V2z" />
              </svg>
            )}
          </button>

          {/* Speed Control */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">速度</span>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-24 md:w-36 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-blue-400"
            />
            <span className="text-xs text-blue-300 font-mono w-10">{speed.toFixed(1)}x</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="hidden sm:inline">⌨️ 点击行星查看详情</span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline">🪐 八大行星轨道运动模拟</span>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-2.5 bg-white/5 rounded-lg border border-white/5">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
}

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}
