import { useState } from "react";
import "./App.css";
import Spline, { SplineEvent } from "@splinetool/react-spline";
import { Application } from "@splinetool/runtime";

const FONTS = {
  purple: "#9C92CD",
  yellow: "#EF9F83",
  pink: "#C9828D",
};

export default function App() {
  const [splineApp, setSplineApp] = useState<Application | null>(null);
  const [defaultColor, setDefaultColor] = useState(() => {
    return localStorage.getItem("selectedColor") || FONTS["pink"];
  });
  const [isGameWin, setIsGameWin] = useState(false);

  function handleColorChange(colorKey: keyof typeof FONTS) {
    const color = FONTS[colorKey];
    setDefaultColor(color);
    localStorage.setItem("selectedColor", color);
    splineApp?.emitEvent(
      "mouseDown",
      `Color ${colorKey.charAt(0).toUpperCase() + colorKey.slice(1)}`
    );
  }

  function onSplineMouseDown(e: SplineEvent) {
    if (!e.target) return;
    const targetName = e.target.name.toLowerCase();
    if (targetName.includes("ван-гог")) {
      setIsGameWin(true);
    } else if (targetName.includes("purple")) {
      handleColorChange("purple");
    } else if (targetName.includes("yellow")) {
      handleColorChange("yellow");
    } else if (targetName.includes("pink")) {
      handleColorChange("pink");
    }
  }

  function onLoadSplineApp(appToSet: Application) {
    setSplineApp(appToSet);
    const savedColor = localStorage.getItem("selectedColor");
    if (savedColor) {
      const colorKey = Object.keys(FONTS).find(
        (key) => FONTS[key as keyof typeof FONTS] === savedColor
      );
      if (colorKey) {
        appToSet.emitEvent(
          "mouseDown",
          `Color ${colorKey.charAt(0).toUpperCase() + colorKey.slice(1)}`
        );
      }
    }
  }

  return (
    <main>
      <div
        className="title"
        style={{
          color: defaultColor,
          transition: "color 0.3s ease-in-out",
        }}
      >
        Найди картину Ван Гога
      </div>
      <div className="game-win">{isGameWin ? "Вы нашли Ван Гога!" : ""}</div>
      <div className="spline-scene">
        <Spline
          scene="https://static-basket-02.wbbasket.ru/vol29/landings/march8_march.spline"
          onSplineMouseDown={onSplineMouseDown}
          onLoad={onLoadSplineApp}
        />
      </div>
    </main>
  );
}
