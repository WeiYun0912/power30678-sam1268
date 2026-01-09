import { useState, useCallback, useRef, useEffect } from "react";
import {
    EffectState,
    EffectType,
    VideoTransform,
    initialTransform,
    ghostEffects,
    RotationSpeed,
    RotationDirection,
} from "../effects/types";

const ROTATION_SPEEDS = { slow: 2, normal: 5, fast: 12 };
const CHAOS_DURATION = { min: 10000, max: 15000 };

export function useEffectController() {
    const [transform, setTransform] = useState<VideoTransform>(initialTransform);
    const [effectState, setEffectState] = useState<EffectState>({
        activeEffect: null,
        isRunning: false,
        rotationSpeed: "normal",
        rotationDirection: "clockwise",
        chaosMode: false,
        chaosEndTime: null,
    });
    const [showBlueScreen, setShowBlueScreen] = useState(false);
    const [showCrash, setShowCrash] = useState(false);
    const [inceptionDepth, setInceptionDepth] = useState(0);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const animationRef = useRef<number>();
    const chaosIntervalRef = useRef<number>();

    // 重置所有效果
    const resetEffects = useCallback(() => {
        setTransform(initialTransform);
        setEffectState((prev) => ({
            ...prev,
            activeEffect: null,
            isRunning: false,
        }));
        setShowBlueScreen(false);
        setShowCrash(false);
        setInceptionDepth(0);
        setStatusMessage(null);
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
    }, []);

    // 360度旋轉
    const startRotation = useCallback(
        (speed: RotationSpeed = "normal", direction: RotationDirection = "clockwise") => {
            setEffectState((prev) => ({
                ...prev,
                activeEffect: "rotation",
                isRunning: true,
                rotationSpeed: speed,
                rotationDirection: direction,
            }));
            setStatusMessage("旋轉中...");

            const speedValue = ROTATION_SPEEDS[speed];
            const dirMultiplier = direction === "clockwise" ? 1 : -1;

            let rotation = transform.rotate;
            const animate = () => {
                rotation += speedValue * dirMultiplier;
                setTransform((prev) => ({ ...prev, rotate: rotation }));
                animationRef.current = requestAnimationFrame(animate);
            };
            animationRef.current = requestAnimationFrame(animate);
        },
        [transform.rotate]
    );

    const stopRotation = useCallback(() => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        setEffectState((prev) => ({
            ...prev,
            activeEffect: null,
            isRunning: false,
        }));
        setStatusMessage(null);
    }, []);

    const toggleRotation = useCallback(() => {
        if (effectState.activeEffect === "rotation") {
            stopRotation();
        } else {
            // 隨機方向和速度
            const speeds: RotationSpeed[] = ["slow", "normal", "fast"];
            const directions: RotationDirection[] = ["clockwise", "counterclockwise"];
            startRotation(
                speeds[Math.floor(Math.random() * speeds.length)],
                directions[Math.floor(Math.random() * directions.length)]
            );
        }
    }, [effectState.activeEffect, startRotation, stopRotation]);

    // 執行單個鬼轉效果
    const executeEffect = useCallback((effect: EffectType) => {
        setStatusMessage("鬼轉發動！");

        switch (effect) {
            case "bounce":
                // 彈飛回彈
                setTransform((prev) => ({ ...prev, x: window.innerWidth + 500, rotate: prev.rotate + 720 }));
                setTimeout(() => {
                    setTransform((prev) => ({ ...prev, x: -window.innerWidth - 500 }));
                }, 300);
                setTimeout(() => {
                    setTransform((prev) => ({ ...prev, x: 0, rotate: prev.rotate + 360 }));
                    setStatusMessage(null);
                }, 600);
                break;

            case "blueScreen":
                setShowBlueScreen(true);
                setTimeout(() => {
                    setShowBlueScreen(false);
                    setStatusMessage(null);
                }, 2000);
                break;

            case "crash":
                setShowCrash(true);
                setTimeout(() => {
                    setShowCrash(false);
                    setStatusMessage(null);
                }, 2500);
                break;

            case "inception":
                setInceptionDepth(3);
                setTimeout(() => {
                    setInceptionDepth(0);
                    setStatusMessage(null);
                }, 3000);
                break;

            case "mirror":
                setTransform((prev) => ({
                    ...prev,
                    scaleX: -1,
                    skewX: 15,
                    skewY: 10,
                }));
                setTimeout(() => {
                    setTransform((prev) => ({
                        ...prev,
                        scaleX: 1,
                        skewX: 0,
                        skewY: 0,
                    }));
                    setStatusMessage(null);
                }, 2000);
                break;

            case "flip":
                setTransform((prev) => ({ ...prev, rotateX: 180 }));
                setTimeout(() => {
                    setTransform((prev) => ({ ...prev, rotateX: 0 }));
                    setStatusMessage(null);
                }, 2000);
                break;

            case "shrink":
                setTransform((prev) => ({ ...prev, scale: 0.2, x: 300, y: 200 }));
                setTimeout(() => {
                    setTransform((prev) => ({ ...prev, scale: 1, x: 0, y: 0 }));
                    setStatusMessage(null);
                }, 1500);
                break;

            case "blackout": {
                const overlay = document.createElement("div");
                overlay.style.cssText = "position:fixed;inset:0;background:#000;z-index:9999";
                document.body.appendChild(overlay);
                setTimeout(() => {
                    overlay.remove();
                    setStatusMessage(null);
                }, 200);
                break;
            }

            case "shake": {
                let shakeCount = 0;
                const shakeInterval = setInterval(() => {
                    setTransform((prev) => ({
                        ...prev,
                        x: (Math.random() - 0.5) * 50,
                        y: (Math.random() - 0.5) * 50,
                    }));
                    shakeCount++;
                    if (shakeCount > 20) {
                        clearInterval(shakeInterval);
                        setTransform((prev) => ({ ...prev, x: 0, y: 0 }));
                        setStatusMessage(null);
                    }
                }, 50);
                break;
            }

            case "pullUp":
                setTransform((prev) => ({ ...prev, y: -300 }));
                setTimeout(() => {
                    setTransform((prev) => ({ ...prev, y: 0 }));
                    setStatusMessage(null);
                }, 1000);
                break;

            case "pullDown":
                setTransform((prev) => ({ ...prev, y: 300 }));
                setTimeout(() => {
                    setTransform((prev) => ({ ...prev, y: 0 }));
                    setStatusMessage(null);
                }, 1000);
                break;
        }
    }, []);

    // 隨機鬼轉
    const triggerRandomGhost = useCallback(() => {
        const effect = ghostEffects[Math.floor(Math.random() * ghostEffects.length)];
        executeEffect(effect);
    }, [executeEffect]);

    // 失控模式
    const startChaos = useCallback(() => {
        if (effectState.chaosMode) return;

        const duration = CHAOS_DURATION.min + Math.random() * (CHAOS_DURATION.max - CHAOS_DURATION.min);
        const endTime = Date.now() + duration;

        setEffectState((prev) => ({
            ...prev,
            chaosMode: true,
            chaosEndTime: endTime,
        }));
        setStatusMessage("畫面已失控！");

        // 隨機觸發效果
        chaosIntervalRef.current = setInterval(
            () => {
                if (Date.now() >= endTime) {
                    clearInterval(chaosIntervalRef.current);
                    setEffectState((prev) => ({
                        ...prev,
                        chaosMode: false,
                        chaosEndTime: null,
                    }));
                    resetEffects();
                    return;
                }

                // 隨機選擇效果
                const effects: EffectType[] = ["rotation", "shake", "bounce", "flip", "shrink", "blackout"];
                const effect = effects[Math.floor(Math.random() * effects.length)];

                if (effect === "rotation") {
                    toggleRotation();
                } else {
                    executeEffect(effect);
                }
            },
            800 + Math.random() * 1200
        );
    }, [effectState.chaosMode, executeEffect, resetEffects, toggleRotation]);

    // 清理
    useEffect(() => {
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (chaosIntervalRef.current) clearInterval(chaosIntervalRef.current);
        };
    }, []);

    return {
        transform,
        effectState,
        showBlueScreen,
        showCrash,
        inceptionDepth,
        statusMessage,
        toggleRotation,
        executeEffect,
        triggerRandomGhost,
        startChaos,
        resetEffects,
    };
}
