import { motion } from "framer-motion";

export function FakeBlueScreen() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: "fixed",
                inset: 0,
                background: "#0078D7",
                color: "white",
                fontFamily: "Segoe UI, Consolas, monospace",
                padding: "10%",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
            }}
        >
            <div style={{ fontSize: "10vw", marginBottom: "2rem" }}>:(</div>
            <div style={{ fontSize: "2vw", marginBottom: "1rem" }}>
                Your PC ran into a problem and needs to restart.
            </div>
            <div style={{ fontSize: "1.5vw", marginBottom: "2rem" }}>
                We're just collecting some error info, and then we'll restart for you.
            </div>
            <div style={{ fontSize: "1.5vw" }}>
                <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                    69% complete
                </motion.span>
            </div>
            <div style={{ marginTop: "3rem", fontSize: "1.2vw" }}>
                <div>Stop code: MEME_NOT_HANDLED</div>
                <div style={{ marginTop: "0.5rem" }}>If you call a support person, give them this info:</div>
                <div>STREAMER_GOT_PRANKED_EXCEPTION</div>
            </div>
        </motion.div>
    );
}
