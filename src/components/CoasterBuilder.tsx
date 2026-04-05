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
    { x: 50, y: 350 }, { x: 150, y: 80 }, { x: 280, y: 280 }, { x: 400, y: 120 },
    { x: 520, y: 260 }, { x: 640, y: 140 }, { x: 750, y: 300 }, { x: 820, y: 350 },
  ],
  "Loop-de-Loop": [
    { x: 50, y: 350 }, { x: 150, y: 100 }, { x: 280, y: 280 }, { x: 380, y: 150 },
    { x: 480, y: 250 }, { x: 580, y: 120 }, { x: 700, y: 300 }, { x: 800, y: 350 },
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

// Calculate G-force using vertical acceleration model
// This measures how much the track pushes you up/down as you follow the curve
function calculateGForce(points: Point[], i: number, startY: number, windowSize: number = 100): number {
  const half = Math.floor(windowSize / 2);
  if (i < half || i >= points.length - half) return 1; // baseline 1G

  const prev = points[i - half];
  const curr = points[i];
  const next = points[i + half];

  // Get speed at this point (m/s)
  const speedMs = Math.sqrt(2 * GRAVITY * Math.max(0, startY - curr.y) * PIXELS_TO_METERS);
  if (speedMs < 1) return 1; // Too slow to matter

  // Calculate track slope before and after this point
  const dx1 = curr.x - prev.x;
  const dy1 = curr.y - prev.y;
  const dx2 = next.x - curr.x;
  const dy2 = next.y - curr.y;

  const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
  const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

  if (len1 < 1 || len2 < 1) return 1;

  // Slope (dy/dx) before and after - note: canvas Y is inverted (down is positive)
  const slope1 = dy1 / dx1;
  const slope2 = dy2 / dx2;

  // Change in slope indicates vertical curvature
  // Positive slope change = concave up (valley) = positive Gs
  // Negative slope change = concave down (hilltop) = reduced Gs / airtime
  const slopeChange = slope2 - slope1;

  // Distance traveled (in meters) over which this change occurs
  const arcLengthPixels = (len1 + len2) / 2;
  const arcLengthMeters = arcLengthPixels * PIXELS_TO_METERS;

  // Time to travel this arc at current speed
  const dt = arcLengthMeters / speedMs;

  // Vertical acceleration estimate: how fast the vertical velocity changes
  // Using the slope change and horizontal speed component
  const horizontalSpeed = speedMs / Math.sqrt(1 + slope1 * slope1); // approximate
  const verticalAccel = (slopeChange * horizontalSpeed) / dt;

  // G-force: 1G baseline + vertical acceleration component
  // Negative because canvas Y is inverted (going "up" in canvas is negative Y)
  const gForce = 1 - (verticalAccel / GRAVITY);

  // Clamp to minimum 0, but allow high values for crazy custom designs
  return Math.max(0, gForce);
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
    ctx.strokeStyle = "rgba(245, 158, 11, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvasWidth; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvasHeight); ctx.stroke();
    }
    for (let y = 0; y < canvasHeight; y += 50) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvasWidth, y); ctx.stroke();
    }

    // Ground
    ctx.fillStyle = "rgba(245, 158, 11, 0.05)";
    ctx.fillRect(0, canvasHeight - 30, canvasWidth, 30);
    ctx.strokeStyle = "rgba(245, 158, 11, 0.3)";
    ctx.beginPath(); ctx.moveTo(0, canvasHeight - 30); ctx.lineTo(canvasWidth, canvasHeight - 30); ctx.stroke();

    if (curvePoints.length > 1) {
      // Supports
      ctx.strokeStyle = "rgba(245, 158, 11, 0.15)";
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
        // Gold (245, 158, 11) to Red (220, 38, 38) as speed increases
        const r = Math.round(245 - ratio * 25);
        const g = Math.round(158 - ratio * 120);
        const b = Math.round(11 + ratio * 27);
        ctx.strokeStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath();
        ctx.moveTo(curvePoints[i - 1].x, curvePoints[i - 1].y);
        ctx.lineTo(curvePoints[i].x, curvePoints[i].y);
        ctx.stroke();
      }

      // Neon glow
      ctx.save();
      ctx.strokeStyle = "rgba(245, 158, 11, 0.2)";
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
    let maxSpd = 0, maxH = 0;
    const gForces: number[] = [];

    for (let i = 1; i < curvePoints.length; i++) {
      const s = speedAtPoint(startY, curvePoints[i].y);
      const h = (startY - curvePoints[i].y) * PIXELS_TO_METERS * 3.28; // to feet
      if (s > maxSpd) maxSpd = s;
      if (h > maxH) maxH = h;

      // G-force from vertical acceleration through the curve
      const windowSize = 100; // Large window smooths presets, but extreme custom V-shapes can still hit high Gs
      const half = Math.floor(windowSize / 2);
      if (i >= half && i < curvePoints.length - half) {
        const g = calculateGForce(curvePoints, i, startY, windowSize);
        if (isFinite(g)) {
          gForces.push(g);
        }
      }
    }

    // Take maximum G-force (already clamped to reasonable range in calculateGForce)
    const maxG = gForces.length > 0 ? Math.max(...gForces) : 1;

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
      <h2 className="text-4xl md:text-5xl font-black text-center mb-4 bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
        {kidMode ? "🎨 Build Your Own Coaster!" : "Coaster Builder"}
      </h2>
      <p className="text-center text-amber-300 mb-8">
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
                ? "bg-red-600 border border-amber-400 text-white"
                : "bg-red-900/50 border border-red-500/30 text-amber-200 hover:bg-red-800/50"
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
      <div ref={containerRef} className="relative bg-gray-950 border border-red-500/20 rounded-xl overflow-hidden">
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
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg hover:from-yellow-400 hover:to-amber-400 disabled:opacity-40 transition-all shadow-lg shadow-orange-500/25"
        >
          {kidMode ? "🚀 LAUNCH!!!" : "Launch!"}
        </button>
        <button
          onClick={handleSave}
          disabled={points.length < 2}
          className="px-6 py-3 rounded-xl bg-gray-800 border border-red-500/30 text-amber-200 font-medium hover:bg-gray-700 disabled:opacity-40 transition-colors"
        >
          {kidMode ? "💾 Save!" : "Save Design"}
        </button>
      </div>

      {/* Physics panel */}
      {(stats.maxSpeed > 0 || points.length > 1) && (
        <div className="mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto">
          {/* Speed */}
          <div className="text-center bg-gray-900/50 border border-red-500/20 rounded-lg p-3">
            <div className="text-xs text-amber-400 uppercase tracking-wider">
              {kidMode ? "SPEED" : "Max Speed"}
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {kidMode ? (stats.maxSpeed > 50 ? "SUPER FAST! 🔥" : "Zippy! 💨") : `${stats.maxSpeed} mph`}
            </div>
          </div>

          {/* Height */}
          <div className="text-center bg-gray-900/50 border border-red-500/20 rounded-lg p-3">
            <div className="text-xs text-amber-400 uppercase tracking-wider">
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
              : "bg-gray-900/50 border border-red-500/20"
          }`}>
            <div className="text-xs text-amber-400 uppercase tracking-wider">
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
            className="w-full text-left px-4 py-3 bg-gray-900/50 border border-red-500/20 rounded-lg text-amber-300 hover:bg-gray-800/50 transition-colors flex items-center justify-between"
          >
            <span className="text-sm font-medium">
              {kidMode ? "🧪 How does the math work?" : "How are these calculated?"}
            </span>
            <span className={`transform transition-transform ${showExplainer ? "rotate-180" : ""}`}>▼</span>
          </button>

          {showExplainer && (
            <div className="mt-2 p-4 bg-gray-900/70 border border-red-500/20 rounded-lg text-sm text-amber-200 space-y-3">
              {kidMode ? (
                <>
                  <p><strong>Speed:</strong> Roller coasters don&apos;t have engines! After the first big hill, gravity does all the work. When you go down, you speed up. When you go up, you slow down. It&apos;s like sledding - the taller the hill, the faster you go!</p>
                  <p><strong>Height:</strong> This is how tall your biggest drop is. Real coasters like Kingda Ka are over 450 feet tall - that&apos;s taller than the Statue of Liberty!</p>
                  <p><strong>G-Force:</strong> Ever feel heavy on a fast elevator? Or light on a swing? That&apos;s G-force! At 1G you feel normal. At 2G you feel twice as heavy. Astronauts train at 3-4G. Above 6G, most people pass out!</p>
                </>
              ) : (
                <>
                  <p><strong>Speed:</strong> Coaster engineers use conservation of energy - the same principle that governs falling objects. At the top of a hill, you have potential energy. As you descend, that converts to kinetic energy (speed). A 200-foot drop produces about 75 mph, assuming minimal friction. That&apos;s why the first hill is always the tallest - you can never go higher than where you started without adding energy.</p>

                  <p className="mt-3"><strong>Height:</strong> The first drop height determines everything. Engineers call this the &quot;lift hill&quot; - it&apos;s essentially storing energy for the entire ride. Every subsequent hill must be shorter, or the train won&apos;t make it over.</p>

                  <p className="mt-3"><strong>G-Force:</strong> When you go through a valley, your body wants to keep going straight (Newton&apos;s first law), but the track pushes you upward. You feel this as extra weight - that&apos;s positive G-force. Engineers must balance thrill vs. safety: 3-4G is exciting, 5-6G is extreme, and sustained forces above 6G can cause blackouts. The tighter the curve and the faster you&apos;re going, the higher the G-force.</p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
