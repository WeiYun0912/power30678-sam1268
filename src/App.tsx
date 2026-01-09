import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "./components/Menu";
import { MemoryGame } from "./components/MemoryGame";
import { QTEGame } from "./components/QTEGame";
import { DragGame } from "./components/DragGame";
import { WhackMoleGame } from "./components/WhackMoleGame";
import { MinesweeperGame } from "./components/MinesweeperGame";
import { Complete } from "./components/Complete";
import { GameOver } from "./components/GameOver";
import { GameStage } from "./types/game";
import { Dialog } from "./components/Dialog";
import { LoadingScreen } from "./components/LoadingScreen";
import { useVideoPreloader } from "./hooks/useVideoPreloader";
import { VolumeProvider } from "./contexts/VolumeContext";
import { VolumeControl } from "./components/VolumeControl";

function App() {
    const { isLoading, progress, loadedCount, totalCount } = useVideoPreloader();
    const [stage, setStage] = useState<GameStage>("menu");
    const [showMemoryDialog, setShowMemoryDialog] = useState(false);
    const [showQteDialog, setShowQteDialog] = useState(false);
    const [showDragDialog, setShowDragDialog] = useState(false);
    const [showWhackDialog, setShowWhackDialog] = useState(false);
    const [showMinesweeperDialog, setShowMinesweeperDialog] = useState(false);
    const [memoryMaxFails, setMemoryMaxFails] = useState(3); // 預設 3 次機會
    const [failedStage, setFailedStage] = useState<GameStage | null>(null); // 記錄失敗的關卡

    const handleStart = () => {
        setFailedStage(null);
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
        setFailedStage("memory");
        setStage("gameover");
    };

    const handleQTEComplete = () => {
        setStage("drag");
        setShowDragDialog(true);
    };

    const handleDragComplete = () => {
        setStage("whack");
        setShowWhackDialog(true);
    };

    const handleWhackComplete = () => {
        setStage("minesweeper");
        setShowMinesweeperDialog(true);
    };

    const handleMinesweeperComplete = () => {
        setStage("complete");
    };

    const handleMinesweeperFail = () => {
        setFailedStage("minesweeper");
        setStage("gameover");
    };

    const handleRestart = () => {
        setFailedStage(null);
        setStage("menu");
    };

    const handleRetry = () => {
        // 從失敗畫面重試，回到失敗的關卡
        if (failedStage === "minesweeper") {
            setStage("minesweeper");
            setShowMinesweeperDialog(true);
        } else {
            // 預設回到第一關
            setStage("memory");
            setShowMemoryDialog(true);
        }
    };

    const handleSelectLevel = (level: string) => {
        // 根據選擇的關卡設置對應的 stage 和 dialog
        switch (level) {
            case "memory":
                setStage("memory");
                setShowMemoryDialog(true);
                break;
            case "qte":
                setStage("qte");
                setShowQteDialog(true);
                break;
            case "drag":
                setStage("drag");
                setShowDragDialog(true);
                break;
            case "whack":
                setStage("whack");
                setShowWhackDialog(true);
                break;
            case "minesweeper":
                setStage("minesweeper");
                setShowMinesweeperDialog(true);
                break;
        }
    };

    // 顯示載入畫面
    if (isLoading) {
        return <LoadingScreen progress={progress} loadedCount={loadedCount} totalCount={totalCount} />;
    }

    return (
        <VolumeProvider>
            <AnimatePresence mode="wait">
                {stage === "menu" && (
                    <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Menu onStart={handleStart} onSelectLevel={handleSelectLevel} />
                        <VolumeControl />
                    </motion.div>
                )}

            {stage === "memory" && (
                <motion.div key="memory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {showMemoryDialog ? (
                        <Dialog
                            title="第一關：記憶配對"
                            lines={[
                                "點擊卡片找出相同圖案，各配對一組。",
                                `你有 ${memoryMaxFails} 次失敗機會，失敗就會被館長罵`,
                                "配錯會出現隨機影片，別被干擾！",
                            ]}
                            onStart={() => setShowMemoryDialog(false)}
                        />
                    ) : (
                        <>
                            <MemoryGame
                                onComplete={handleMemoryComplete}
                                onFail={handleMemoryFail}
                                maxFails={memoryMaxFails}
                            />
                            <VolumeControl />
                        </>
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
                        <>
                            <QTEGame onComplete={handleQTEComplete} />
                            <VolumeControl />
                        </>
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
                                "右邊按鈕可以一次清除所有影片 +10 分！",
                                "累積 35 分即可過關。",
                            ]}
                            onStart={() => setShowDragDialog(false)}
                        />
                    ) : (
                        <>
                            <DragGame onComplete={handleDragComplete} />
                            <VolumeControl />
                        </>
                    )}
                </motion.div>
            )}

            {stage === "whack" && (
                <motion.div key="whack" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {showWhackDialog ? (
                        <Dialog
                            title="第四關：打館長"
                            lines={[
                                "點擊從洞裡冒出的館長！",
                                "只能打「溝通溝通」或「哭蕊宿頭」+1 分",
                                "打錯 -1 分，小心別亂打！",
                                "累積 20 分即可過關。",
                            ]}
                            onStart={() => setShowWhackDialog(false)}
                        />
                    ) : (
                        <>
                            <WhackMoleGame onComplete={handleWhackComplete} />
                            <VolumeControl />
                        </>
                    )}
                </motion.div>
            )}

            {stage === "minesweeper" && (
                <motion.div key="minesweeper" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {showMinesweeperDialog ? (
                        <Dialog
                            title="第五關：踩地雷"
                            lines={[
                                "點擊格子揭開，右鍵標記地雷。",
                                "遊戲中會跳出干擾影片，必須在播完前關閉。",
                                "三次未及時關閉干擾影片就會失敗！",
                            ]}
                            onStart={() => setShowMinesweeperDialog(false)}
                        />
                    ) : (
                        <>
                            <MinesweeperGame onComplete={handleMinesweeperComplete} onFail={handleMinesweeperFail} />
                            <VolumeControl />
                        </>
                    )}
                </motion.div>
            )}

            {stage === "complete" && (
                <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Complete onRestart={handleRestart} />
                    <VolumeControl />
                </motion.div>
            )}

            {stage === "gameover" && (
                <motion.div key="gameover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <GameOver onRestart={handleRetry} nextChances={memoryMaxFails} />
                    <VolumeControl />
                </motion.div>
            )}
            </AnimatePresence>
        </VolumeProvider>
    );
}

export default App;
