import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BASE = import.meta.env.BASE_URL;

// 可以打的影片（打了 +1 分）
const TARGET_VIDEOS = [`${BASE}哭蕊宿頭.mp4`, `${BASE}溝通溝通.mp4`];

// 不能打的影片（打了 -1 分）
const DECOY_VIDEOS = [`${BASE}獲得華.mp4`, `${BASE}MC.mp4`, `${BASE}獲得華.mp4`, `${BASE}太LOW了.mp4`];

// 所有可能出現的影片
// const ALL_VIDEOS = [...TARGET_VIDEOS, ...DECOY_VIDEOS];

const TARGET_SCORE = 20;

// 9 個洞的位置（3x3 網格，中間是圖片）
const HOLES = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const CENTER_HOLE = 4; // 中間的洞放圖片

interface Mole {
    id: number;
    holeIndex: number;
    videoSrc: string;
    isTarget: boolean; // 是否為可打的目標
    isHit: boolean;
    showTime: number; // 出現時間（ms）
}

interface WhackMoleGameProps {
    onComplete: () => void;
}

export function WhackMoleGame({ onComplete }: WhackMoleGameProps) {
    const { volume } = useVolume();
    const [score, setScore] = useState(0);
    const [moles, setMoles] = useState<Mole[]>([]);
    const [hitEffects, setHitEffects] = useState<{ id: number; x: number; y: number; isCorrect: boolean }[]>([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
    const moleIdRef = useRef(0);
    const effectIdRef = useRef(0);
    const holeRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 600);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 生成新地鼠
    const spawnMole = useCallback(() => {
        setMoles((prev) => {
            // 找出目前沒有地鼠的洞（排除中間）
            const occupiedHoles = prev.map((m) => m.holeIndex);
            const availableHoles = HOLES.filter((h) => h !== CENTER_HOLE && !occupiedHoles.includes(h));

            if (availableHoles.length === 0) return prev;

            const holeIndex = availableHoles[Math.floor(Math.random() * availableHoles.length)];

            // 45% 機率出現可打的目標，55% 機率出現陷阱（更難）
            const isTarget = Math.random() < 0.45;
            const videoPool = isTarget ? TARGET_VIDEOS : DECOY_VIDEOS;
            const videoSrc = videoPool[Math.floor(Math.random() * videoPool.length)];

            const newMole: Mole = {
                id: moleIdRef.current++,
                holeIndex,
                videoSrc,
                isTarget,
                isHit: false,
                showTime: 1800 + Math.random() * 1000, // 1.8-2.8 秒後消失（更快）
            };

            // 設定自動消失
            setTimeout(() => {
                setMoles((current) => current.filter((m) => m.id !== newMole.id));
            }, newMole.showTime);

            return [...prev, newMole];
        });
    }, []);

    // 定時生成地鼠
    useEffect(() => {
        const spawnInterval = setInterval(() => {
            spawnMole();
        }, 700); // 更快生成

        // 初始生成幾隻
        setTimeout(() => spawnMole(), 300);
        setTimeout(() => spawnMole(), 600);
        setTimeout(() => spawnMole(), 900);

        return () => clearInterval(spawnInterval);
    }, [spawnMole]);

    // 打館長
    const handleWhack = useCallback(
        (mole: Mole, e: React.MouseEvent | React.TouchEvent) => {
            if (mole.isHit) return;

            // 取得點擊位置
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            // 標記為已打
            setMoles((prev) => prev.map((m) => (m.id === mole.id ? { ...m, isHit: true } : m)));

            if (mole.isTarget) {
                // 打對了 +1 分
                setScore((prev) => {
                    const next = prev + 1;
                    if (next >= TARGET_SCORE) {
                        setTimeout(() => onComplete(), 500);
                    }
                    return next;
                });
                setHitEffects((prev) => [...prev, { id: effectIdRef.current++, x, y, isCorrect: true }]);
            } else {
                // 打錯了 -1 分
                setScore((prev) => Math.max(0, prev - 1));
                setHitEffects((prev) => [...prev, { id: effectIdRef.current++, x, y, isCorrect: false }]);
            }

            // 移除地鼠
            setTimeout(() => {
                setMoles((prev) => prev.filter((m) => m.id !== mole.id));
            }, 200);

            // 移除特效
            setTimeout(() => {
                setHitEffects((prev) => prev.slice(1));
            }, 800);
        },
        [onComplete]
    );

    const holeSize = isMobile ? 90 : 120;
    const gap = isMobile ? 12 : 20;

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#0A0A0F",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Ambient glow */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "min(800px, 100vw)",
                    height: "min(600px, 80vh)",
                    background: "radial-gradient(ellipse, rgba(245, 158, 11, 0.04) 0%, transparent 60%)",
                    pointerEvents: "none",
                }}
            />

            {/* Header */}
            <div
                style={{
                    position: "absolute",
                    top: isMobile ? 10 : 24,
                    display: "flex",
                    flexDirection: isMobile ? "row" : "column",
                    alignItems: "center",
                    gap: isMobile ? 12 : 8,
                    zIndex: 10,
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: isMobile ? "4px 10px" : "6px 14px",
                        background: "rgba(245, 158, 11, 0.1)",
                        border: "1px solid rgba(245, 158, 11, 0.2)",
                        borderRadius: 9999,
                        fontSize: "clamp(11px, 2.5vw, 13px)",
                        color: "#F59E0B",
                        fontWeight: 500,
                    }}
                >
                    第四關
                </motion.div>
                {!isMobile && (
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{
                            color: "#FAFAFA",
                            fontSize: "clamp(18px, 5vw, 28px)",
                            fontWeight: 700,
                            fontFamily: '"Space Grotesk", system-ui, sans-serif',
                            letterSpacing: "-0.025em",
                            margin: 0,
                        }}
                    >
                        打館長
                    </motion.h2>
                )}
                <div style={{ color: "#D4D4D8", fontSize: "clamp(12px, 3vw, 14px)" }}>
                    分數：<span style={{ color: "#F59E0B", fontWeight: 700 }}>{score}</span> / {TARGET_SCORE}
                </div>
            </div>

            {/* 地鼠洞網格 */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(3, ${holeSize}px)`,
                    gap: gap,
                    marginTop: isMobile ? 60 : 80,
                }}
            >
                {HOLES.map((holeIndex) => {
                    const mole = moles.find((m) => m.holeIndex === holeIndex);
                    const isCenter = holeIndex === CENTER_HOLE;

                    return (
                        <div
                            key={holeIndex}
                            ref={(el) => (holeRefs.current[holeIndex] = el)}
                            style={{
                                width: holeSize,
                                height: holeSize,
                                borderRadius: "50%",
                                background: isCenter
                                    ? "transparent"
                                    : "radial-gradient(ellipse at center, #1a1a24 0%, #0f0f15 100%)",
                                border: isCenter ? "none" : "3px solid rgba(245, 158, 11, 0.2)",
                                position: "relative",
                                overflow: "hidden",
                                boxShadow: isCenter ? "none" : "inset 0 10px 30px rgba(0,0,0,0.8)",
                            }}
                        >
                            {isCenter ? (
                                // 中間放圖片
                                <img
                                    src={`${BASE}assets/images/500斤.jpg`}
                                    alt="500斤"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: "50%",
                                        border: "3px solid rgba(245, 158, 11, 0.3)",
                                    }}
                                />
                            ) : (
                                // 地鼠洞
                                <AnimatePresence>
                                    {mole && !mole.isHit && (
                                        <motion.div
                                            initial={{ y: "100%" }}
                                            animate={{ y: "0%" }}
                                            exit={{ y: "100%", opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            onClick={(e) => handleWhack(mole, e)}
                                            onTouchEnd={(e) => {
                                                e.preventDefault();
                                                handleWhack(mole, e);
                                            }}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                cursor: "pointer",
                                                borderRadius: "50%",
                                                overflow: "hidden",
                                                border: mole.isTarget
                                                    ? "3px solid rgba(34, 197, 94, 0.5)"
                                                    : "3px solid rgba(239, 68, 68, 0.3)",
                                                boxShadow: mole.isTarget
                                                    ? "0 0 20px rgba(34, 197, 94, 0.3)"
                                                    : "0 0 20px rgba(239, 68, 68, 0.2)",
                                            }}
                                        >
                                            <video
                                                src={mole.videoSrc}
                                                autoPlay
                                                loop
                                                playsInline
                                                onLoadedMetadata={(e) => {
                                                    (e.target as HTMLVideoElement).volume = volume;
                                                }}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    pointerEvents: "none",
                                                }}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* 打擊特效 */}
            <AnimatePresence>
                {hitEffects.map((effect) => (
                    <motion.div
                        key={effect.id}
                        initial={{ opacity: 1, scale: 0.5, y: 0 }}
                        animate={{ opacity: 0, scale: 1.5, y: -50 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: "fixed",
                            left: effect.x,
                            top: effect.y,
                            transform: "translate(-50%, -50%)",
                            fontSize: isMobile ? 32 : 48,
                            fontWeight: 900,
                            color: effect.isCorrect ? "#22C55E" : "#EF4444",
                            textShadow: effect.isCorrect
                                ? "0 0 20px rgba(34, 197, 94, 0.8)"
                                : "0 0 20px rgba(239, 68, 68, 0.8)",
                            pointerEvents: "none",
                            zIndex: 100,
                        }}
                    >
                        {effect.isCorrect ? "+1" : "-1"}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
