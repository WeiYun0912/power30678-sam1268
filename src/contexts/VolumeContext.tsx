import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface VolumeContextType {
    volume: number; // 0-1
    setVolume: (volume: number) => void;
}

const VolumeContext = createContext<VolumeContextType | undefined>(undefined);

const VOLUME_STORAGE_KEY = "game_volume";
const DEFAULT_VOLUME = 0.3; // 預設音量 30%

export function VolumeProvider({ children }: { children: ReactNode }) {
    const [volume, setVolumeState] = useState<number>(() => {
        // 從 localStorage 讀取保存的音量
        const saved = localStorage.getItem(VOLUME_STORAGE_KEY);
        if (saved !== null) {
            const parsed = parseFloat(saved);
            if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
                return parsed;
            }
        }
        return DEFAULT_VOLUME;
    });

    // 保存音量到 localStorage
    useEffect(() => {
        localStorage.setItem(VOLUME_STORAGE_KEY, volume.toString());
    }, [volume]);

    const setVolume = (newVolume: number) => {
        const clampedVolume = Math.max(0, Math.min(1, newVolume));
        setVolumeState(clampedVolume);
    };

    return <VolumeContext.Provider value={{ volume, setVolume }}>{children}</VolumeContext.Provider>;
}

export function useVolume() {
    const context = useContext(VolumeContext);
    if (context === undefined) {
        throw new Error("useVolume must be used within a VolumeProvider");
    }
    return context;
}
