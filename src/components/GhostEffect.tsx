import { motion, TargetAndTransition } from "framer-motion";

interface GhostEffectProps {
    type: string;
}

export function GhostEffect({ type }: GhostEffectProps) {
    const variants: Record<string, TargetAndTransition> = {
        bounce: {
            x: [0, 500, -500, 300, -300, 0],
            rotate: [0, 360, 720, 1080],
            transition: { duration: 1.5 },
        },
        flip: {
            rotateX: [0, 180, 360],
            rotateY: [0, 180, 0],
            transition: { duration: 1.5 },
        },
        shake: {
            x: [0, -30, 30, -30, 30, -20, 20, -10, 10, 0],
            y: [0, 20, -20, 20, -20, 10, -10, 5, -5, 0],
            transition: { duration: 1 },
        },
        spin: {
            rotate: [0, 1440],
            scale: [1, 0.5, 1.5, 1],
            transition: { duration: 1.5 },
        },
        blur: {
            filter: ["blur(0px)", "blur(20px)", "blur(0px)"],
            scale: [1, 1.2, 1],
            transition: { duration: 1 },
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 30,
                pointerEvents: "none",
            }}
        >
            <motion.div
                animate={variants[type] || variants.shake}
                style={{
                    fontSize: 120,
                    color: "#ff4444",
                    fontWeight: "bold",
                    textShadow: "0 0 30px rgba(255,0,0,0.8)",
                }}
            >
                FAIL!
            </motion.div>
        </motion.div>
    );
}
