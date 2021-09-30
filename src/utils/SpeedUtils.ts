import Renderer from "../views/Renderer";

export function FrameTimeRatio(fps = 60) {
    return Renderer.Instance.FrameTime / (1000 / fps);
}