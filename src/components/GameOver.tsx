import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const BASE = import.meta.env.BASE_URL

interface GameOverProps {
    onRestart: () => void;
    nextChances?: number; // 下次重試時的機會次數
}

export function GameOver({ onRestart, nextChances }: GameOverProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 600);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
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
                src={`${BASE}太LOW了.mp4`}
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
                    gap: isMobile ? 16 : 24,
                    padding: "0 15px",
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: isMobile ? 6 : 8,
                        padding: isMobile ? "6px 16px" : "8px 20px",
                        background: "rgba(239, 68, 68, 0.15)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        borderRadius: 9999,
                        fontSize: isMobile ? 12 : 14,
                        color: "#EF4444",
                        fontWeight: 500,
                    }}
                >
                    <span
                        style={{
                            width: isMobile ? 6 : 8,
                            height: isMobile ? 6 : 8,
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
                        fontSize: isMobile ? "clamp(32px, 10vw, 48px)" : 56,
                        fontWeight: 700,
                        fontFamily: '"Space Grotesk", system-ui, sans-serif',
                        letterSpacing: "-0.025em",
                        textShadow: "0 0 40px rgba(0,0,0,0.8)",
                        textAlign: "center",
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
                            fontSize: isMobile ? 14 : 18,
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
                        marginTop: isMobile ? 10 : 20,
                        padding: isMobile ? "12px 36px" : "16px 48px",
                        fontSize: isMobile ? 15 : 18,
                        fontWeight: 600,
                        color: "#0A0A0F",
                        background: "#F59E0B",
                        border: "none",
                        borderRadius: isMobile ? 8 : 12,
                        cursor: "pointer",
                        boxShadow: "0 0 20px rgba(245, 158, 11, 0.2)",
                        transition: "all 200ms ease-out",
                    }}
                >
                    再試一次
                </motion.button>
            </div>

            {/* Footer */}
            <div
                style={{
                    position: "absolute",
                    bottom: isMobile ? 10 : 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                    gap: isMobile ? 4 : 12,
                    zIndex: 100,
                    background: isMobile ? "rgba(10, 10, 15, 0.8)" : "transparent",
                    padding: isMobile ? "6px 12px" : "0",
                    borderRadius: isMobile ? 8 : 0,
                    backdropFilter: isMobile ? "blur(8px)" : "none",
                }}
            >
                <motion.a
                    href="https://www.instagram.com/naked_logic"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    style={{
                        color: "yellow",
                        fontSize: isMobile ? 10 : 12,
                        textDecoration: "none",
                        transition: "color 200ms ease-out",
                    }}
                    whileHover={{ color: "#F59E0B" }}
                >
                    made by @naked_logic
                </motion.a>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    style={{
                        color: "#71717A",
                        fontSize: isMobile ? 10 : 12,
                        display: isMobile ? "none" : "inline",
                    }}
                >
                    ·
                </motion.span>
                <motion.a
                    href="https://github.com/WeiYun0912/power30678-sam1268"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    style={{
                        color: "#71717A",
                        fontSize: isMobile ? 10 : 12,
                        textDecoration: "none",
                        transition: "color 200ms ease-out",
                    }}
                    whileHover={{ color: "#FAFAFA" }}
                >
                    GitHub 原始碼
                </motion.a>
            </div>
        </div>
    );
}
