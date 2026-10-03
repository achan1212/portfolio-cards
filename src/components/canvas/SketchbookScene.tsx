import { Suspense, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Sketchbook from "./Sketchbook";
import { cardThemes, type ThemeId } from "../../lib/theme";

function getThemeId(): ThemeId {
  return (document.documentElement.getAttribute("data-theme") as ThemeId) ?? "dark";
}

// The camera sits above the book to look down onto the open spread, so it has
// to be aimed back at the origin rather than straight down its own -Z.
function AimCamera() {
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

type SketchbookSceneProps = {
  open: boolean;
  onToggle: () => void;
};

export default function SketchbookScene({ open, onToggle }: SketchbookSceneProps) {
  const [themeId, setThemeId] = useState<ThemeId>(getThemeId);

  // R3F has its own reconciler, so React context doesn't cross the Canvas
  // boundary — watch the attribute directly, same as TarotDeck.
  useEffect(() => {
    const observer = new MutationObserver(() => setThemeId(getThemeId()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const ct = cardThemes[themeId];

  return (
    <Canvas
      camera={{ position: [0, 1.5, 3.9], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <AimCamera />
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 5, 5]} intensity={2.1} color="#fff5d6" />
      <directionalLight position={[-4, 2, 2]} intensity={0.9} color={ct.frame} />
      <pointLight position={[0, 2, 3]} intensity={1.2} color={ct.cursorLight} />
      <Suspense fallback={null}>
        <Sketchbook open={open} themeId={themeId} onToggle={onToggle} />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
