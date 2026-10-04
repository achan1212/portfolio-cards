import { Suspense, useCallback, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import TarotDeck from "./TarotDeck";
import { type ThemeId } from "../../lib/theme";

function getThemeId(): ThemeId {
  return (document.documentElement.getAttribute("data-theme") as ThemeId) ?? "dark";
}

type HeroSceneProps = {
  onSpreadChange?: (spread: boolean) => void;
};

export default function HeroScene({ onSpreadChange }: HeroSceneProps) {
  const [pinned, setPinned] = useState(false);
  const [spread, setSpread] = useState(false);
  // R3F has its own reconciler, so React context doesn't cross the Canvas
  // boundary — watch the attribute directly, same as SketchbookScene.
  const [themeId, setThemeId] = useState<ThemeId>(getThemeId);

  useEffect(() => {
    const observer = new MutationObserver(() => setThemeId(getThemeId()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const isJournal = themeId === "light";

  const handleSpreadChange = useCallback(
    (s: boolean) => {
      setSpread(s);
      onSpreadChange?.(s);
    },
    [onSpreadChange],
  );

  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => setPinned(false)}
    >
      {/* Field Journal gets flat daylight: the violet rim light and warm gold
          fill below are tuned for the dark theme and read as stray purple/amber
          casts on the pale herbarium cards. */}
      <ambientLight intensity={isJournal ? 0.5 : 0.35} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={isJournal ? 1.0 : 1.3}
        color={isJournal ? "#fffaf0" : "#fff5d6"}
      />
      <directionalLight
        position={[-5, -2, -3]}
        intensity={isJournal ? 0.35 : 0.6}
        color={isJournal ? "#b8c4a0" : "#8b5cf6"}
      />
      <pointLight
        position={[0, 0, 3]}
        intensity={isJournal ? 0.3 : 0.6}
        color={isJournal ? "#f0ead8" : "#f5d98c"}
      />
      <Suspense fallback={null}>
        <TarotDeck
          pinned={pinned}
          onPinnedChange={setPinned}
          onSpreadChange={handleSpreadChange}
        />
        <Environment preset={isJournal ? "city" : "night"} />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        autoRotate={!spread}
        autoRotateSpeed={0.4}
      />
    </Canvas>
  );
}
