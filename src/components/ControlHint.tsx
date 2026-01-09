import { motion } from "framer-motion";

export function ControlHint() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{
                position: "fixed",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 15,
                zIndex: 100,
            }}
        >
            {[
                { key: "1", label: "旋轉" },
                { key: "2", label: "預判" },
                { key: "3", label: "失控" },
            ].map((item) => (
                <div
                    key={item.key}
                    style={{
                        background: "rgba(0,0,0,0.7)",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: 8,
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <span
                        style={{
                            background: "#fff",
                            color: "#000",
                            width: 24,
                            height: 24,
                            borderRadius: 4,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                        }}
                    >
                        {item.key}
                    </span>
                    {item.label}
                </div>
            ))}
        </motion.div>
    );
}
