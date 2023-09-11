import { NormalizedLandmark } from "@mediapipe/tasks-vision";

export const getAngle = (
    a: NormalizedLandmark,
    b: NormalizedLandmark,
    c: NormalizedLandmark
) => {
    const dotProduct = (a.x - b.x) * (c.x - b.x) + (a.y - b.y) * (c.y - b.y);

    const lengthAB = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));

    const lengthBC = Math.sqrt(Math.pow(b.x - c.x, 2) + Math.pow(b.y - c.y, 2));

    const angle = Math.acos(dotProduct / (lengthAB * lengthBC));

    return angle * (180 / Math.PI);
};
