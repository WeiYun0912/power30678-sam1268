import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function FakeCrash() {
    const [dialogCount, setDialogCount] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setDialogCount((prev) => Math.min(prev + 1, 8));
        }, 200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
            {Array.from({ length: dialogCount }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        x: 30 * i + Math.random() * 100,
                        y: 30 * i + Math.random() * 100,
                    }}
                    style={{
                        position: "absolute",
                        top: "20%",
                        left: "20%",
                        background: "#f0f0f0",
                        border: "1px solid #999",
                        boxShadow: "2px 2px 10px rgba(0,0,0,0.3)",
                        fontFamily: "Segoe UI, sans-serif",
                        minWidth: 350,
                    }}
                >
                    {/* 標題欄 */}
                    <div
                        style={{
                            background: "#cc0000",
                            color: "white",
                            padding: "8px 12px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <span>meme.exe - Application Error</span>
                        <button
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "white",
                                fontSize: 18,
                                cursor: "pointer",
                            }}
                        >
                            X
                        </button>
                    </div>
                    {/* 內容 */}
                    <div style={{ padding: "20px", display: "flex", gap: 15 }}>
                        <div style={{ fontSize: 40 }}>X</div>
                        <div>
                            <div style={{ marginBottom: 10, color: "#333" }}>
                                The application has encountered a critical error.
                            </div>
                            <div style={{ color: "#666", fontSize: 13 }}>
                                Error: STREAMER_PRANK_OVERFLOW
                                <br />
                                Memory location: 0x00000420
                            </div>
                        </div>
                    </div>
                    {/* 按鈕 */}
                    <div
                        style={{
                            padding: "10px 20px",
                            background: "#e5e5e5",
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 10,
                        }}
                    >
                        <button
                            style={{
                                padding: "6px 20px",
                                border: "1px solid #999",
                                background: "#ddd",
                                cursor: "pointer",
                            }}
                        >
                            Debug
                        </button>
                        <button
                            style={{
                                padding: "6px 20px",
                                border: "1px solid #999",
                                background: "#ddd",
                                cursor: "pointer",
                            }}
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
