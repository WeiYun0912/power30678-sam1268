import { motion, AnimatePresence } from "framer-motion";

interface StatusOverlayProps {
    message: string | null;
}

export function StatusOverlay({ message }: StatusOverlayProps) {
    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -50 }}
                    style={{
                        position: "fixed",
                        top: 30,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)",
                        color: "white",
                        padding: "15px 40px",
                        borderRadius: 10,
                        fontSize: 28,
                        fontWeight: "bold",
                        boxShadow: "0 4px 20px rgba(255, 8, 68, 0.5)",
                        zIndex: 1000,
                        textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                    }}
                >
                    <motion.span animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>
                        {message}
                    </motion.span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
