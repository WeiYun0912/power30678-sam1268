import { motion } from "framer-motion";

interface LoadingScreenProps {
    progress: number;
    loadedCount: number;
    totalCount: number;
}

export function LoadingScreen({ progress, loadedCount, totalCount }: LoadingScreenProps) {
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
            }}
        >
            {/* Ambient glow */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "min(600px, 100vw)",
                    height: "min(600px, 100vw)",
                    background: "radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            {/* 標題 */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    color: "#FAFAFA",
                    fontSize: "clamp(28px, 8vw, 48px)",
                    fontWeight: 700,
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    letterSpacing: "-0.025em",
                    textAlign: "center",
                    margin: 0,
                }}
            >
                超負荷挺Toyz
            </motion.h1>

            {/* 載入狀態 */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                    width: "100%",
                    maxWidth: 300,
                    padding: "0 20px",
                }}
            >
                {/* 進度條外框 */}
                <div
                    style={{
                        width: "100%",
                        height: 8,
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: 4,
                        overflow: "hidden",
                    }}
                >
                    {/* 進度條 */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                        style={{
                            height: "100%",
                            background: "#F59E0B",
                            borderRadius: 4,
                            boxShadow: "0 0 20px rgba(245, 158, 11, 0.5)",
                        }}
                    />
                </div>

                {/* 載入文字 */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        color: "#71717A",
                        fontSize: "clamp(12px, 3vw, 14px)",
                    }}
                >
                    <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#F59E0B",
                        }}
                    />
                    載入遊戲素材中... ({loadedCount}/{totalCount})
                </div>

                {/* 提示 */}
                <div
                    style={{
                        color: "#52525B",
                        fontSize: "clamp(10px, 2.5vw, 12px)",
                        textAlign: "center",
                        marginTop: 8,
                    }}
                >
                    首次載入可能需要一些時間，請稍候
                </div>
            </motion.div>
        </div>
    );
}
