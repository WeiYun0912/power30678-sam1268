import { motion } from "framer-motion";

interface CompleteProps {
    onRestart: () => void;
}

export function Complete({ onRestart }: CompleteProps) {
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
                gap: 24,
                position: "relative",
                overflow: "hidden",
                padding: 20,
            }}
        >
            {/* Ambient celebration glow */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 800,
                    height: 800,
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
                    fontSize: 40,
                    fontWeight: 700,
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    letterSpacing: "-0.025em",
                    textAlign: "center",
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
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "2px solid rgba(245, 158, 11, 0.3)",
                    boxShadow: "0 0 60px rgba(245, 158, 11, 0.2), 0 20px 50px rgba(0,0,0,0.5)",
                }}
            >
                <img
                    src="/assets/images/2026新年目標.jpg"
                    alt="2026 新年目標"
                    style={{
                        maxWidth: "90vw",
                        maxHeight: "50vh",
                        display: "block",
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
                    fontSize: 24,
                    fontWeight: 600,
                    textAlign: "center",
                    textShadow: "0 0 20px rgba(245, 158, 11, 0.3)",
                }}
            >
                祝阿盛新年快樂 拜託一定要做到第一點
            </motion.p>

            <motion.p>感謝這些影片讓我有素材</motion.p>
            <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                href="https://www.youtube.com/watch?v=raG-gSzR7WU"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    color: "white",
                    fontSize: 14,
                    fontWeight: 600,
                    textAlign: "center",
                    textShadow: "0 0 20px rgba(245, 158, 11, 0.3)",
                }}
            >
                超負荷挺Toyz（中文字幕）
            </motion.a>
            <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                href="hhttps://www.youtube.com/watch?v=RIqSPlFzsNs"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    color: "white",
                    fontSize: 14,
                    fontWeight: 600,
                    textAlign: "center",
                    textShadow: "0 0 20px rgba(245, 158, 11, 0.3)",
                }}
            >
                超負荷挺Toyz 十分鐘大合集
            </motion.a>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{
                    scale: 1.02,
                    borderColor: "rgba(255,255,255,0.25)",
                    background: "rgba(255, 255, 255, 0.05)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={onRestart}
                style={{
                    marginTop: 10,
                    padding: "14px 40px",
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#FAFAFA",
                    background: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: 12,
                    cursor: "pointer",
                    transition: "all 200ms ease-out",
                }}
            >
                再玩一次
            </motion.button>

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
