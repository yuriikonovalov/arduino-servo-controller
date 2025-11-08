import {useEffect, useRef} from "react";

type CompassComponentProps = {
    className?: string,
    getAngle: () => number
}

const CANVAS_WIDTH = 160;
const CANVAS_HEIGHT = 160;
const CANVAS_PADDING = 4;
const COMPASS_INWARD_LINE_LENGTH = 10;

export default function Compass(props: CompassComponentProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;
        let animationFrameId: number;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = CANVAS_WIDTH * dpr;
        canvas.height = CANVAS_HEIGHT * dpr;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const length = canvas.width * 0.28;
        // Draw a circle.
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, (canvas.width / 2) - CANVAS_PADDING, 0, Math.PI * 2);

        context.moveTo(canvas.width / 2, CANVAS_PADDING);
        context.lineTo(canvas.width / 2, CANVAS_PADDING + COMPASS_INWARD_LINE_LENGTH);
        context.moveTo(canvas.width / 2, canvas.height - CANVAS_PADDING);
        context.lineTo(canvas.width / 2, canvas.height - (CANVAS_PADDING + COMPASS_INWARD_LINE_LENGTH));
        context.moveTo(CANVAS_PADDING, canvas.height / 2);
        context.lineTo(CANVAS_PADDING + COMPASS_INWARD_LINE_LENGTH, canvas.height / 2);
        context.moveTo(canvas.width - CANVAS_PADDING, canvas.height / 2);
        context.lineTo(canvas.width - (CANVAS_PADDING + COMPASS_INWARD_LINE_LENGTH), canvas.height / 2);

        context.strokeStyle = "#687064";
        context.lineWidth = 1;
        context.stroke();
        context.closePath();

        const notClearableZone = canvas.width * 0.18;

        const draw = () => {
            const angleRad = (-props.getAngle() * Math.PI) / 180;
            const endX = centerX + length * Math.cos(angleRad);
            const endY = centerY + length * Math.sin(angleRad);
            context.clearRect(notClearableZone, notClearableZone, canvas.width - notClearableZone * 2, canvas.height - notClearableZone * 2);
            // Draw a dot.
            context.beginPath();
            context.arc(centerX, centerY, 4, 0, Math.PI * 2);
            context.fillStyle = "red";
            context.fill();
            context.closePath();
            // Draw a line.
            context.beginPath();
            context.moveTo(centerX, centerY);
            context.lineTo(endX, endY);
            context.strokeStyle = "red";
            context.lineCap = "round";
            context.lineWidth = 2;
            context.stroke();
            context.closePath();

            animationFrameId = requestAnimationFrame(draw);
        };
        draw();

        return () => cancelAnimationFrame(animationFrameId);
    }, [props.getAngle]);

    return (
        <div className="grid grid-cols-6 w-fit justify-self-center">
            <p className="col-span-6 justify-self-center">Північ</p>
            <p className="w-fit self-center justify-self-center">Захід</p>
            <div className="col-span-4">
                <canvas
                    className="justify-self-center"
                    ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}/>
            </div>
            <p className="w-fit self-center justify-self-center">Схід</p>
            <p className="col-span-6 justify-self-center">Південь</p>
        </div>
    );
}