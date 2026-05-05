import { useEffect, useRef } from "react";
import { startMatapayo } from "./game/scenes/startMatapayo.js";

export default function MatapayoGame() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const game = startMatapayo(containerRef.current);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={containerRef} className="game-shell" />;
}
