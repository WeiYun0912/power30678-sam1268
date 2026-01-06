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
                gap: 40,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Ambient glow orbs */}
            <div
                style={{
                    position: "absolute",
                    top: "-20%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 600,
                    height: 600,
                    background: "radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "-30%",
                    right: "-10%",
                    width: 500,
                    height: 500,
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
                    padding: "8px 16px",
                    background: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                    borderRadius: 9999,
                    fontSize: 14,
                    color: "#F59E0B",
                    fontWeight: 500,
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
                    }}
                />
                做一休一死胖子 不開台 只會開館長玩笑 和 開館長三槍
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                    color: "#FAFAFA",
                    fontSize: 72,
                    fontWeight: 700,
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    letterSpacing: "-0.025em",
                    textAlign: "center",
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
                    gap: 16,
                    alignItems: "center",
                }}
            >
                {/* Level cards */}
                <div
                    style={{
                        display: "flex",
                        gap: 16,
                        flexWrap: "wrap",
                        justifyContent: "center",
                    }}
                >
                    <motion.div
                        whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.15)" }}
                        style={{
                            padding: "16px 24px",
                            background: "rgba(26, 26, 36, 0.6)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            borderRadius: 12,
                            color: "#FAFAFA",
                            fontSize: 16,
                            transition: "all 300ms ease-out",
                        }}
                    >
                        <span style={{ color: "#F59E0B", fontWeight: 600 }}>第一關</span>
                        <span style={{ color: "#71717A", margin: "0 10px" }}>·</span>
                        記憶配對
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.15)" }}
                        style={{
                            padding: "16px 24px",
                            background: "rgba(26, 26, 36, 0.6)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            borderRadius: 12,
                            color: "#FAFAFA",
                            fontSize: 16,
                            transition: "all 300ms ease-out",
                        }}
                    >
                        <span style={{ color: "#F59E0B", fontWeight: 600 }}>第二關</span>
                        <span style={{ color: "#71717A", margin: "0 10px" }}>·</span>
                        QTE 挑戰
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.15)" }}
                        style={{
                            padding: "16px 24px",
                            background: "rgba(26, 26, 36, 0.6)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            borderRadius: 12,
                            color: "#FAFAFA",
                            fontSize: 16,
                            transition: "all 300ms ease-out",
                        }}
                    >
                        <span style={{ color: "#F59E0B", fontWeight: 600 }}>第三關</span>
                        <span style={{ color: "#71717A", margin: "0 10px" }}>·</span>
                        拉影片挑戰
                    </motion.div>
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
                    marginTop: 20,
                    padding: "18px 56px",
                    fontSize: 20,
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
                    fontSize: 14,
                    marginTop: 10,
                }}
            >
                按下按鈕開始你的挑戰
            </motion.p>

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
