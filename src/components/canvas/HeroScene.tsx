import { Suspense, useCallback, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import TarotDeck from "./TarotDeck";

type HeroSceneProps = {
  onSpreadChange?: (spread: boolean) => void;
};

export default function HeroScene({ onSpreadChange }: HeroSceneProps) {
  const [pinned, setPinned] = useState(false);
  const [spread, setSpread] = useState(false);

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
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.3} color="#fff5d6" />
      <directionalLight position={[-5, -2, -3]} intensity={0.6} color="#8b5cf6" />
      <pointLight position={[0, 0, 3]} intensity={0.6} color="#f5d98c" />
      <Suspense fallback={null}>
        <TarotDeck
          pinned={pinned}
          onPinnedChange={setPinned}
          onSpreadChange={handleSpreadChange}
        />
        <Environment preset="night" />
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
