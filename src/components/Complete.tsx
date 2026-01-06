import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface CompleteProps {
    onRestart: () => void;
}

export function Complete({ onRestart }: CompleteProps) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

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
                gap: isMobile ? 16 : 24,
                position: "relative",
                overflow: "hidden",
                padding: isMobile ? 15 : 20,
            }}
        >
            {/* Ambient celebration glow */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: isMobile ? "min(500px, 100vw)" : 800,
                    height: isMobile ? "min(500px, 100vh)" : 800,
                    background: "radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 60%)",
                    pointerEvents: "none",
                }}
            />

            {/* Success badge */}
            {/* <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 20px",
                    background: "rgba(34, 197, 94, 0.15)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    borderRadius: 9999,
                    fontSize: 14,
                    color: "#22C55E",
                    fontWeight: 500,
                }}
            >
                <span
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#22C55E",
                        boxShadow: "0 0 10px rgba(34, 197, 94, 0.5)",
                    }}
                />
                挑戰成功
            </motion.div> */}

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                    color: "#FAFAFA",
                    fontSize: isMobile ? "clamp(20px, 6vw, 32px)" : 40,
                    fontWeight: 700,
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    letterSpacing: "-0.025em",
                    textAlign: "center",
                    padding: "0 10px",
                }}
            >
                新的一年 希望阿盛繼續消費館長(的商品)
            </motion.h1>

            {/* 2026 新年目標圖片 */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                style={{
                    borderRadius: isMobile ? 12 : 16,
                    overflow: "hidden",
                    border: isMobile ? "1px solid rgba(245, 158, 11, 0.3)" : "2px solid rgba(245, 158, 11, 0.3)",
                    boxShadow: "0 0 60px rgba(245, 158, 11, 0.2), 0 20px 50px rgba(0,0,0,0.5)",
                    maxWidth: "95vw",
                }}
            >
                <img
                    src="/assets/images/2026新年目標.jpg"
                    alt="2026 新年目標"
                    style={{
                        width: "100%",
                        maxWidth: isMobile ? "95vw" : "90vw",
                        maxHeight: isMobile ? "40vh" : "50vh",
                        display: "block",
                        objectFit: "contain",
                    }}
                />
            </motion.div>

            {/* 希望他要做到 */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{
                    color: "#F59E0B",
                    fontSize: isMobile ? "clamp(16px, 4.5vw, 20px)" : 24,
                    fontWeight: 600,
                    textAlign: "center",
                    textShadow: "0 0 20px rgba(245, 158, 11, 0.3)",
                    padding: "0 10px",
                }}
            >
                祝阿盛新年快樂 拜託一定要做到第一點
            </motion.p>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                style={{
                    color: "#D4D4D8",
                    fontSize: isMobile ? 12 : 14,
                    textAlign: "center",
                }}
            >
                感謝這些影片讓我有素材
            </motion.p>
            <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                href="https://www.youtube.com/watch?v=raG-gSzR7WU"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    color: "white",
                    fontSize: isMobile ? 12 : 14,
                    fontWeight: 600,
                    textAlign: "center",
                    textShadow: "0 0 20px rgba(245, 158, 11, 0.3)",
                    textDecoration: "underline",
                }}
            >
                超負荷挺Toyz（中文字幕）
            </motion.a>
            <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                href="https://www.youtube.com/watch?v=RIqSPlFzsNs"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    color: "white",
                    fontSize: isMobile ? 12 : 14,
                    fontWeight: 600,
                    textAlign: "center",
                    textShadow: "0 0 20px rgba(245, 158, 11, 0.3)",
                    textDecoration: "underline",
                }}
            >
                超負荷挺Toyz 十分鐘大合集
            </motion.a>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileHover={{
                    scale: 1.02,
                    borderColor: "rgba(255,255,255,0.25)",
                    background: "rgba(255, 255, 255, 0.05)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={onRestart}
                style={{
                    marginTop: isMobile ? 5 : 10,
                    padding: isMobile ? "10px 28px" : "14px 40px",
                    fontSize: isMobile ? 14 : 16,
                    fontWeight: 500,
                    color: "#FAFAFA",
                    background: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: isMobile ? 8 : 12,
                    cursor: "pointer",
                    transition: "all 200ms ease-out",
                }}
            >
                再玩一次
            </motion.button>

            {/* Footer */}
            <div
                style={{
                    position: "absolute",
                    bottom: isMobile ? 10 : 20,
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                    gap: isMobile ? 4 : 12,
                }}
            >
                <motion.a
                    href="https://www.instagram.com/naked_logic"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
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
                    transition={{ delay: 1.2 }}
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
                    transition={{ delay: 1.3 }}
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
