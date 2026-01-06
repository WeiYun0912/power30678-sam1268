import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "./components/Menu";
import { MemoryGame } from "./components/MemoryGame";
import { QTEGame } from "./components/QTEGame";
import { DragGame } from "./components/DragGame";
import { Complete } from "./components/Complete";
import { GameOver } from "./components/GameOver";
import { GameStage } from "./types/game";
import { Dialog } from "./components/Dialog";

function App() {
    const [stage, setStage] = useState<GameStage>("menu");
    const [showMemoryDialog, setShowMemoryDialog] = useState(false);
    const [showQteDialog, setShowQteDialog] = useState(false);
    const [showDragDialog, setShowDragDialog] = useState(false);
    const [memoryMaxFails, setMemoryMaxFails] = useState(3); // 預設 3 次機會

    const handleStart = () => {
        setStage("memory");
        setShowMemoryDialog(true);
    };

    const handleMemoryComplete = () => {
        setStage("qte");
        setShowQteDialog(true);
    };

    const handleMemoryFail = () => {
        // 失敗後下次給多一次機會
        setMemoryMaxFails((prev) => Math.min(prev + 1, 5));
        setStage("gameover");
    };

    const handleQTEComplete = () => {
        setStage("drag");
        setShowDragDialog(true);
    };

    const handleDragComplete = () => {
        setStage("complete");
    };

    const handleRestart = () => {
        setStage("menu");
    };

    const handleRetry = () => {
        // 從失敗畫面重試，回到第一關
        setStage("memory");
        setShowMemoryDialog(true);
    };

    return (
        <AnimatePresence mode="wait">
            {stage === "menu" && (
                <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Menu onStart={handleStart} />
                </motion.div>
            )}

            {stage === "memory" && (
                <motion.div key="memory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {showMemoryDialog ? (
                        <Dialog
                            title="第一關：記憶配對"
                            lines={[
                                "點擊卡片找出相同圖案，各配對一組。",
                                `你有 ${memoryMaxFails} 次失敗機會，超過就會失敗！`,
                                "配錯會出現惡作劇影片，別被干擾！",
                            ]}
                            onStart={() => setShowMemoryDialog(false)}
                        />
                    ) : (
                        <MemoryGame
                            onComplete={handleMemoryComplete}
                            onFail={handleMemoryFail}
                            maxFails={memoryMaxFails}
                        />
                    )}
                </motion.div>
            )}

            {stage === "qte" && (
                <motion.div key="qte" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {showQteDialog ? (
                        <Dialog
                            title="第二關：QTE 挑戰"
                            lines={[
                                "注意畫面出現的英文字母，立刻按下同一鍵。",
                                "成功 +1 分，關閉干擾影片也 +1 分！",
                                "累積 20 分立即過關。",
                            ]}
                            onStart={() => setShowQteDialog(false)}
                        />
                    ) : (
                        <QTEGame onComplete={handleQTEComplete} />
                    )}
                </motion.div>
            )}

            {stage === "drag" && (
                <motion.div key="drag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {showDragDialog ? (
                        <Dialog
                            title="第三關：拉影片挑戰"
                            lines={[
                                "把畫面中亂跑的影片拉到邊界外！",
                                "每拉出一個影片 +1 分。",
                                "BONUS 按鈕可以一次清除所有影片 +10 分！",
                                "累積 35 分即可過關。",
                            ]}
                            onStart={() => setShowDragDialog(false)}
                        />
                    ) : (
                        <DragGame onComplete={handleDragComplete} />
                    )}
                </motion.div>
            )}

            {stage === "complete" && (
                <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Complete onRestart={handleRestart} />
                </motion.div>
            )}

            {stage === "gameover" && (
                <motion.div key="gameover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <GameOver onRestart={handleRetry} nextChances={memoryMaxFails} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default App;
