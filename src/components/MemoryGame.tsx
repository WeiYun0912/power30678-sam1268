import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../types/game";
import { useAudio } from "../hooks/useAudio";

const BASE = import.meta.env.BASE_URL;

// 動態載入素材
const ASSETS = [
    { id: "1", image: `${BASE}assets/images/22222.png`, sound: `${BASE}assets/sounds/22222.mp3` },
    { id: "2", image: `${BASE}assets/images/獲得華.png`, sound: `${BASE}assets/sounds/獲得華.mp3` },
    { id: "3", image: `${BASE}assets/images/MC.png`, sound: `${BASE}assets/sounds/MC.mp3` },
    { id: "4", image: `${BASE}assets/images/RRRRRR.png`, sound: `${BASE}assets/sounds/RRRRRR.mp3` },
    { id: "5", image: `${BASE}assets/images/超負荷挺toyz.png`, sound: `${BASE}assets/sounds/超負荷挺toyz.mp3` },
    { id: "6", image: `${BASE}assets/images/溝通溝通.png`, sound: `${BASE}assets/sounds/溝通溝通.mp3` },
];

// 計算響應式卡片大小
function useCardSize() {
    const [size, setSize] = useState({ cardSize: 140, gap: 12, columns: 4 });

    useEffect(() => {
        const updateSize = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            // 手機直式
            if (vw < 500) {
                const cardSize = Math.min(Math.floor((vw - 60) / 3), 100);
                setSize({ cardSize, gap: 8, columns: 3 });
            }
            // 手機橫式或小平板
            else if (vw < 768) {
                const cardSize = Math.min(Math.floor((vw - 80) / 4), 110);
                setSize({ cardSize, gap: 10, columns: 4 });
            }
            // 平板或小螢幕
            else if (vw < 1024) {
                const cardSize = Math.min(Math.floor((Math.min(vw, vh) - 100) / 4), 130);
                setSize({ cardSize, gap: 12, columns: 4 });
            }
            // 桌面
            else {
                setSize({ cardSize: 140, gap: 12, columns: 4 });
            }
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return size;
}

interface MemoryGameProps {
    onComplete: () => void;
    onFail: () => void;
    maxFails?: number; // 最多可失敗次數，預設 3
}

// 失敗時隨機播放的影片
const FAIL_VIDEOS = [`${BASE}溝通溝通.mp4`, `${BASE}哭蕊宿頭.mp4`];

export function MemoryGame({ onComplete, onFail, maxFails = 3 }: MemoryGameProps) {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [isChecking, setIsChecking] = useState(false);
    const [matchedCount, setMatchedCount] = useState(0);
    const [failCount, setFailCount] = useState(0); // 失敗次數
    const [showFailVideo, setShowFailVideo] = useState(false);
    const [failVideoSrc, setFailVideoSrc] = useState("");
    const [failVideoKey, setFailVideoKey] = useState(0); // 用來強制重新渲染影片
    const failVideoRef = useRef<HTMLVideoElement>(null);
    const { play } = useAudio();
    const { cardSize, gap, columns } = useCardSize();
    const isMobile = window.innerWidth < 500;

    // 初始化卡片
    useEffect(() => {
        const cardPairs: Card[] = [];
        let id = 0;

        ASSETS.forEach((asset) => {
            // 每張圖片兩張
            for (let i = 0; i < 2; i++) {
                cardPairs.push({
                    id: id++,
                    imageId: asset.id,
                    imageSrc: asset.image,
                    soundSrc: asset.sound,
                    isFlipped: false,
                    isMatched: false,
                });
            }
        });

        // 洗牌
        for (let i = cardPairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
        }

        setCards(cardPairs);
    }, []);

    // 檢查配對
    useEffect(() => {
        if (flippedCards.length === 2 && !isChecking) {
            setIsChecking(true);
            const [first, second] = flippedCards;
            const firstCard = cards.find((c) => c.id === first);
            const secondCard = cards.find((c) => c.id === second);

            if (firstCard && secondCard && firstCard.imageId === secondCard.imageId) {
                // 配對成功
                setTimeout(() => {
                    setCards((prev) =>
                        prev.map((card) =>
                            card.id === first || card.id === second ? { ...card, isMatched: true } : card
                        )
                    );
                    setMatchedCount((prev) => prev + 1);
                    setFlippedCards([]);
                    setIsChecking(false);
                }, 800);
            } else {
                // 配對失敗 - 使用函數形式更新 failCount，避免依賴 failCount 狀態
                setFailCount((prevFailCount) => {
                    const newFailCount = prevFailCount + 1;

                    // 檢查是否超過失敗次數
                    if (newFailCount >= maxFails) {
                        // 遊戲失敗
                        setTimeout(() => {
                            onFail();
                        }, 800);
                    } else {
                        // 顯示飛出的影片（隨機選擇）
                        const randomVideo = FAIL_VIDEOS[Math.floor(Math.random() * FAIL_VIDEOS.length)];
                        setFailVideoSrc(randomVideo);
                        setFailVideoKey((prev) => prev + 1); // 強制重新渲染
                        setTimeout(() => {
                            setShowFailVideo(true);
                        }, 300);
                    }

                    return newFailCount;
                });

                // 翻回卡片並隱藏影片 - 減少延遲時間
                setTimeout(() => {
                    setCards((prev) =>
                        prev.map((card) =>
                            card.id === first || card.id === second ? { ...card, isFlipped: false } : card
                        )
                    );
                    setFlippedCards([]);
                    setIsChecking(false);
                    setShowFailVideo(false);
                }, 1500);
            }
        }
    }, [flippedCards, cards, isChecking, maxFails, onFail]);

    // 檢查是否完成
    useEffect(() => {
        if (matchedCount === ASSETS.length && matchedCount > 0) {
            setTimeout(() => {
                onComplete();
            }, 1000);
        }
    }, [matchedCount, onComplete]);

    const handleCardClick = useCallback(
        (card: Card) => {
            if (isChecking || card.isFlipped || card.isMatched || flippedCards.length >= 2) {
                return;
            }

            // 播放音效
            play(card.soundSrc);

            // 翻開卡片
            setCards((prev) => prev.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c)));
            setFlippedCards((prev) => [...prev, card.id]);
        },
        [isChecking, flippedCards, play]
    );

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
                gap: "clamp(8px, 2vh, 16px)",
                overflow: "hidden",
                position: "relative",
                padding: "10px",
                boxSizing: "border-box",
            }}
        >
            {/* Ambient glow */}
            <div
                style={{
                    position: "absolute",
                    top: "-10%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "min(600px, 100vw)",
                    height: "min(400px, 60vh)",
                    background: "radial-gradient(ellipse, rgba(245, 158, 11, 0.06) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            {/* Header row - badge + 剩餘機會 */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "clamp(6px, 2vw, 16px)",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    padding: "0 10px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: isMobile ? "4px 10px" : "6px 14px",
                        background: "rgba(245, 158, 11, 0.1)",
                        border: "1px solid rgba(245, 158, 11, 0.2)",
                        borderRadius: 9999,
                        fontSize: "clamp(10px, 2.5vw, 13px)",
                        color: "#F59E0B",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                    }}
                >
                    {isMobile ? "第一關" : "第一關：記憶配對"}
                </div>

                {/* 剩餘機會 */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: isMobile ? "4px 10px" : "6px 14px",
                        background: failCount >= maxFails - 1 ? "rgba(239, 68, 68, 0.15)" : "rgba(26, 26, 36, 0.6)",
                        border:
                            failCount >= maxFails - 1
                                ? "1px solid rgba(239, 68, 68, 0.3)"
                                : "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: 9999,
                        fontSize: "clamp(10px, 2.5vw, 13px)",
                        transition: "all 300ms ease-out",
                        whiteSpace: "nowrap",
                    }}
                >
                    <span style={{ color: "#71717A" }}>{isMobile ? "機會" : "剩餘機會"}</span>
                    <span
                        style={{
                            color: failCount >= maxFails - 1 ? "#EF4444" : "#22C55E",
                            fontWeight: 600,
                        }}
                    >
                        {maxFails - failCount}
                    </span>
                </div>

                {/* 配對進度 */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: isMobile ? "4px 10px" : "6px 14px",
                        background: "rgba(26, 26, 36, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: 9999,
                        fontSize: "clamp(10px, 2.5vw, 13px)",
                        whiteSpace: "nowrap",
                    }}
                >
                    <span style={{ color: "#71717A" }}>配對</span>
                    <span style={{ color: "#F59E0B", fontWeight: 600 }}>
                        {matchedCount}/{ASSETS.length}
                    </span>
                </div>
            </motion.div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap: gap,
                    padding: 10,
                }}
            >
                <AnimatePresence>
                    {cards.map((card) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: card.isMatched ? 0.3 : 1,
                                scale: 1,
                                rotateY: card.isFlipped || card.isMatched ? 180 : 0,
                            }}
                            whileHover={!card.isFlipped && !card.isMatched ? { scale: 1.05 } : {}}
                            whileTap={!card.isFlipped && !card.isMatched ? { scale: 0.95 } : {}}
                            onClick={() => handleCardClick(card)}
                            style={{
                                width: cardSize,
                                height: cardSize,
                                cursor: card.isFlipped || card.isMatched ? "default" : "pointer",
                                perspective: 1000,
                                transformStyle: "preserve-3d",
                            }}
                        >
                            {/* 卡片背面 - Glass effect */}
                            <div
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    backfaceVisibility: "hidden",
                                    background: "rgba(26, 26, 36, 0.8)",
                                    backdropFilter: "blur(8px)",
                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                    borderRadius: "clamp(8px, 2vw, 12px)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "clamp(24px, 6vw, 42px)",
                                    color: "#F59E0B",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                                }}
                            >
                                ?
                            </div>

                            {/* 卡片正面 */}
                            <div
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    backfaceVisibility: "hidden",
                                    transform: "rotateY(180deg)",
                                    background: "#1A1A24",
                                    border: "1px solid rgba(245, 158, 11, 0.2)",
                                    borderRadius: "clamp(8px, 2vw, 12px)",
                                    overflow: "hidden",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.3), 0 0 20px rgba(245, 158, 11, 0.1)",
                                }}
                            >
                                <img
                                    src={card.imageSrc}
                                    alt={card.imageId}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* 配對失敗時飛出的影片 */}
            <AnimatePresence mode="wait">
                {showFailVideo && (
                    <motion.div
                        key={failVideoKey}
                        initial={{ y: "100vh", x: "-50%" }}
                        animate={{ y: "-100vh" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 4, ease: "linear" }}
                        style={{
                            position: "fixed",
                            left: "50%",
                            bottom: 0,
                            zIndex: 100,
                            borderRadius: 12,
                            overflow: "hidden",
                            border: "1px solid rgba(245, 158, 11, 0.3)",
                            boxShadow: "0 0 60px rgba(245, 158, 11, 0.3), 0 20px 40px rgba(0,0,0,0.5)",
                        }}
                    >
                        <video
                            key={failVideoKey}
                            ref={failVideoRef}
                            src={failVideoSrc}
                            autoPlay
                            muted={false}
                            onLoadedMetadata={(e) => {
                                (e.target as HTMLVideoElement).volume = 0.3;
                            }}
                            style={{
                                width: "clamp(180px, 40vw, 280px)",
                                height: "auto",
                            }}
                            playsInline
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
