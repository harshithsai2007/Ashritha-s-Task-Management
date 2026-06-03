/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


// Animated Radial Progress Ring
export function ProgressRing({ 
  percent, 
  size = 180, 
  strokeWidth = 14, 
  primaryColor = "#6366F1", 
  secondaryColor = "#06B6D4" 
}: { 
  percent: number; 
  size?: number; 
  strokeWidth?: number; 
  primaryColor?: string; 
  secondaryColor?: string; 
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#1F2937"
          strokeWidth={strokeWidth}
        />
        {/* Dynamic Glowing Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={`url(#radialGrad-${size})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id={`radialGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-black tracking-tighter text-white">{Math.round(percent)}%</span>
        <span className="text-[10px] text-slate-400 font-mono font-bold tracking-widest uppercase mt-1">Growth</span>
      </div>
    </div>
  );
}

// Gorgeous Domain progress comparison bar charts with neon values
export function DomainComparisonChart({
  mlPercent,
  projectPercent,
  toolsCount,
  dsaCount,
  cloudPercent
}: {
  mlPercent: number;
  projectPercent: number;
  toolsCount: number;
  dsaCount: number;
  cloudPercent: number;
}) {
  const domains = [
    { name: "Machine Learning", pct: mlPercent, color: "from-indigo-500 to-indigo-400", label: `${Math.round(mlPercent)}% Mastered` },
    { name: "AI Project Road", pct: projectPercent, color: "from-cyan-500 to-cyan-400", label: `${Math.round(projectPercent)}% Complete` },
    { name: "30 Days AI Tools", pct: (toolsCount / 30) * 100, color: "from-amber-500 to-yellow-400", label: `${toolsCount}/30 Days` },
    { name: "Daily DSA Tracker", pct: Math.min(100, (dsaCount / 10) * 100), color: "from-emerald-500 to-green-400", label: `${dsaCount} Problems Logged` },
    { name: "Cloud Computing", pct: cloudPercent, color: "from-purple-500 to-pink-400", label: `${Math.round(cloudPercent)}% Succeeded` },
  ];

  return (
    <div className="space-y-4">
      {domains.map((dom, i) => (
        <div key={i} className="space-y-1.5 home-domain-bar">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300 font-sans">{dom.name}</span>
            <span className="font-mono text-white font-bold text-[11px]">{dom.label}</span>
          </div>
          <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/60 p-[1px]">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${dom.color} transition-all duration-1000 ease-out`}
              style={{ width: `${Math.max(3, dom.pct)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// SVG Heatmap Calendar Grid representing contribution density
export function ContributionHeatmap({
  dailyLogs = []
}: {
  dailyLogs: { date: string; amount: number }[];
}) {
  // Generates 30 days of entries
  const tiles = Array.from({ length: 28 }).map((_, idx) => {
    const dayOffset = 27 - idx;
    const date = new Date(new Date().getTime() - dayOffset * 24 * 60 * 60 * 1000);
    const dateString = date.toISOString().split("T")[0];
    const log = dailyLogs.find(l => l.date === dateString);
    const level = log ? Math.min(4, Math.floor(log.amount / 1.5)) : 0; // scale to 0-4

    const colorMap = [
      "bg-slate-900 border-slate-800", // 0 Tasks completed
      "bg-indigo-950 border-indigo-900/40 text-indigo-100", // 1-2 Task
      "bg-indigo-800 border-indigo-700/40", // 3-4 Tasks
      "bg-indigo-600 border-indigo-500/40", // 5 Tasks
      "bg-cyan-400 border-cyan-300/40 animate-pulse" // Critical Max Tasks
    ];

    return {
      date: dateString,
      dayNum: date.getDate(),
      color: colorMap[level],
      count: log ? log.amount : 0
    };
  });

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="grid grid-cols-7 gap-1.5">
        {tiles.map((tile, i) => (
          <div
            key={i}
            className={`w-full aspect-square rounded-md border flex items-center justify-center text-[9px] font-bold font-mono transition-all cursor-pointer hover:border-white/20 select-none ${tile.color}`}
            title={`${tile.date}: ${tile.count} strategic updates`}
          >
            {tile.dayNum}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-3 pt-2 border-t border-slate-900/60">
        <span>COLDER</span>
        <div className="flex gap-1.5">
          <div className="w-3.5 h-3.5 bg-slate-900 border border-slate-800 rounded"></div>
          <div className="w-3.5 h-3.5 bg-indigo-950 border border-indigo-900/40 rounded"></div>
          <div className="w-3.5 h-3.5 bg-indigo-800 border border-indigo-700/40 rounded"></div>
          <div className="w-3.5 h-3.5 bg-indigo-600 border border-indigo-500/40 rounded"></div>
          <div className="w-3.5 h-3.5 bg-cyan-400 border border-cyan-300/40 rounded"></div>
        </div>
        <span>BURNING</span>
      </div>
    </div>
  );
}

// Gorgeous SVG based Analytics trends for Weekly Learning Hours & solved counts
export function HoursTrendChart() {
  return (
    <div className="relative h-44 w-full">
      <svg viewBox="0 0 300 120" className="w-full h-full">
        {/* Grids */}
        <line x1="10" y1="20" x2="290" y2="20" stroke="#1F2937" strokeDasharray="3,3" strokeWidth="0.5" />
        <line x1="10" y1="50" x2="290" y2="50" stroke="#1F2937" strokeDasharray="3,3" strokeWidth="0.5" />
        <line x1="10" y1="80" x2="290" y2="80" stroke="#1F2937" strokeDasharray="3,3" strokeWidth="0.5" />
        <line x1="10" y1="110" x2="290" y2="110" stroke="#374151" strokeWidth="1" />

        {/* Gradient fill */}
        <path
          d="M 10 110 L 10 90 Q 56 65 103 40 T 196 35 T 290 15 L 290 110 Z"
          fill="url(#trendGrad)"
          opacity="0.15"
        />

        {/* Glow Line curve */}
        <path
          d="M 10 90 Q 56 65 103 40 T 196 35 T 290 15"
          fill="none"
          stroke="#6366F1"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Dynamic Nodes */}
        <circle cx="10" cy="90" r="5" fill="#6366F1" stroke="#0B1120" strokeWidth="2" />
        <circle cx="103" cy="40" r="5" fill="#06B6D4" stroke="#0B1120" strokeWidth="2" />
        <circle cx="196" cy="35" r="5" fill="#8B5CF6" stroke="#0B1120" strokeWidth="2" />
        <circle cx="290" cy="15" r="5" fill="#10B981" stroke="#0B1120" strokeWidth="2" />

        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0B1120" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Absolute labels */}
      <div className="absolute top-1 right-2 bg-slate-900 border border-indigo-500/20 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-indigo-400">
        9.2H LEARNING TODAY
      </div>
      <div className="absolute bottom-1 w-full flex justify-between px-2 text-[8px] text-slate-500 font-mono">
        <span>MON</span>
        <span>WED</span>
        <span>FRI</span>
        <span>SUN</span>
      </div>
    </div>
  );
}
