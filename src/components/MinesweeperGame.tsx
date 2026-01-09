import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PopupVideo } from "./PopupVideo";

const BASE = import.meta.env.BASE_URL;

// 可用的圖片素材作為地雷
const MINE_IMAGES = [
    `${BASE}assets/images/22222.png`,
    `${BASE}assets/images/MC.png`,
    `${BASE}assets/images/RRRRRR.png`,
    `${BASE}assets/images/獲得華.png`,
    `${BASE}assets/images/超負荷挺toyz.png`,
    `${BASE}assets/images/溝通溝通.png`,
    `${BASE}assets/images/哭蕊宿頭.PNG`,
];

// 爆炸影片
const EXPLODE_VIDEO = `${BASE}太LOW了.mp4`;

// 干擾影片
const DISTRACTION_VIDEOS = [`${BASE}哭蕊宿頭.mp4`, `${BASE}溝通溝通.mp4`];

// 遊戲設定
const GRID_SIZE = 10; // 10x10 格子
const MINE_COUNT = 15; // 地雷數量

interface Cell {
    x: number;
    y: number;
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    mineImage?: string; // 地雷使用的圖片
    adjacentMines: number;
}

interface PopupVideoState {
    id: number;
    src: string;
    x: number;
    y: number;
    showClose: boolean;
    autoCloseOnEnd: boolean;
    isDistraction: boolean;
    loop: boolean;
    startTime: number; // 開始播放時間
    hasCountedFailure?: boolean; // 是否已經計算過失敗
}

interface MinesweeperGameProps {
    onComplete: () => void;
    onFail: () => void;
}

function getRandomPosition() {
    const isMobile = window.innerWidth < 600;
    const padding = isMobile ? 20 : 50;
    const videoWidth = isMobile ? 200 : 300;
    return {
        x: padding + Math.random() * (window.innerWidth - videoWidth - padding * 2),
        y: padding + Math.random() * (window.innerHeight - 250),
    };
}

export function MinesweeperGame({ onComplete, onFail }: MinesweeperGameProps) {
    const [cells, setCells] = useState<Cell[][]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [showExplodeVideo, setShowExplodeVideo] = useState(false);
    const [explodeVideoKey, setExplodeVideoKey] = useState(0);
    const explodeVideoRef = useRef<HTMLVideoElement>(null);
    const [popupVideos, setPopupVideos] = useState<PopupVideoState[]>([]);
    const [missedDistractions, setMissedDistractions] = useState(0); // 未關閉的干擾影片次數
    
    // 計算已標記的旗子數量
    const flaggedCount = cells.reduce((count, row) => {
        return count + row.filter((cell) => cell.isFlagged).length;
    }, 0);
    
    // 計算剩餘炸彈數
    const remainingMines = MINE_COUNT - flaggedCount;
    const popupIdRef = useRef(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
    const distractionTimerRef = useRef<number>();
    const gameStateRef = useRef({ gameOver: false, gameWon: false });
    const processedVideoIdsRef = useRef<Set<number>>(new Set()); // 追蹤已經處理過的影片 ID
    const failureCountedRef = useRef<Set<number>>(new Set()); // 追蹤已經計算過失敗的影片 ID

    // 監聽視窗大小變化
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 600);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 初始化遊戲
    useEffect(() => {
        initializeGame();
    }, []);

    // 初始化遊戲
    const initializeGame = () => {
        // 創建空格子
        const newCells: Cell[][] = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            newCells[y] = [];
            for (let x = 0; x < GRID_SIZE; x++) {
                newCells[y][x] = {
                    x,
                    y,
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    adjacentMines: 0,
                };
            }
        }

        // 隨機放置地雷
        let minesPlaced = 0;
        while (minesPlaced < MINE_COUNT) {
            const x = Math.floor(Math.random() * GRID_SIZE);
            const y = Math.floor(Math.random() * GRID_SIZE);
            if (!newCells[y][x].isMine) {
                newCells[y][x].isMine = true;
                newCells[y][x].mineImage = MINE_IMAGES[Math.floor(Math.random() * MINE_IMAGES.length)];
                minesPlaced++;
            }
        }

        // 計算每個格子周圍的地雷數量
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (!newCells[y][x].isMine) {
                    let count = 0;
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            const nx = x + dx;
                            const ny = y + dy;
                            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && newCells[ny][nx].isMine) {
                                count++;
                            }
                        }
                    }
                    newCells[y][x].adjacentMines = count;
                }
            }
        }

        setCells(newCells);
        setGameOver(false);
        setGameWon(false);
        gameStateRef.current = { gameOver: false, gameWon: false };
        setMissedDistractions(0);
        setPopupVideos([]);
        processedVideoIdsRef.current.clear();
        failureCountedRef.current.clear();
    };

    // 隨機跳出干擾影片
    useEffect(() => {
        if (gameOver || gameWon) return;

        let isActive = true;

        const scheduleNext = () => {
            if (!isActive) return;
            // 隨機 2-6 秒後跳出干擾影片
            const delay = 2000 + Math.random() * 4000;
            distractionTimerRef.current = window.setTimeout(() => {
                // 檢查最新狀態
                if (!isActive || gameStateRef.current.gameOver || gameStateRef.current.gameWon) return;

                const randomVideo = DISTRACTION_VIDEOS[Math.floor(Math.random() * DISTRACTION_VIDEOS.length)];
                const pos = getRandomPosition();
                const id = popupIdRef.current++;
                const startTime = Date.now();

                setPopupVideos((prev: PopupVideoState[]) => [
                    ...prev,
                    {
                        id,
                        src: randomVideo,
                        ...pos,
                        showClose: true,
                        autoCloseOnEnd: true, // 播完自動關閉
                        isDistraction: true,
                        loop: false,
                        startTime,
                    },
                ]);

                // 如果遊戲還在進行，安排下一個干擾
                if (isActive && !gameStateRef.current.gameOver && !gameStateRef.current.gameWon) {
                    scheduleNext();
                }
            }, delay);
        };

        scheduleNext();

        return () => {
            isActive = false;
            if (distractionTimerRef.current) {
                clearTimeout(distractionTimerRef.current);
            }
        };
    }, [gameOver, gameWon, onFail]);

    // 移除彈出影片
    const removePopupVideo = useCallback((id: number, isAutoClose?: boolean) => {
        // 使用 ref 檢查是否已經處理過，避免重複計算
        if (processedVideoIdsRef.current.has(id)) {
            // 已經處理過，直接返回，不做任何事
            return;
        }
        
        // 先標記為已處理，避免在執行期間被重複調用
        processedVideoIdsRef.current.add(id);
        
        // 使用函數式更新來獲取最新狀態
        setPopupVideos((prev: PopupVideoState[]) => {
            const video = prev.find((v: PopupVideoState) => v.id === id);
            if (!video) return prev; // 影片已經被移除，直接返回
            
            // 只有干擾影片且自動播完才扣分，且還沒計算過失敗
            if (video.isDistraction && isAutoClose === true && !failureCountedRef.current.has(id)) {
                // 標記為已計算失敗
                failureCountedRef.current.add(id);
                
                // 在 setPopupVideos 外部計算失敗，使用 setTimeout 確保只執行一次
                setTimeout(() => {
                    setMissedDistractions((prevMissed: number) => {
                        const newMissed = prevMissed + 1;
                        if (newMissed >= 3) {
                            setGameOver(true);
                            gameStateRef.current.gameOver = true;
                            setTimeout(() => onFail(), 1000);
                        }
                        return newMissed;
                    });
                }, 0);
            }
            
            // 移除影片
            return prev.filter((v: PopupVideoState) => v.id !== id);
        });
    }, [onFail]);

    // 揭開格子
    const revealCell = useCallback(
        (x: number, y: number) => {
            if (gameOver || gameWon) return;
            if (cells[y][x].isFlagged) return;

            const newCells = cells.map((row: Cell[]) => row.map((cell: Cell) => ({ ...cell })));

            // 如果點擊的是已經揭開的格子，檢查是否可以自動揭開周圍
            if (newCells[y][x].isRevealed && !newCells[y][x].isMine) {
                // 計算周圍的旗子數量
                let flagCount = 0;
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && newCells[ny][nx].isFlagged) {
                            flagCount++;
                        }
                    }
                }

                // 如果周圍的旗子數量等於格子顯示的數字，自動揭開周圍未標記的格子
                if (flagCount === newCells[y][x].adjacentMines) {
                    // 收集所有要揭開的格子
                    const cellsToReveal: [number, number][] = [];
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            const nx = x + dx;
                            const ny = y + dy;
                            if (
                                nx >= 0 &&
                                nx < GRID_SIZE &&
                                ny >= 0 &&
                                ny < GRID_SIZE &&
                                !newCells[ny][nx].isFlagged &&
                                !newCells[ny][nx].isRevealed
                            ) {
                                cellsToReveal.push([nx, ny]);
                            }
                        }
                    }

                    // 檢查是否有地雷
                    for (const [nx, ny] of cellsToReveal) {
                        if (newCells[ny][nx].isMine) {
                            // 踩到地雷
                            newCells[ny][nx].isRevealed = true;
                            setCells(newCells);
                            setGameOver(true);
                            gameStateRef.current.gameOver = true;
                            // 顯示爆炸影片
                            setShowExplodeVideo(true);
                            setExplodeVideoKey((prev) => prev + 1);
                            setTimeout(() => {
                                onFail();
                            }, 2000);
                            return;
                        }
                    }

                    // 使用 BFS 揭開所有相鄰的空格子
                    const queue: [number, number][] = [...cellsToReveal];
                    const visited = new Set<string>();

                    while (queue.length > 0) {
                        const [cx, cy] = queue.shift()!;
                        const key = `${cx},${cy}`;
                        if (visited.has(key)) continue;
                        visited.add(key);

                        if (newCells[cy][cx].isRevealed || newCells[cy][cx].isFlagged) continue;

                        newCells[cy][cx].isRevealed = true;

                        // 如果周圍沒有地雷，繼續揭開相鄰格子
                        if (newCells[cy][cx].adjacentMines === 0) {
                            for (let ddy = -1; ddy <= 1; ddy++) {
                                for (let ddx = -1; ddx <= 1; ddx++) {
                                    if (ddx === 0 && ddy === 0) continue;
                                    const nnx = cx + ddx;
                                    const nny = cy + ddy;
                                    if (
                                        nnx >= 0 &&
                                        nnx < GRID_SIZE &&
                                        nny >= 0 &&
                                        nny < GRID_SIZE &&
                                        !newCells[nny][nnx].isMine &&
                                        !newCells[nny][nnx].isRevealed &&
                                        !newCells[nny][nnx].isFlagged
                                    ) {
                                        queue.push([nnx, nny]);
                                    }
                                }
                            }
                        }
                    }

                    setCells(newCells);
                    // 檢查是否獲勝
                    let revealedCount = 0;
                    for (let yy = 0; yy < GRID_SIZE; yy++) {
                        for (let xx = 0; xx < GRID_SIZE; xx++) {
                            if (newCells[yy][xx].isRevealed && !newCells[yy][xx].isMine) {
                                revealedCount++;
                            }
                        }
                    }

                    if (revealedCount === GRID_SIZE * GRID_SIZE - MINE_COUNT) {
                        setGameWon(true);
                        gameStateRef.current.gameWon = true;
                        setTimeout(() => {
                            onComplete();
                        }, 1000);
                    }
                    return;
                } else {
                    // 旗子數量不匹配，不做任何事
                    return;
                }
            }

            // 如果格子已經揭開，不做任何事
            if (newCells[y][x].isRevealed) return;

            if (newCells[y][x].isMine) {
                // 踩到地雷
                newCells[y][x].isRevealed = true;
                setCells(newCells);
                setGameOver(true);
                gameStateRef.current.gameOver = true;
                // 顯示爆炸影片
                setShowExplodeVideo(true);
                setExplodeVideoKey((prev) => prev + 1);
                setTimeout(() => {
                    onFail();
                }, 2000);
                return;
            }

            // 使用 BFS 揭開相鄰的空格子
            const queue: [number, number][] = [[x, y]];
            const visited = new Set<string>();

            while (queue.length > 0) {
                const [cx, cy] = queue.shift()!;
                const key = `${cx},${cy}`;
                if (visited.has(key)) continue;
                visited.add(key);

                if (newCells[cy][cx].isRevealed || newCells[cy][cx].isFlagged) continue;

                newCells[cy][cx].isRevealed = true;

                // 如果周圍沒有地雷，繼續揭開相鄰格子
                if (newCells[cy][cx].adjacentMines === 0) {
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            const nx = cx + dx;
                            const ny = cy + dy;
                            if (
                                nx >= 0 &&
                                nx < GRID_SIZE &&
                                ny >= 0 &&
                                ny < GRID_SIZE &&
                                !newCells[ny][nx].isMine &&
                                !newCells[ny][nx].isRevealed &&
                                !newCells[ny][nx].isFlagged
                            ) {
                                queue.push([nx, ny]);
                            }
                        }
                    }
                }
            }

            setCells(newCells);

            // 檢查是否獲勝
            let revealedCount = 0;
            for (let y = 0; y < GRID_SIZE; y++) {
                for (let x = 0; x < GRID_SIZE; x++) {
                    if (newCells[y][x].isRevealed && !newCells[y][x].isMine) {
                        revealedCount++;
                    }
                }
            }

            if (revealedCount === GRID_SIZE * GRID_SIZE - MINE_COUNT) {
                setGameWon(true);
                gameStateRef.current.gameWon = true;
                setTimeout(() => {
                    onComplete();
                }, 1000);
            }
        },
        [cells, gameOver, gameWon, onComplete, onFail]
    );

    // 標記/取消標記格子
    const toggleFlag = useCallback(
        (x: number, y: number, e: React.MouseEvent) => {
            e.preventDefault();
            if (gameOver || gameWon) return;
            if (cells[y][x].isRevealed) return;

            setCells((prev: Cell[][]) => {
                const newCells = prev.map((row: Cell[]) => row.map((cell: Cell) => ({ ...cell })));
                newCells[y][x].isFlagged = !newCells[y][x].isFlagged;
                return newCells;
            });
        },
        [cells, gameOver, gameWon]
    );

    const cellSize = isMobile ? 28 : 35;
    const gap = isMobile ? 2 : 3;

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
                position: "relative",
                overflow: "hidden",
                padding: isMobile ? "10px" : "20px",
                boxSizing: "border-box",
            }}
        >
            {/* Ambient glow */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "min(800px, 100vw)",
                    height: "min(600px, 80vh)",
                    background: "radial-gradient(ellipse, rgba(245, 158, 11, 0.04) 0%, transparent 60%)",
                    pointerEvents: "none",
                }}
            />

            {/* Header */}
            <div
                style={{
                    position: "absolute",
                    top: isMobile ? 10 : 24,
                    display: "flex",
                    flexDirection: isMobile ? "row" : "column",
                    alignItems: "center",
                    gap: isMobile ? 12 : 8,
                    zIndex: 10,
                    flexWrap: "wrap",
                    justifyContent: "center",
                    padding: "0 10px",
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: isMobile ? "4px 10px" : "6px 14px",
                        background: "rgba(245, 158, 11, 0.1)",
                        border: "1px solid rgba(245, 158, 11, 0.2)",
                        borderRadius: 9999,
                        fontSize: "clamp(11px, 2.5vw, 13px)",
                        color: "#F59E0B",
                        fontWeight: 500,
                    }}
                >
                    踩地雷
                </motion.div>
                {!isMobile && (
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{
                            color: "#FAFAFA",
                            fontSize: "clamp(18px, 5vw, 28px)",
                            fontWeight: 700,
                            fontFamily: '"Space Grotesk", system-ui, sans-serif',
                            letterSpacing: "-0.025em",
                            margin: 0,
                        }}
                    >
                        踩地雷挑戰
                    </motion.h2>
                )}
                <div style={{ display: "flex", gap: isMobile ? 8 : 12, flexWrap: "wrap", justifyContent: "center" }}>
                    <div style={{ color: "#D4D4D8", fontSize: "clamp(12px, 3vw, 14px)" }}>
                        未關閉：<span style={{ color: missedDistractions >= 2 ? "#EF4444" : "#F59E0B", fontWeight: 700 }}>{missedDistractions}</span> / 3
                    </div>
                    <div style={{ color: "#D4D4D8", fontSize: "clamp(12px, 3vw, 14px)" }}>
                        剩餘炸彈：<span style={{ color: "#F59E0B", fontWeight: 700 }}>{remainingMines}</span>
                    </div>
                </div>
            </div>

            {/* 遊戲格子 */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize}px)`,
                    gap: gap,
                    marginTop: isMobile ? 60 : 80,
                }}
            >
                {cells.map((row: Cell[], y: number) =>
                    row.map((cell: Cell, x: number) => (
                        <motion.div
                            key={`${x}-${y}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={!cell.isRevealed && !gameOver && !gameWon ? { scale: 1.1 } : {}}
                            whileTap={!cell.isRevealed && !gameOver && !gameWon ? { scale: 0.95 } : {}}
                            onClick={() => revealCell(x, y)}
                            onContextMenu={(e: React.MouseEvent) => toggleFlag(x, y, e)}
                            style={{
                                width: cellSize,
                                height: cellSize,
                                background: cell.isRevealed
                                    ? cell.isMine
                                        ? "#1A1A24"
                                        : "#1A1A24"
                                    : "rgba(26, 26, 36, 0.8)",
                                border: cell.isRevealed
                                    ? cell.isMine
                                        ? "2px solid #EF4444"
                                        : "1px solid rgba(255, 255, 255, 0.1)"
                                    : "2px solid rgba(245, 158, 11, 0.3)",
                                borderRadius: 4,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: cell.isRevealed || gameOver || gameWon ? "default" : "pointer",
                                fontSize: isMobile ? 10 : 12,
                                fontWeight: 700,
                                color: cell.isRevealed && cell.isMine ? "#EF4444" : "#F59E0B",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {cell.isFlagged && !cell.isRevealed && (
                                <span style={{ fontSize: isMobile ? 14 : 18 }}>🚩</span>
                            )}
                            {cell.isRevealed && cell.isMine && cell.mineImage && (
                                <img
                                    src={cell.mineImage}
                                    alt="mine"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            )}
                            {cell.isRevealed && !cell.isMine && cell.adjacentMines > 0 && (
                                <span
                                    style={{
                                        color: cell.adjacentMines === 1 ? "#22C55E" : cell.adjacentMines === 2 ? "#F59E0B" : "#EF4444",
                                    }}
                                >
                                    {cell.adjacentMines}
                                </span>
                            )}
                        </motion.div>
                    ))
                )}
            </div>

            {/* 爆炸影片 - 從底部飛到頂部 */}
            <AnimatePresence mode="wait">
                {showExplodeVideo && (
                    <motion.div
                        key={explodeVideoKey}
                        initial={{ y: "100vh", x: "-50%" }}
                        animate={{ y: "-100vh" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 4, ease: "linear" }}
                        style={{
                            position: "fixed",
                            left: "50%",
                            bottom: 0,
                            zIndex: 100,
                            borderRadius: 12,
                            overflow: "hidden",
                            border: "1px solid rgba(245, 158, 11, 0.3)",
                            boxShadow: "0 0 60px rgba(245, 158, 11, 0.3), 0 20px 40px rgba(0,0,0,0.5)",
                        }}
                    >
                        <video
                            key={explodeVideoKey}
                            ref={explodeVideoRef}
                            src={EXPLODE_VIDEO}
                            autoPlay
                            muted={false}
                            onLoadedMetadata={(e: React.SyntheticEvent<HTMLVideoElement>) => {
                                (e.target as HTMLVideoElement).volume = 0.3;
                            }}
                            style={{
                                width: "clamp(180px, 40vw, 280px)",
                                height: "auto",
                            }}
                            playsInline
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 彈出的干擾影片 */}
            <AnimatePresence>
                {popupVideos.map((video: PopupVideoState) => (
                    <PopupVideo
                        key={video.id}
                        src={video.src}
                        x={video.x}
                        y={video.y}
                        showCloseButton={video.showClose}
                        autoCloseOnEnd={video.autoCloseOnEnd}
                        loop={video.loop}
                        onClose={(isAutoClose) => removePopupVideo(video.id, isAutoClose)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
