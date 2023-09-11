import { useEffect, useState } from "react";
import {
    FilesetResolver,
    PoseLandmarker,
    PoseLandmarkerResult,
    DrawingUtils,
} from "@mediapipe/tasks-vision";
import { getAngle } from "../utils/getAngle";
import { Link } from "react-router-dom";

let video: HTMLVideoElement;
let poseLandMarker: PoseLandmarker;
let lastVideoTime = -1;
let canvas: HTMLCanvasElement;
let canvasCtx: CanvasRenderingContext2D;
let results: PoseLandmarkerResult;

type ScreenSize = {
    height: number;
    width: number;
};

function CameraPage() {
    const [screenSize, setScreenSize] = useState<ScreenSize | null>(null);

    const [leftAngle, setLeftAngle] = useState(0);
    const [rightAngle, setRightAngle] = useState(0);

    useEffect(() => {
        setScreenSize({
            height: window.innerHeight,
            width: window.innerWidth,
        });
    }, []);

    useEffect(() => {
        const initialSetup = async () => {
            if (!screenSize) return;

            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );

            poseLandMarker = await PoseLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: "/src/models/pose_landmarker_full.task",
                },
                runningMode: "VIDEO",
            });

            video = document.getElementById("video") as HTMLVideoElement;
            canvas = document.getElementById("canvas") as HTMLCanvasElement;
            canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;
            navigator.mediaDevices
                .getUserMedia({
                    video: {
                        height: screenSize?.height,
                        width: screenSize?.width,
                    },
                })
                .then((stream) => {
                    video.srcObject = stream;
                    video.addEventListener("loadeddata", predict);
                });
        };

        const predict = async () => {
            canvas.style.width = `${video.videoWidth}px`;
            canvas.style.height = `${video.videoHeight}px`;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const utils = new DrawingUtils(canvasCtx);

            const nowInMs = performance.now();
            if (lastVideoTime !== video.currentTime) {
                lastVideoTime = video.currentTime;
                results = poseLandMarker.detectForVideo(video, nowInMs);
            }
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            if (results.landmarks) {
                const bluePoints = [13, 14];
                const yellowPoints = [11, 12, 15, 16];

                for (const landmarks of results.landmarks) {
                    // Drawing the connections in red.
                    utils.drawConnectors(
                        landmarks,
                        [
                            { start: 11, end: 13 },
                            { start: 13, end: 15 },
                            { start: 12, end: 14 },
                            { start: 14, end: 16 },
                        ],
                        {
                            color: "#FF0000",
                            lineWidth: 5,
                        }
                    );

                    // Drawing the elbow points in blue and the other points in yellow.
                    const elbowPoints = landmarks.filter((_, index) =>
                        bluePoints.includes(index)
                    );
                    const otherPoints = landmarks.filter((_, index) =>
                        yellowPoints.includes(index)
                    );
                    utils.drawLandmarks(elbowPoints, {
                        color: "#0000FF",
                        lineWidth: 2,
                    });
                    utils.drawLandmarks(otherPoints, {
                        color: "#FFFF00",
                        lineWidth: 2,
                    });
                }

                // Calculating the angle between the elbow and wrist points.
                const rightA = results.landmarks[0][12];
                const rightB = results.landmarks[0][14];
                const rightC = results.landmarks[0][16];
                setRightAngle(getAngle(rightA, rightB, rightC));

                const leftA = results.landmarks[0][11];
                const leftB = results.landmarks[0][13];
                const leftC = results.landmarks[0][15];
                setLeftAngle(getAngle(leftA, leftB, leftC));
            }
            canvasCtx.restore();

            requestAnimationFrame(predict);
        };

        initialSetup();

        return () => {
            if (video) {
                video.removeEventListener("loadeddata", predict);
                video.pause();
                video.srcObject = null;
            }
        };
    }, [screenSize]);

    return (
        <div className="h-[100svh] w-screen relative">
            <video
                autoPlay
                id="video"
                className="absolute top-0 left-1/2 -translate-x-1/2 rounded-md"
            />
            <canvas
                id="canvas"
                className="absolute z-10 top-0 left-1/2 -translate-x-1/2"
            ></canvas>

            <div className="flex flex-col items-center justify-center p-2 absolute left-2 bottom-4">
                <p className="text-2xl">Правый: {rightAngle.toFixed(2)}°</p>
                <p className="text-2xl">Левый: {leftAngle.toFixed(2)}°</p>
            </div>

            <Link
                to="/"
                className="absolute text-center right-2 bottom-4 py-2 px-4 text-2xl rounded-full border-2 border-black"
            >
                Стоп
            </Link>
        </div>
    );
}

export default CameraPage;
