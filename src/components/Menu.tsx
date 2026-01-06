import { motion } from "framer-motion";

interface MenuProps {
    onStart: () => void;
}

export function Menu({ onStart }: MenuProps) {
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
                gap: "clamp(20px, 4vh, 40px)",
                position: "relative",
                overflow: "hidden",
                padding: "20px",
                boxSizing: "border-box",
            }}
        >
            {/* Ambient glow orbs */}
            <div
                style={{
                    position: "absolute",
                    top: "-20%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "min(600px, 100vw)",
                    height: "min(600px, 100vw)",
                    background: "radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "-30%",
                    right: "-10%",
                    width: "min(500px, 80vw)",
                    height: "min(500px, 80vw)",
                    background: "radial-gradient(circle, rgba(245, 158, 11, 0.05) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 12px",
                    background: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                    borderRadius: 9999,
                    fontSize: "clamp(10px, 2.5vw, 14px)",
                    color: "#F59E0B",
                    fontWeight: 500,
                    textAlign: "center",
                    maxWidth: "90vw",
                }}
            >
                <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#F59E0B",
                        boxShadow: "0 0 10px rgba(245, 158, 11, 0.5)",
                        flexShrink: 0,
                    }}
                />
                <span>做一休一死胖子 不開台 只會開館長玩笑 和 開館長三槍</span>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                    color: "#FAFAFA",
                    fontSize: "clamp(32px, 10vw, 72px)",
                    fontWeight: 700,
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    letterSpacing: "-0.025em",
                    textAlign: "center",
                    margin: 0,
                }}
            >
                超負荷挺Toyz
            </motion.h1>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(8px, 2vw, 16px)",
                    alignItems: "center",
                    width: "100%",
                    maxWidth: 600,
                }}
            >
                {/* Level cards */}
                <div
                    style={{
                        display: "flex",
                        gap: "clamp(8px, 2vw, 16px)",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    {[
                        { level: "第一關", name: "記憶配對" },
                        { level: "第二關", name: "QTE 挑戰" },
                        { level: "第三關", name: "拉影片挑戰" },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.15)" }}
                            style={{
                                padding: "clamp(10px, 2vw, 16px) clamp(14px, 3vw, 24px)",
                                background: "rgba(26, 26, 36, 0.6)",
                                backdropFilter: "blur(8px)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                borderRadius: 12,
                                color: "#FAFAFA",
                                fontSize: "clamp(12px, 3vw, 16px)",
                                transition: "all 300ms ease-out",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <span style={{ color: "#F59E0B", fontWeight: 600 }}>{item.level}</span>
                            <span style={{ color: "#71717A", margin: "0 8px" }}>·</span>
                            {item.name}
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{
                    filter: "brightness(1.1)",
                    boxShadow: "0 0 30px rgba(245, 158, 11, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={onStart}
                style={{
                    marginTop: "clamp(10px, 2vh, 20px)",
                    padding: "clamp(14px, 2.5vh, 18px) clamp(36px, 10vw, 56px)",
                    fontSize: "clamp(16px, 4vw, 20px)",
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
                開始遊戲
            </motion.button>

            {/* Subtle hint */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                style={{
                    color: "#71717A",
                    fontSize: "clamp(12px, 3vw, 14px)",
                    marginTop: 10,
                }}
            >
                按下按鈕開始你的挑戰
            </motion.p>

            {/* Footer */}
            <div
                style={{
                    position: "absolute",
                    bottom: "clamp(10px, 2vh, 20px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap",
                    justifyContent: "center",
                    zIndex: 100,
                    padding: "0 10px",
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
                        fontSize: "clamp(10px, 2.5vw, 12px)",
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
                        fontSize: "clamp(10px, 2.5vw, 12px)",
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
                        fontSize: "clamp(10px, 2.5vw, 12px)",
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
