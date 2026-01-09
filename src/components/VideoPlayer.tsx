import { motion } from "framer-motion";
import { VideoTransform } from "../effects/types";

interface VideoPlayerProps {
    src: string;
    transform: VideoTransform;
    inceptionDepth?: number;
}

export function VideoPlayer({ src, transform, inceptionDepth = 0 }: VideoPlayerProps) {
    const style = {
        transform: `
      translateX(${transform.x}px)
      translateY(${transform.y}px)
      rotate(${transform.rotate}deg)
      rotateX(${transform.rotateX}deg)
      rotateY(${transform.rotateY}deg)
      scale(${transform.scale})
      scaleX(${transform.scaleX})
      skewX(${transform.skewX}deg)
      skewY(${transform.skewY}deg)
    `,
        transformStyle: "preserve-3d" as const,
    };

    return (
        <motion.div
            className="video-container"
            style={style}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
            <video
                src={src}
                autoPlay
                loop
                muted
                playsInline
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                }}
            />
            {inceptionDepth > 0 && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "10%",
                        right: "10%",
                        width: "40%",
                        height: "40%",
                        border: "3px solid #fff",
                        boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                    }}
                >
                    <VideoPlayer
                        src={src}
                        transform={{ ...transform, x: 0, y: 0 }}
                        inceptionDepth={inceptionDepth - 1}
                    />
                </div>
            )}
        </motion.div>
    );
}
