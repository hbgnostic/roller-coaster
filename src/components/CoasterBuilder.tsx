"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useMode } from "@/lib/ModeContext";
import { saveDesign, getUserId } from "@/lib/supabase";

interface Point {
  x: number;
  y: number;
}

const PRESETS: Record<string, Point[]> = {
  "The Beast": [
    { x: 50, y: 350 }, { x: 120, y: 60 }, { x: 220, y: 300 }, { x: 320, y: 100 },
    { x: 420, y: 280 }, { x: 520, y: 120 }, { x: 620, y: 260 }, { x: 720, y: 160 },
    { x: 800, y: 350 },
  ],
  "Loop-de-Loop": [
    { x: 50, y: 350 }, { x: 100, y: 60 }, { x: 200, y: 320 }, { x: 280, y: 140 },
    { x: 320, y: 220 }, { x: 360, y: 140 }, { x: 440, y: 320 }, { x: 540, y: 100 },
    { x: 640, y: 280 }, { x: 750, y: 350 },
  ],
  "Kid Friendly": [
    { x: 50, y: 350 }, { x: 150, y: 200 }, { x: 300, y: 300 }, { x: 450, y: 220 },
    { x: 600, y: 280 }, { x: 750, y: 350 },
  ],
};

function catmullRom(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

function interpolate(points: Point[], resolution = 200): Point[] {
  if (points.length < 2) return points;
  const curve: Point[] = [];
  const pts = [points[0], ...points, points[points.length - 1]];
  for (let i = 0; i < pts.length - 3; i++) {
    for (let t = 0; t <= 1; t += 1 / resolution) {
      curve.push(catmullRom(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], t));
    }
  }
  return curve;
}

const PIXELS_TO_METERS = 0.5;
const GRAVITY = 9.81;

function speedAtPoint(startY: number, currentY: number): number {
  const h = Math.max(0, startY - currentY) * PIXELS_TO_METERS;
  const v = Math.sqrt(2 * GRAVITY * h);
  return v * 2.237; // m/s to mph
}

function speedAtPointMs(startY: number, currentY: number): number {
  const h = Math.max(0, startY - currentY) * PIXELS_TO_METERS;
  return Math.sqrt(2 * GRAVITY * h);
}

// Calculate radius of curvature using numerical derivatives
function radiusOfCurvature(points: Point[], i: number): number {
  if (i <= 0 || i >= points.length - 1) return Infinity;

  const prev = points[i - 1];
  const curr = points[i];
  const next = points[i + 1];

  // First derivatives (central difference)
  const dx = (next.x - prev.x) / 2;
  const dy = (next.y - prev.y) / 2;

  // Second derivatives
  const ddx = next.x - 2 * curr.x + prev.x;
  const ddy = next.y - 2 * curr.y + prev.y;

  // Curvature = |x'y'' - y'x''| / (x'^2 + y'^2)^(3/2)
  const numerator = Math.abs(dx * ddy - dy * ddx);
  const denominator = Math.pow(dx * dx + dy * dy, 1.5);

  if (numerator < 0.0001) return Infinity; // Nearly straight

  const curvature = numerator / denominator;
  return (1 / curvature) * PIXELS_TO_METERS; // radius in meters
}

// Calculate G-force from centripetal acceleration
function gForceAtPoint(speed: number, radius: number): number {
  if (radius === Infinity || radius === 0) return 0;
  const centripetalAccel = (speed * speed) / radius;
  return centripetalAccel / GRAVITY;
}

export default function CoasterBuilder() {
  const { kidMode } = useMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [animating, setAnimating] = useState(false);
  const [carIndex, setCarIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [stats, setStats] = useState({ maxSpeed: 0, maxHeight: 0, maxG: 0 });
  const [showExplainer, setShowExplainer] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const animRef = useRef<number>(0);

  const canvasWidth = 850;
  const canvasHeight = 420;

  const curvePoints = interpolate(points, 80);

  // Draw
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Grid
    ctx.strokeStyle = "rgba(168, 85, 247, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvasWidth; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvasHeight); ctx.stroke();
    }
    for (let y = 0; y < canvasHeight; y += 50) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvasWidth, y); ctx.stroke();
    }

    // Ground
    ctx.fillStyle = "rgba(168, 85, 247, 0.05)";
    ctx.fillRect(0, canvasHeight - 30, canvasWidth, 30);
    ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
    ctx.beginPath(); ctx.moveTo(0, canvasHeight - 30); ctx.lineTo(canvasWidth, canvasHeight - 30); ctx.stroke();

    if (curvePoints.length > 1) {
      // Supports
      ctx.strokeStyle = "rgba(168, 85, 247, 0.15)";
      ctx.lineWidth = 2;
      for (let i = 0; i < curvePoints.length; i += 20) {
        const p = curvePoints[i];
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, canvasHeight - 30); ctx.stroke();
      }

      // Track - colored by speed
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      const startY = curvePoints[0]?.y ?? canvasHeight;
      for (let i = 1; i < curvePoints.length; i++) {
        const spd = speedAtPoint(startY, curvePoints[i].y);
        const ratio = Math.min(spd / 80, 1);
        const r = Math.round(59 + ratio * 185);
        const g = Math.round(130 - ratio * 100);
        const b = Math.round(246 - ratio * 200);
        ctx.strokeStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath();
        ctx.moveTo(curvePoints[i - 1].x, curvePoints[i - 1].y);
        ctx.lineTo(curvePoints[i].x, curvePoints[i].y);
        ctx.stroke();
      }

      // Neon glow
      ctx.save();
      ctx.strokeStyle = "rgba(168, 85, 247, 0.2)";
      ctx.lineWidth = 12;
      ctx.filter = "blur(6px)";
      ctx.beginPath();
      ctx.moveTo(curvePoints[0].x, curvePoints[0].y);
      curvePoints.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
      ctx.restore();
    }

    // Control points
    points.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, kidMode ? 10 : 7, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? "#22c55e" : i === points.length - 1 ? "#ef4444" : "#fbbf24";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Car
    if (animating && curvePoints[carIndex]) {
      const cp = curvePoints[carIndex];
      ctx.fillStyle = "#f43f5e";
      ctx.beginPath();
      ctx.roundRect(cp.x - 12, cp.y - 14, 24, 16, 4);
      ctx.fill();
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(cp.x - 10, cp.y - 22, 8, 10);
      ctx.fillRect(cp.x + 2, cp.y - 22, 8, 10);
      ctx.fillStyle = "#e2e8f0";
      ctx.beginPath(); ctx.arc(cp.x - 6, cp.y + 4, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cp.x + 6, cp.y + 4, 4, 0, Math.PI * 2); ctx.fill();
    }
  }, [points, curvePoints, animating, carIndex, kidMode, canvasWidth, canvasHeight]);

  useEffect(() => { draw(); }, [draw]);

  // Click to add point
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (animating) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    setPoints((prev) => [...prev, { x, y }]);
    setActivePreset(null); // User is now drawing custom
  };

  // Launch animation
  const launch = () => {
    if (curvePoints.length < 2) return;
    setAnimating(true);
    setCarIndex(0);
    if (kidMode) setShowConfetti(true);

    // Compute stats using proper physics
    const startY = curvePoints[0].y;
    let maxSpd = 0, maxH = 0, maxG = 0;
    for (let i = 1; i < curvePoints.length; i++) {
      const s = speedAtPoint(startY, curvePoints[i].y);
      const h = (startY - curvePoints[i].y) * PIXELS_TO_METERS * 3.28; // to feet
      if (s > maxSpd) maxSpd = s;
      if (h > maxH) maxH = h;

      // G-force from centripetal acceleration: a = v²/r
      if (i > 0 && i < curvePoints.length - 1) {
        const speedMs = speedAtPointMs(startY, curvePoints[i].y);
        const radius = radiusOfCurvature(curvePoints, i);
        const g = gForceAtPoint(speedMs, radius);
        if (g > maxG) maxG = g;
      }
    }
    setStats({ maxSpeed: Math.round(maxSpd), maxHeight: Math.round(Math.abs(maxH)), maxG: Math.round(maxG * 10) / 10 });

    let idx = 0;
    const step = () => {
      idx += 2;
      if (idx >= curvePoints.length) {
        setAnimating(false);
        setTimeout(() => setShowConfetti(false), 3000);
        return;
      }
      setCarIndex(idx);
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
  };

  const handleSave = async () => {
    if (points.length < 2) return;
    const name = prompt(kidMode ? "Name your coaster!" : "Name your coaster:") || "My Coaster";
    await saveDesign({ user_id: getUserId(kidMode), name, points });
    alert(kidMode ? "🎢 Coaster saved!" : "Design saved!");
  };

  return (
    <section id="builder" className="py-20 px-4 max-w-5xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-black text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        {kidMode ? "🎨 Build Your Own Coaster!" : "Coaster Builder"}
      </h2>
      <p className="text-center text-purple-300 mb-8">
        {kidMode ? "Click to drop points and make a CRAZY track!" : "Click the canvas to place control points. Catmull-Rom spline interpolation creates smooth curves."}
      </p>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {Object.keys(PRESETS).map((name) => (
          <button
            key={name}
            onClick={() => { setPoints(PRESETS[name]); setAnimating(false); setActivePreset(name); }}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activePreset === name
                ? "bg-purple-600 border border-purple-400 text-white"
                : "bg-purple-900/50 border border-purple-500/30 text-purple-200 hover:bg-purple-800/50"
            }`}
          >
            {name}
          </button>
        ))}
        <button
          onClick={() => { setPoints([]); setAnimating(false); setStats({ maxSpeed: 0, maxHeight: 0, maxG: 0 }); setActivePreset(null); }}
          className="px-4 py-2 rounded-lg bg-red-900/30 border border-red-500/30 text-red-300 text-sm hover:bg-red-800/30 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="relative bg-gray-950 border border-purple-500/20 rounded-xl overflow-hidden">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleClick}
          className="w-full h-auto cursor-crosshair"
        />
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ["#f43f5e", "#fbbf24", "#22c55e", "#3b82f6", "#a855f7"][i % 5],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1.5 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center mt-6">
        <button
          onClick={launch}
          disabled={points.length < 2 || animating}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg hover:from-pink-400 hover:to-purple-400 disabled:opacity-40 transition-all shadow-lg shadow-pink-500/25"
        >
          {kidMode ? "🚀 LAUNCH!!!" : "Launch!"}
        </button>
        <button
          onClick={handleSave}
          disabled={points.length < 2}
          className="px-6 py-3 rounded-xl bg-gray-800 border border-purple-500/30 text-purple-200 font-medium hover:bg-gray-700 disabled:opacity-40 transition-colors"
        >
          {kidMode ? "💾 Save!" : "Save Design"}
        </button>
      </div>

      {/* Physics panel */}
      {(stats.maxSpeed > 0 || points.length > 1) && (
        <div className="mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto">
          {/* Speed */}
          <div className="text-center bg-gray-900/50 border border-purple-500/20 rounded-lg p-3">
            <div className="text-xs text-purple-400 uppercase tracking-wider">
              {kidMode ? "SPEED" : "Max Speed"}
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {kidMode ? (stats.maxSpeed > 50 ? "SUPER FAST! 🔥" : "Zippy! 💨") : `${stats.maxSpeed} mph`}
            </div>
          </div>

          {/* Height */}
          <div className="text-center bg-gray-900/50 border border-purple-500/20 rounded-lg p-3">
            <div className="text-xs text-purple-400 uppercase tracking-wider">
              {kidMode ? "HEIGHT" : "Max Height"}
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {kidMode ? (stats.maxHeight > 100 ? "SKY HIGH! 🚀" : "Pretty tall! ⬆️") : `${stats.maxHeight} ft`}
            </div>
          </div>

          {/* G-Force with warnings */}
          <div className={`text-center rounded-lg p-3 ${
            stats.maxG > 10
              ? "bg-red-900/50 border border-red-500/40"
              : stats.maxG > 5
              ? "bg-yellow-900/50 border border-yellow-500/30"
              : "bg-gray-900/50 border border-purple-500/20"
          }`}>
            <div className="text-xs text-purple-400 uppercase tracking-wider">
              {kidMode ? "G-FORCE" : "Est. G-Force"}
            </div>
            <div className={`text-lg font-bold mt-1 ${
              stats.maxG > 10 ? "text-red-300" : stats.maxG > 5 ? "text-yellow-300" : "text-white"
            }`}>
              {kidMode ? (
                stats.maxG > 10 ? "IMPOSSIBLE! 💀" : stats.maxG > 5 ? "WILD!! 🤯" : stats.maxG > 3 ? "Intense! 😬" : "Smooth! 😎"
              ) : (
                `${stats.maxG} G`
              )}
            </div>
            {!kidMode && stats.maxG > 5 && (
              <div className={`text-xs mt-1 ${stats.maxG > 10 ? "text-red-400" : "text-yellow-400"}`}>
                {stats.maxG > 10 ? "☠️ Not survivable!" : "⚠️ Intense!"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Physics Explainer */}
      {stats.maxSpeed > 0 && (
        <div className="mt-6 max-w-2xl mx-auto">
          <button
            onClick={() => setShowExplainer(!showExplainer)}
            className="w-full text-left px-4 py-3 bg-gray-900/50 border border-purple-500/20 rounded-lg text-purple-300 hover:bg-gray-800/50 transition-colors flex items-center justify-between"
          >
            <span className="text-sm font-medium">
              {kidMode ? "🧪 How does the math work?" : "How are these calculated?"}
            </span>
            <span className={`transform transition-transform ${showExplainer ? "rotate-180" : ""}`}>▼</span>
          </button>

          {showExplainer && (
            <div className="mt-2 p-4 bg-gray-900/70 border border-purple-500/20 rounded-lg text-sm text-purple-200 space-y-3">
              {kidMode ? (
                <>
                  <p><strong>Speed:</strong> When the coaster goes down a hill, it trades height for speed - like a ball rolling down a ramp! The bigger the drop, the faster you go.</p>
                  <p><strong>Height:</strong> This is just how tall your biggest hill is, measured from where you started.</p>
                  <p><strong>G-Force:</strong> This is how hard the ride pushes you into your seat. When you go around a tight curve really fast, you feel heavier - that&apos;s G-force! 1G is normal gravity, 2G means you feel twice as heavy.</p>
                </>
              ) : (
                <>
                  <p><strong>Speed</strong> uses conservation of energy. Potential energy converts to kinetic energy as the coaster descends:</p>
                  <p className="font-mono text-xs bg-gray-800 rounded px-2 py-1 inline-block">v = √(2gh)</p>
                  <p className="text-purple-300/80">where g = 9.81 m/s² and h = height drop in meters. We assume no friction.</p>

                  <p className="mt-3"><strong>Height</strong> is the pixel difference from start, converted to feet (0.5 px/m × 3.28 ft/m).</p>

                  <p className="mt-3"><strong>G-Force</strong> comes from centripetal acceleration when moving through a curve:</p>
                  <p className="font-mono text-xs bg-gray-800 rounded px-2 py-1 inline-block">G = v² / (r × g)</p>
                  <p className="text-purple-300/80">where r = radius of curvature, calculated from the track&apos;s second derivative. Tighter curves + higher speeds = more Gs.</p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
