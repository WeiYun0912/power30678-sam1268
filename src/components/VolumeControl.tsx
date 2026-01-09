import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVolume } from "../contexts/VolumeContext";

export function VolumeControl() {
    const { volume, setVolume } = useVolume();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobile] = useState(window.innerWidth < 600);
    const containerRef = useRef<HTMLDivElement>(null);

    // 點擊外部關閉
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsExpanded(false);
            }
        };

        if (isExpanded) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isExpanded]);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
    };

    const getVolumeIcon = () => {
        if (volume === 0) return "🔇";
        if (volume < 0.3) return "🔉";
        return "🔊";
    };

    return (
        <div
            ref={containerRef}
            style={{
                position: "fixed",
                top: isMobile ? "12px" : "20px",
                right: isMobile ? "12px" : "20px",
                zIndex: 1000,
            }}
        >
            {/* 音量圖標按鈕 */}
            <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                    width: isMobile ? "40px" : "48px",
                    height: isMobile ? "40px" : "48px",
                    borderRadius: "50%",
                    background: "rgba(26, 26, 36, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isMobile ? "20px" : "24px",
                    cursor: "pointer",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
            >
                {getVolumeIcon()}
            </motion.button>

            {/* 展開的音量控制面板 */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: "absolute",
                            top: isMobile ? "50px" : "60px",
                            right: 0,
                            background: "rgba(26, 26, 36, 0.95)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "12px",
                            padding: isMobile ? "16px" : "20px",
                            minWidth: isMobile ? "180px" : "220px",
                            backdropFilter: "blur(20px)",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: isMobile ? "12px" : "16px",
                                alignItems: "center",
                            }}
                        >
                            {/* 音量標籤 */}
                            <div
                                style={{
                                    color: "#D4D4D8",
                                    fontSize: isMobile ? "12px" : "14px",
                                    fontWeight: 500,
                                }}
                            >
                                音量：{Math.round(volume * 100)}%
                            </div>

                            {/* 音量滑桿 */}
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                }}
                            >
                                <span style={{ fontSize: isMobile ? "16px" : "18px" }}>🔇</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    style={{
                                        flex: 1,
                                        height: isMobile ? "6px" : "8px",
                                        borderRadius: "4px",
                                        background: `linear-gradient(to right, #F59E0B 0%, #F59E0B ${volume * 100}%, rgba(255, 255, 255, 0.2) ${volume * 100}%, rgba(255, 255, 255, 0.2) 100%)`,
                                        outline: "none",
                                        cursor: "pointer",
                                        WebkitAppearance: "none",
                                    }}
                                />
                                <span style={{ fontSize: isMobile ? "16px" : "18px" }}>🔊</span>
                            </div>

                            {/* 快速設定按鈕 */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "8px",
                                    width: "100%",
                                }}
                            >
                                {[0, 0.3, 0.5, 1].map((val) => (
                                    <motion.button
                                        key={val}
                                        onClick={() => setVolume(val)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            flex: 1,
                                            padding: isMobile ? "6px 8px" : "8px 12px",
                                            background:
                                                Math.abs(volume - val) < 0.01
                                                    ? "rgba(245, 158, 11, 0.2)"
                                                    : "rgba(255, 255, 255, 0.05)",
                                            border:
                                                Math.abs(volume - val) < 0.01
                                                    ? "1px solid rgba(245, 158, 11, 0.5)"
                                                    : "1px solid rgba(255, 255, 255, 0.1)",
                                            borderRadius: "6px",
                                            color: "#D4D4D8",
                                            fontSize: isMobile ? "11px" : "12px",
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        {val === 0 ? "靜音" : `${Math.round(val * 100)}%`}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
