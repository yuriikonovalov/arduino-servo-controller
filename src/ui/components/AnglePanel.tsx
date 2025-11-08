import {applicationStore} from "../applicationStore.ts";

type AnglePanelProps = {
    className?: string
}

export default function AnglePanel(props: AnglePanelProps) {
    const angle = applicationStore.useAngleForDisplaying();
    return (
        <p className={props.className}>{getDirectionText(angle)} {angle}°</p>
    );
}

function getDirectionText(degree: number): string {
    switch (true) {
        case isNorth(degree):
            return "Пн.";
        case isNorthEast(degree):
            return "Пн.Сх.";
        case isEast(degree):
            return "Сх.";
        case isSouthEast(degree):
            return "Пд.Сх.";
        case isSouth(degree):
            return "Пд.";
        case isSouthWest(degree):
            return "Пд.Зах.";
        case isWest(degree):
            return "Зах.";
        case isNorthWest(degree):
            return "Пн.Зах.";
        default:
            return "";
    }
}

function isNorth(degree: number): boolean {
    return degree >= 330 && (degree <= 360) || degree >= 0 && (degree < 30);
}

function isNorthEast(degree: number): boolean {
    return degree >= 30 && degree < 60;
}

function isEast(degree: number): boolean {
    return degree >= 60 && degree < 120;
}

function isSouthEast(degree: number): boolean {
    return degree >= 120 && (degree < 150);
}

function isSouth(degree: number): boolean {
    return degree >= 150 && (degree < 210);
}

function isSouthWest(degree: number): boolean {
    return degree >= 210 && (degree < 240);
}

function isWest(degree: number): boolean {
    return degree >= 240 && (degree < 300);
}

function isNorthWest(degree: number): boolean {
    return degree >= 300 && (degree <= 330);
}