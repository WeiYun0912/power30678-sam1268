import { useRef, useCallback } from "react";
import { useVolume } from "../contexts/VolumeContext";

export function useAudio() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { volume } = useVolume();

    const play = useCallback(
        (src: string) => {
            // 停止之前的音效
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }

            audioRef.current = new Audio(src);
            audioRef.current.volume = volume;
            audioRef.current.play().catch(() => {
                // 忽略自動播放錯誤
            });
        },
        [volume]
    );

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, []);

    return { play, stop };
}
