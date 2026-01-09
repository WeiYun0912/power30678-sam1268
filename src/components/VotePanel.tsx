import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface VotePanelProps {
    onComplete: (result: "up" | "down" | "ghost") => void;
    duration?: number;
}

type VoteOption = "up" | "down" | "ghost";

export function VotePanel({ onComplete, duration = 3000 }: VotePanelProps) {
    const [votes, setVotes] = useState({ up: 0, down: 0, ghost: 0 });
    const [timeLeft, setTimeLeft] = useState(duration / 1000);
    const [phase, setPhase] = useState<"voting" | "result">("voting");
    const [result, setResult] = useState<VoteOption | null>(null);

    // 模擬聊天室投票
    useEffect(() => {
        if (phase !== "voting") return;

        const voteInterval = setInterval(() => {
            const options: VoteOption[] = ["up", "down", "ghost"];
            // 讓鬼轉有更高的機率被選中（更好笑）
            const weights = [0.25, 0.25, 0.5];
            const random = Math.random();
            let cumulative = 0;
            let selected: VoteOption = "ghost";
            for (let i = 0; i < options.length; i++) {
                cumulative += weights[i];
                if (random < cumulative) {
                    selected = options[i];
                    break;
                }
            }
            setVotes((prev) => ({
                ...prev,
                [selected]: prev[selected] + Math.floor(1 + Math.random() * 3),
            }));
        }, 200);

        return () => clearInterval(voteInterval);
    }, [phase]);

    // 倒數計時
    useEffect(() => {
        if (phase !== "voting") return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // 決定結果
                    const maxVotes = Math.max(votes.up, votes.down, votes.ghost);
                    let winner: VoteOption;
                    if (votes.ghost === maxVotes) winner = "ghost";
                    else if (votes.up === maxVotes) winner = "up";
                    else winner = "down";
                    setResult(winner);
                    setPhase("result");
                    setTimeout(() => onComplete(winner), 1000);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [phase, votes, onComplete]);

    const totalVotes = votes.up + votes.down + votes.ghost;
    const getPercent = (count: number) => (totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0);

    const options = [
        { key: "up" as const, label: "拉上", emoji: "\u2B06" },
        { key: "down" as const, label: "拉下", emoji: "\u2B07" },
        { key: "ghost" as const, label: "鬼轉", emoji: "\uD83D\uDD04" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            style={{
                position: "fixed",
                right: 30,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(0, 0, 0, 0.85)",
                padding: 20,
                borderRadius: 15,
                minWidth: 200,
                zIndex: 1000,
            }}
        >
            {/* 標題與倒數 */}
            <div
                style={{
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 15,
                    textAlign: "center",
                }}
            >
                {phase === "voting" ? (
                    <>
                        聊天室預判中...
                        <motion.div
                            style={{ fontSize: 32, marginTop: 5 }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            {timeLeft}
                        </motion.div>
                    </>
                ) : (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{ fontSize: 24, color: "#ff6b6b" }}
                    >
                        結果：{options.find((o) => o.key === result)?.label}！
                    </motion.div>
                )}
            </div>

            {/* 投票選項 */}
            {options.map((option) => {
                const percent = getPercent(votes[option.key]);
                const isWinner = phase === "result" && result === option.key;
                return (
                    <div
                        key={option.key}
                        style={{
                            marginBottom: 12,
                            background: isWinner ? "#ff6b6b" : "#333",
                            borderRadius: 8,
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    option.key === "ghost"
                                        ? "linear-gradient(90deg, #667eea 0%, #764ba2 100%)"
                                        : option.key === "up"
                                          ? "linear-gradient(90deg, #11998e 0%, #38ef7d 100%)"
                                          : "linear-gradient(90deg, #eb3349 0%, #f45c43 100%)",
                            }}
                        />
                        <div
                            style={{
                                position: "relative",
                                padding: "10px 15px",
                                display: "flex",
                                justifyContent: "space-between",
                                color: "#fff",
                                fontWeight: "bold",
                            }}
                        >
                            <span>
                                {option.emoji} {option.label}
                            </span>
                            <span>
                                {percent}% ({votes[option.key]})
                            </span>
                        </div>
                    </div>
                );
            })}
        </motion.div>
    );
}
