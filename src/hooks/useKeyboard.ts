import { useEffect, useCallback } from "react";

interface KeyboardConfig {
    onRotation: () => void;
    onPrediction: () => void;
    onChaos: () => void;
    disabled?: boolean;
}

export function useKeyboard({ onRotation, onPrediction, onChaos, disabled }: KeyboardConfig) {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (disabled) return;

            switch (e.key) {
                case "1":
                    onRotation();
                    break;
                case "2":
                    onPrediction();
                    break;
                case "3":
                    onChaos();
                    break;
            }
        },
        [onRotation, onPrediction, onChaos, disabled]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);
}
