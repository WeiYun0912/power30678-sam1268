import { motion } from "framer-motion";
import { useRef, useEffect } from "react";

interface GameOverProps {
    onRestart: () => void;
    nextChances?: number; // 下次重試時的機會次數
}

export function GameOver({ onRestart, nextChances }: GameOverProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    }, []);

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
            {/* 背景影片 - 無限循環 */}
            <video
                ref={videoRef}
                src="/太LOW了.mp4"
                autoPlay
                loop
                playsInline
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.6,
                }}
            />

            {/* 覆蓋層 */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.8) 100%)",
                }}
            />

            {/* 內容 */}
            <div
                style={{
                    position: "relative",
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 24,
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 20px",
                        background: "rgba(239, 68, 68, 0.15)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        borderRadius: 9999,
                        fontSize: 14,
                        color: "#EF4444",
                        fontWeight: 500,
                    }}
                >
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#EF4444",
                            boxShadow: "0 0 10px rgba(239, 68, 68, 0.5)",
                        }}
                    />
                    挑戰失敗
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        color: "#FAFAFA",
                        fontSize: 56,
                        fontWeight: 700,
                        fontFamily: '"Space Grotesk", system-ui, sans-serif',
                        letterSpacing: "-0.025em",
                        textShadow: "0 0 40px rgba(0,0,0,0.8)",
                    }}
                >
                    太 LOW 了！
                </motion.h1>

                {nextChances && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{
                            color: "#D4D4D8",
                            fontSize: 18,
                            textAlign: "center",
                            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                        }}
                    >
                        下次挑戰你有 <span style={{ color: "#F59E0B", fontWeight: 700 }}>{nextChances}</span> 次機會！
                    </motion.p>
                )}

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{
                        filter: "brightness(1.1)",
                        boxShadow: "0 0 30px rgba(245, 158, 11, 0.4)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onRestart}
                    style={{
                        marginTop: 20,
                        padding: "16px 48px",
                        fontSize: 18,
                        fontWeight: 600,
                        color: "#0A0A0F",
                        background: "#F59E0B",
                        border: "none",
                        borderRadius: 12,
                        cursor: "pointer",
                        boxShadow: "0 0 20px rgba(245, 158, 11, 0.2)",
                        transition: "all 200ms ease-out",
                    }}
                >
                    再試一次
                </motion.button>
            </div>

            {/* Footer */}
            <motion.a
                href="https://www.instagram.com/naked_logic"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                style={{
                    position: "absolute",
                    bottom: 20,
                    color: "yellow",
                    fontSize: 12,
                    textDecoration: "none",
                    transition: "color 200ms ease-out",
                }}
                whileHover={{ color: "#F59E0B" }}
            >
                made by @naked_logic
            </motion.a>
        </div>
    );
}
