import { GetFrametime } from "../FPSCounter";

export function FrameTimeRatio(fps = 60) {
    return GetFrametime() / (1000 / fps);
}