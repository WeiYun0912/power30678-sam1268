import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../types/game";
import { useAudio } from "../hooks/useAudio";

// 動態載入素材
const ASSETS = [
    { id: "1", image: "/assets/images/22222.png", sound: "/assets/sounds/22222.mp3" },
    { id: "2", image: "/assets/images/獲得華.png", sound: "/assets/sounds/獲得華.mp3" },
    { id: "3", image: "/assets/images/MC.png", sound: "/assets/sounds/MC.mp3" },
    { id: "4", image: "/assets/images/RRRRRR.png", sound: "/assets/sounds/RRRRRR.mp3" },
    { id: "5", image: "/assets/images/超負荷挺toyz.png", sound: "/assets/sounds/超負荷挺toyz.mp3" },
    { id: "6", image: "/assets/images/溝通溝通.png", sound: "/assets/sounds/溝通溝通.mp3" },
];

interface MemoryGameProps {
    onComplete: () => void;
    onFail: () => void;
    maxFails?: number; // 最多可失敗次數，預設 3
}

// 失敗時隨機播放的影片
const FAIL_VIDEOS = ["/溝通溝通.mp4", "/哭蕊宿頭.mp4"];

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
                gap: 16,
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* Ambient glow */}
            <div
                style={{
                    position: "absolute",
                    top: "-10%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 600,
                    height: 400,
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
                    gap: 16,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 14px",
                        background: "rgba(245, 158, 11, 0.1)",
                        border: "1px solid rgba(245, 158, 11, 0.2)",
                        borderRadius: 9999,
                        fontSize: 13,
                        color: "#F59E0B",
                        fontWeight: 500,
                    }}
                >
                    第一關：記憶配對
                </div>

                {/* 剩餘機會 - 移到標題旁邊 */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 14px",
                        background: failCount >= maxFails - 1 ? "rgba(239, 68, 68, 0.15)" : "rgba(26, 26, 36, 0.6)",
                        border:
                            failCount >= maxFails - 1
                                ? "1px solid rgba(239, 68, 68, 0.3)"
                                : "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: 9999,
                        fontSize: 13,
                        transition: "all 300ms ease-out",
                    }}
                >
                    <span style={{ color: "#71717A" }}>剩餘機會</span>
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
                        gap: 8,
                        padding: "6px 14px",
                        background: "rgba(26, 26, 36, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: 9999,
                        fontSize: 13,
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
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 12,
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
                                width: 140,
                                height: 140,
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
                                    borderRadius: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 42,
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
                                    borderRadius: 12,
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
                                width: 280,
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
