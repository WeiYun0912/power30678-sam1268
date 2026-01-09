export type EffectType =
    | "rotation" // 360度旋轉
    | "pullUp" // 拉上
    | "pullDown" // 拉下
    | "bounce" // 彈飛回彈
    | "blueScreen" // 藍白畫面
    | "crash" // 假當機
    | "inception" // 畫中畫套娃
    | "mirror" // 鏡像扭曲
    | "flip" // 上下顛倒
    | "shrink" // 瞬間縮小
    | "blackout" // 黑畫面閃爍
    | "shake"; // 抖動

export type RotationSpeed = "slow" | "normal" | "fast";
export type RotationDirection = "clockwise" | "counterclockwise";

export interface EffectState {
    activeEffect: EffectType | null;
    isRunning: boolean;
    rotationSpeed: RotationSpeed;
    rotationDirection: RotationDirection;
    chaosMode: boolean;
    chaosEndTime: number | null;
}

export interface VideoTransform {
    rotate: number;
    rotateX: number;
    rotateY: number;
    scale: number;
    x: number;
    y: number;
    skewX: number;
    skewY: number;
    scaleX: number;
    scaleY: number;
}

export const initialTransform: VideoTransform = {
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    x: 0,
    y: 0,
    skewX: 0,
    skewY: 0,
    scaleX: 1,
    scaleY: 1,
};

// 鬼轉效果列表（用於隨機選擇）
export const ghostEffects: EffectType[] = [
    "bounce",
    "blueScreen",
    "crash",
    "inception",
    "mirror",
    "flip",
    "shrink",
    "blackout",
];
