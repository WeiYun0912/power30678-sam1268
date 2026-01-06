import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BASE = import.meta.env.BASE_URL

// 會隨機出現的影片
const GAME_VIDEOS = [`${BASE}哭蕊宿頭.mp4`, `${BASE}溝通溝通.mp4`, `${BASE}獲得華.mp4`, `${BASE}MC.mp4`];

// 邊界設定（響應式）
const getBoundaryMargin = () => (window.innerWidth < 600 ? 80 : 200);
const getVideoSize = () => (window.innerWidth < 600 ? 80 : 100);
const TARGET_SCORE = 35; // 過關分數

interface DraggableVideo {
    id: number;
    src: string;
    x: number;
    y: number;
    vx: number; // x 方向速度
    vy: number; // y 方向速度
}

interface DragGameProps {
    onComplete: () => void;
}

export function DragGame({ onComplete }: DragGameProps) {
    const [phase, setPhase] = useState<"intro" | "playing">("intro");
    const [score, setScore] = useState(0);
    const [videos, setVideos] = useState<DraggableVideo[]>([]);
    const [bonusUsed, setBonusUsed] = useState(false);
    const [showBonusEffect, setShowBonusEffect] = useState(false);
    const [showBonusVideo, setShowBonusVideo] = useState(false);
    const [draggingId, setDraggingId] = useState<number | null>(null); // 正在拖拉的影片 ID
    const introVideoRef = useRef<HTMLVideoElement>(null);
    const bonusVideoRef = useRef<HTMLVideoElement>(null);
    const animationRef = useRef<number>();
    const videoIdRef = useRef(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
    const [videoSize, setVideoSize] = useState(getVideoSize());

    // 邊界尺寸
    const [boundary, setBoundary] = useState({
        left: getBoundaryMargin(),
        top: getBoundaryMargin(),
        right: window.innerWidth - getBoundaryMargin(),
        bottom: window.innerHeight - getBoundaryMargin(),
    });

    // 更新邊界尺寸和響應式狀態
    useEffect(() => {
        const handleResize = () => {
            const margin = getBoundaryMargin();
            setIsMobile(window.innerWidth < 600);
            setVideoSize(getVideoSize());
            setBoundary({
                left: margin,
                top: margin,
                right: window.innerWidth - margin,
                bottom: window.innerHeight - margin,
            });
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 播放開場影片
    useEffect(() => {
        if (phase === "intro" && introVideoRef.current) {
            introVideoRef.current.volume = 0.3;
            introVideoRef.current.play().catch(() => {});

            const video = introVideoRef.current;
            const handleEnded = () => {
                // 影片播完直接開始遊戲
                setPhase("playing");
            };
            video.addEventListener("ended", handleEnded);
            return () => video.removeEventListener("ended", handleEnded);
        }
    }, [phase]);

    // 生成新影片（確保在邊界內）
    const spawnVideo = useCallback(() => {
        const id = videoIdRef.current++;
        const src = GAME_VIDEOS[Math.floor(Math.random() * GAME_VIDEOS.length)];

        // 計算可用區域（完全在邊界內）
        const padding = isMobile ? 15 : 30;
        const headerSpace = isMobile ? 80 : 100; // 標題空間
        const minX = boundary.left + padding;
        const maxX = boundary.right - videoSize - padding;
        const minY = boundary.top + headerSpace;
        const maxY = boundary.bottom - videoSize - padding;

        // 確保有足夠空間
        const rangeX = Math.max(1, maxX - minX);
        const rangeY = Math.max(1, maxY - minY);

        const x = minX + Math.random() * rangeX;
        const y = minY + Math.random() * rangeY;

        const speed = (isMobile ? 1.5 : 2) + Math.random() * 2;
        const angle = Math.random() * Math.PI * 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        return { id, src, x, y, vx, vy };
    }, [boundary, isMobile, videoSize]);

    // 遊戲開始時生成影片
    useEffect(() => {
        if (phase === "playing") {
            // 初始生成 6 個影片
            const initialVideos = Array.from({ length: 6 }, () => spawnVideo());
            setVideos(initialVideos);

            // 每 0.8 秒生成新影片（最多 12 個）
            const spawnInterval = setInterval(() => {
                setVideos((prev) => {
                    if (prev.length < 12) {
                        // 一次生成 1-3 個
                        const count = Math.random() > 0.6 ? 3 : Math.random() > 0.4 ? 2 : 1;
                        const newVideos = Array.from({ length: count }, () => spawnVideo());
                        return [...prev, ...newVideos].slice(0, 12);
                    }
                    return prev;
                });
            }, 800);

            return () => clearInterval(spawnInterval);
        }
    }, [phase, spawnVideo]);

    // 影片移動動畫
    useEffect(() => {
        if (phase !== "playing") return;

        const animate = () => {
            setVideos((prev) =>
                prev.map((video) => {
                    // 如果正在拖拉這個影片，不更新位置
                    if (video.id === draggingId) {
                        return video;
                    }

                    let { x, y, vx, vy } = video;

                    // 更新位置
                    x += vx;
                    y += vy;

                    // 邊界碰撞檢測（確保在邊界內反彈）
                    const padding = 20;
                    const minX = boundary.left + padding;
                    const maxX = boundary.right - videoSize - padding;
                    const minY = boundary.top + padding;
                    const maxY = boundary.bottom - videoSize - padding;

                    if (x <= minX || x >= maxX) {
                        vx = -vx;
                        x = Math.max(minX, Math.min(maxX, x));
                    }
                    if (y <= minY || y >= maxY) {
                        vy = -vy;
                        y = Math.max(minY, Math.min(maxY, y));
                    }

                    return { ...video, x, y, vx, vy };
                })
            );

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [phase, boundary, draggingId, videoSize]);

    // 檢查影片是否被拉出邊界（更精準的檢測）
    const checkOutOfBounds = useCallback(
        (id: number, x: number, y: number) => {
            // 用影片中心點來判斷是否超出邊界
            const centerX = x + videoSize / 2;
            const centerY = y + videoSize / 2;

            const isOutside =
                centerX < boundary.left ||
                centerX > boundary.right ||
                centerY < boundary.top ||
                centerY > boundary.bottom;

            if (isOutside) {
                // 移除影片並加分
                setVideos((prev) => prev.filter((v) => v.id !== id));
                setScore((prev) => {
                    const next = prev + 1;
                    if (next >= TARGET_SCORE) {
                        onComplete();
                    }
                    return next;
                });
            } else {
                // 沒有拉出邊界，更新影片位置以避免跳回原位
                setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, x, y } : v)));
            }
        },
        [boundary, onComplete, videoSize]
    );

    // 使用 BONUS 道具
    const useBonus = useCallback(() => {
        if (bonusUsed) return;
        setBonusUsed(true);

        // 顯示放大絕招效果和影片
        setShowBonusEffect(true);
        setShowBonusVideo(true);

        // 播放影片
        setTimeout(() => {
            if (bonusVideoRef.current) {
                bonusVideoRef.current.volume = 0.35;
                bonusVideoRef.current.play().catch(() => {});
            }
        }, 100);

        // 清除所有影片並加 10 分
        setTimeout(() => {
            setVideos([]);
            setScore((prev) => {
                const next = prev + 10;
                if (next >= TARGET_SCORE) {
                    setTimeout(() => onComplete(), 1000);
                }
                return next;
            });
        }, 300);

        // 隱藏效果
        setTimeout(() => {
            setShowBonusEffect(false);
        }, 1500);

        // 隱藏影片
        setTimeout(() => {
            setShowBonusVideo(false);
        }, 3000);
    }, [bonusUsed, onComplete]);

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                background: "#0A0A0F",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* 開場影片 */}
            <AnimatePresence>
                {phase === "intro" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 100,
                            background: "#0A0A0F",
                        }}
                    >
                        <video
                            ref={introVideoRef}
                            src={`${BASE}斗影片.mp4`}
                            style={{
                                maxWidth: "90%",
                                maxHeight: isMobile ? "70vh" : "90%",
                                borderRadius: isMobile ? 8 : 12,
                            }}
                            playsInline
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* BONUS 放大絕招效果 */}
            <AnimatePresence>
                {showBonusEffect && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 200,
                            pointerEvents: "none",
                            background: "rgba(0,0,0,0.5)",
                        }}
                    >
                        {/* 閃光背景 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: [0, 1, 0.5], scale: [0, 2, 3] }}
                            transition={{ duration: 0.8 }}
                            style={{
                                position: "absolute",
                                width: isMobile ? 250 : 400,
                                height: isMobile ? 250 : 400,
                                borderRadius: "50%",
                                background: "radial-gradient(circle, rgba(245, 158, 11, 0.8) 0%, transparent 70%)",
                            }}
                        />
                        {/* 文字效果 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            style={{
                                fontSize: isMobile ? 48 : 72,
                                fontWeight: 900,
                                color: "#F59E0B",
                                textShadow: "0 0 40px rgba(245, 158, 11, 0.8), 0 0 80px rgba(245, 158, 11, 0.5)",
                                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                            }}
                        >
                            BONUS!
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            style={{
                                fontSize: isMobile ? 24 : 32,
                                fontWeight: 700,
                                color: "#22C55E",
                                textShadow: "0 0 20px rgba(34, 197, 94, 0.6)",
                                marginTop: 10,
                            }}
                        >
                            +10 分！
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* BONUS 影片 - 置中顯示 */}
            <AnimatePresence>
                {showBonusVideo && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 250,
                            borderRadius: 16,
                            overflow: "hidden",
                            border: "4px solid #F59E0B",
                            boxShadow: "0 0 80px rgba(245, 158, 11, 0.6), 0 20px 60px rgba(0,0,0,0.8)",
                        }}
                    >
                        <video
                            ref={bonusVideoRef}
                            src={`${BASE}你拉一下啊.mp4`}
                            style={{
                                width: isMobile ? "min(90vw, 300px)" : 400,
                                height: "auto",
                                display: "block",
                            }}
                            playsInline
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 遊戲畫面 */}
            {phase === "playing" && (
                <>
                    {/* 邊界指示 */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            position: "absolute",
                            left: boundary.left,
                            top: boundary.top,
                            width: boundary.right - boundary.left,
                            height: boundary.bottom - boundary.top,
                            border: "3px dashed rgba(245, 158, 11, 0.5)",
                            borderRadius: 20,
                            pointerEvents: "none",
                            boxShadow: "inset 0 0 60px rgba(245, 158, 11, 0.1)",
                        }}
                    />

                    {/* 邊界外區域提示 */}
                    <div
                        style={{
                            position: "absolute",
                            top: isMobile ? 5 : 10,
                            left: "50%",
                            transform: "translateX(-50%)",
                            color: "#71717A",
                            fontSize: isMobile ? 11 : 14,
                            zIndex: 10,
                            whiteSpace: "nowrap",
                        }}
                    >
                        ↑ 把影片拉到這裡 ↑
                    </div>
                    <div
                        style={{
                            position: "absolute",
                            bottom: isMobile ? 5 : 10,
                            left: "50%",
                            transform: "translateX(-50%)",
                            color: "#71717A",
                            fontSize: isMobile ? 11 : 14,
                            zIndex: 10,
                            whiteSpace: "nowrap",
                        }}
                    >
                        ↓ 把影片拉到這裡 ↓
                    </div>

                    {/* Header */}
                    <div
                        style={{
                            position: "absolute",
                            top: boundary.top + (isMobile ? 5 : 10),
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: isMobile ? 4 : 8,
                            zIndex: 10,
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: isMobile ? 6 : 8,
                                padding: isMobile ? "4px 10px" : "6px 14px",
                                background: "rgba(245, 158, 11, 0.1)",
                                border: "1px solid rgba(245, 158, 11, 0.2)",
                                borderRadius: 9999,
                                fontSize: isMobile ? 11 : 13,
                                color: "#F59E0B",
                                fontWeight: 500,
                            }}
                        >
                            第三關
                        </motion.div>
                        {!isMobile && (
                            <motion.h2
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                style={{
                                    color: "#FAFAFA",
                                    fontSize: 24,
                                    fontWeight: 700,
                                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                                }}
                            >
                                拉影片挑戰
                            </motion.h2>
                        )}
                        <div style={{ color: "#71717A", fontSize: isMobile ? 12 : 14 }}>
                            分數：<span style={{ color: "#F59E0B", fontWeight: 700 }}>{score}</span> / {TARGET_SCORE}
                        </div>
                    </div>

                    {/* BONUS 按鈕 */}
                    {!bonusUsed && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 0 30px rgba(34, 197, 94, 0.4)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={useBonus}
                            style={{
                                position: "absolute",
                                bottom: boundary.bottom - (isMobile ? 40 : 60),
                                right: boundary.left + (isMobile ? 10 : 20),
                                padding: isMobile ? "8px 16px" : "12px 24px",
                                fontSize: isMobile ? 13 : 16,
                                fontWeight: 600,
                                color: "#0A0A0F",
                                background: "#22C55E",
                                border: "none",
                                borderRadius: isMobile ? 8 : 12,
                                cursor: "pointer",
                                boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)",
                                zIndex: 20,
                                whiteSpace: "nowrap",
                            }}
                        >
                            你拉.. 你怎麼不拉啊!!!
                        </motion.button>
                    )}

                    {/* 可拖拉的影片 */}
                    <AnimatePresence>
                        {videos.map((video) => (
                            <DraggableVideoItem
                                key={video.id}
                                video={video}
                                videoSize={videoSize}
                                onDragStart={() => setDraggingId(video.id)}
                                onDragEnd={(x, y) => {
                                    setDraggingId(null);
                                    checkOutOfBounds(video.id, x, y);
                                }}
                            />
                        ))}
                    </AnimatePresence>
                </>
            )}
        </div>
    );
}

// 可拖拉的影片組件
interface DraggableVideoItemProps {
    video: DraggableVideo;
    videoSize: number;
    onDragStart: () => void;
    onDragEnd: (x: number, y: number) => void;
}

function DraggableVideoItem({ video, videoSize, onDragStart, onDragEnd }: DraggableVideoItemProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const elementRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ mouseX: 0, mouseY: 0, elemX: 0, elemY: 0 });

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = 0.15; // 小聲播放
            videoRef.current.play().catch(() => {});
        }
    }, []);

    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        setIsDragging(true);
        onDragStart();
        // 記住拖拉開始時的位置
        dragStartRef.current = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            elemX: video.x,
            elemY: video.y,
        };
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || !elementRef.current) return;
        const dx = e.clientX - dragStartRef.current.mouseX;
        const dy = e.clientY - dragStartRef.current.mouseY;
        const newX = dragStartRef.current.elemX + dx;
        const newY = dragStartRef.current.elemY + dy;
        // 直接更新 DOM 位置
        elementRef.current.style.left = `${newX}px`;
        elementRef.current.style.top = `${newY}px`;
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStartRef.current.mouseX;
        const dy = e.clientY - dragStartRef.current.mouseY;
        const finalX = dragStartRef.current.elemX + dx;
        const finalY = dragStartRef.current.elemY + dy;
        setIsDragging(false);
        onDragEnd(finalX, finalY);
    };

    return (
        <motion.div
            ref={elementRef}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: isDragging ? 1.1 : 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
                position: "absolute",
                left: video.x,
                top: video.y,
                width: videoSize,
                height: videoSize,
                borderRadius: videoSize < 90 ? 8 : 12,
                overflow: "hidden",
                cursor: isDragging ? "grabbing" : "grab",
                border: isDragging ? "3px solid #F59E0B" : "1px solid rgba(255,255,255,0.1)",
                boxShadow: isDragging ? "0 0 40px rgba(245, 158, 11, 0.4)" : "0 10px 30px rgba(0,0,0,0.5)",
                zIndex: isDragging ? 50 : 10,
                touchAction: "none",
                userSelect: "none",
            }}
        >
            <video
                ref={videoRef}
                src={video.src}
                loop
                playsInline
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    pointerEvents: "none",
                }}
            />
        </motion.div>
    );
}
