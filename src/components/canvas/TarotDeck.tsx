import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Float, Html } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useLenis } from "lenis/react";
import * as THREE from "three";
import type { Group } from "three";
import TarotCard, { type TarotCardDef } from "./TarotCard";

const formatSection = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const DRAG_THRESHOLD = 8;

const CARDS: TarotCardDef[] = [
  { title: "THE FOOL",      numeral: "0",     color: "#3d1f2e", symbol: "flower",   section: "about" },
  { title: "THE MAGICIAN",  numeral: "I",     color: "#2d1b54", symbol: "infinity", section: "skills" },
  { title: "THE STAR",      numeral: "XVII",  color: "#0f1729", symbol: "star",     section: "projects" },
  { title: "THE MOON",      numeral: "XVIII", color: "#1e1b4b", symbol: "moon",     section: "resume" },
  { title: "THE SUN",       numeral: "XIX",   color: "#3d2515", symbol: "sun",      section: "contact" },
];

type Layout = {
  position: [number, number, number];
  rotation: [number, number, number];
};

const STACKED: Layout[] = [
  { position: [-0.05, -0.07, 0.00], rotation: [0, 0, -0.03]  },
  { position: [-0.03, -0.03, 0.08], rotation: [0, 0, -0.015] },
  { position: [ 0.00,  0.00, 0.16], rotation: [0, 0,  0.00]  },
  { position: [ 0.03,  0.03, 0.24], rotation: [0, 0,  0.015] },
  { position: [ 0.05,  0.07, 0.32], rotation: [0, 0,  0.03]  },
];

const SPREAD: Layout[] = [
  { position: [-2.0, 0.00, 0.00], rotation: [0,  0.25, -0.08] },
  { position: [-1.0, 0.18, 0.18], rotation: [0,  0.12, -0.04] },
  { position: [ 0.0, 0.26, 0.36], rotation: [0,  0.00,  0.00] },
  { position: [ 1.0, 0.18, 0.18], rotation: [0, -0.12,  0.04] },
  { position: [ 2.0, 0.00, 0.00], rotation: [0, -0.25,  0.08] },
];

type AnimatedCardProps = {
  def: TarotCardDef;
  target: Layout;
  hovered: boolean;
  spread: boolean;
  onPointerOver: () => void;
  onPointerOut: () => void;
  onPointerMove: (point: THREE.Vector3) => void;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
  onFlipActive: (active: boolean) => void;
};

const HOVER_LIFT_Y = 0.12;
const HOVER_LIFT_Z = 0.7;
const HOVER_SCALE = 1.12;

function AnimatedCard({
  def,
  target,
  hovered,
  spread,
  onPointerOver,
  onPointerOut,
  onPointerMove,
  onClick,
  onFlipActive,
}: AnimatedCardProps) {
  const groupRef = useRef<Group>(null);
  const tempVec = useMemo(() => new THREE.Vector3(), []);

  // Pre-allocated scratch objects — never reallocated in useFrame
  const _wq = useMemo(() => new THREE.Quaternion(), []);
  const _fn = useMemo(() => new THREE.Vector3(), []);
  const _wp = useMemo(() => new THREE.Vector3(), []);
  const _tc = useMemo(() => new THREE.Vector3(), []);

  const flipValueRef = useRef(0);
  const flipCommittedRef = useRef(false);
  const wasFlipActiveRef = useRef(false);

  useFrame((state, dt) => {
    const g = groupRef.current;
    if (!g) return;
    const a = 1 - Math.exp(-7 * dt);

    // When the deck collapses back to stacked, reset flip entirely
    if (!spread) flipCommittedRef.current = false;

    // Only clear commitment when hover ends AND the flip hasn't started yet —
    // mid-flight flips keep going so the card completes its turn before the
    // spread is allowed to close.
    if (!hovered && flipValueRef.current < 0.05) {
      flipCommittedRef.current = false;
    }

    // On first hover frame, check if back is facing the camera and latch
    if (hovered && !flipCommittedRef.current) {
      g.getWorldQuaternion(_wq);
      _fn.set(0, 0, 1).applyQuaternion(_wq);      // card's +Z in world space
      g.getWorldPosition(_wp);
      _tc.copy(state.camera.position).sub(_wp).normalize();
      if (_fn.dot(_tc) < 0) flipCommittedRef.current = true;
    }

    // Animate the flip — latch keeps it at PI even while card rotates through 90°
    flipValueRef.current = THREE.MathUtils.lerp(
      flipValueRef.current,
      flipCommittedRef.current ? Math.PI : 0,
      a,
    );

    // Notify parent when flip transitions between active (mid-arc) and settled
    const isFlipActive =
      flipValueRef.current > 0.05 && flipValueRef.current < Math.PI - 0.05;
    if (isFlipActive !== wasFlipActiveRef.current) {
      wasFlipActiveRef.current = isFlipActive;
      onFlipActive(isFlipActive);
    }

    // Lift toward the camera in Z — sign flips when user orbits to the back
    const zDir = Math.sign(state.camera.position.z) || 1;
    tempVec.set(
      target.position[0],
      target.position[1] + (hovered ? HOVER_LIFT_Y : 0),
      target.position[2] + (hovered ? zDir * HOVER_LIFT_Z : 0),
    );
    g.position.lerp(tempVec, a);

    const tx = target.rotation[0];
    const ty = (hovered ? 0 : target.rotation[1]) + flipValueRef.current;
    const tz = hovered ? 0 : target.rotation[2];
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, tx, a);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, ty, a);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, tz, a);

    const targetScale = hovered ? HOVER_SCALE : 1.0;
    const s = THREE.MathUtils.lerp(g.scale.x, targetScale, a);
    g.scale.setScalar(s);
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
    onPointerOver();
  };
  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "auto";
    onPointerOut();
  };
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onPointerMove(e.point);
  };
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(e);
  };

  return (
    <group
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
    >
      <TarotCard def={def} hovered={hovered} />
    </group>
  );
}

type TarotDeckProps = {
  pinned: boolean;
  onPinnedChange: (pinned: boolean) => void;
  onSpreadChange: (spread: boolean) => void;
};

const IDLE_SWAY_AMPLITUDE = 0.4;
const IDLE_SWAY_SPEED = 0.45;
const CURSOR_LIGHT_INTENSITY = 2.6;

export default function TarotDeck({
  pinned,
  onPinnedChange,
  onSpreadChange,
}: TarotDeckProps) {
  const groupRef = useRef<Group>(null);
  const cursorLightRef = useRef<THREE.PointLight>(null);
  const cursorTargetRef = useRef(new THREE.Vector3());
  const labelAnchorRef = useRef<Group>(null);
  const downPosRef = useRef<{ x: number; y: number } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [labelIndex, setLabelIndex] = useState<number | null>(null);
  const [flipCount, setFlipCount] = useState(0);
  const lenis = useLenis();

  const tmpVec = useMemo(() => new THREE.Vector3(), []);
  const dirVec = useMemo(() => new THREE.Vector3(), []);

  // Keep spread open while any card is mid-flip so the deck doesn't collapse
  // when the pointer is temporarily lost as the card turns edge-on.
  const spread = hoveredIndex !== null || pinned || flipCount > 0;
  const hovering = hoveredIndex !== null;

  useEffect(() => {
    onSpreadChange(spread);
  }, [spread, onSpreadChange]);

  useEffect(() => {
    if (hoveredIndex !== null) setLabelIndex(hoveredIndex);
  }, [hoveredIndex]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      downPosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  useFrame((state, dt) => {
    const g = groupRef.current;
    if (g) {
      if (!spread) {
        const swayTarget =
          Math.sin(state.clock.elapsedTime * IDLE_SWAY_SPEED) *
          IDLE_SWAY_AMPLITUDE;
        g.rotation.y = THREE.MathUtils.lerp(
          g.rotation.y,
          swayTarget,
          1 - Math.exp(-3 * dt),
        );
      } else {
        g.rotation.y = THREE.MathUtils.lerp(
          g.rotation.y,
          0,
          1 - Math.exp(-5 * dt),
        );
      }
    }

    const light = cursorLightRef.current;
    if (light) {
      tmpVec.copy(cursorTargetRef.current);
      dirVec
        .copy(state.camera.position)
        .sub(tmpVec)
        .normalize()
        .multiplyScalar(0.45);
      tmpVec.add(dirVec);
      light.position.lerp(tmpVec, 1 - Math.exp(-16 * dt));
      light.intensity = THREE.MathUtils.lerp(
        light.intensity,
        hovering ? CURSOR_LIGHT_INTENSITY : 0,
        1 - Math.exp(-10 * dt),
      );
    }

    const anchor = labelAnchorRef.current;
    if (anchor && labelIndex !== null) {
      const sp = SPREAD[labelIndex].position;
      tmpVec.set(sp[0], sp[1] + HOVER_LIFT_Y - 1.3, sp[2] + HOVER_LIFT_Z);
      anchor.position.lerp(tmpVec, 1 - Math.exp(-12 * dt));
    }
  });

  const handlePointerOver = useCallback((i: number) => {
    setHoveredIndex(i);
  }, []);

  const handlePointerOut = useCallback((i: number) => {
    setHoveredIndex((curr) => (curr === i ? null : curr));
  }, []);

  const handlePointerMove = useCallback(
    (point: THREE.Vector3) => {
      cursorTargetRef.current.copy(point);
    },
    [],
  );

  const handleClick = useCallback(
    (def: TarotCardDef, e: ThreeEvent<MouseEvent>) => {
      const down = downPosRef.current;
      if (down) {
        const dx = e.nativeEvent.clientX - down.x;
        const dy = e.nativeEvent.clientY - down.y;
        if (Math.hypot(dx, dy) > DRAG_THRESHOLD) return;
      }
      if (spread) {
        lenis?.scrollTo(`#${def.section}`, { offset: -64 });
        return;
      }
      onPinnedChange(true);
    },
    [spread, onPinnedChange, lenis],
  );

  return (
    <>
      <Float speed={1.0} rotationIntensity={0.18} floatIntensity={0.12}>
        <group ref={groupRef}>
          {CARDS.map((def, i) => (
            <AnimatedCard
              key={def.title}
              def={def}
              target={spread ? SPREAD[i] : STACKED[i]}
              hovered={hoveredIndex === i}
              spread={spread}
              onPointerOver={() => handlePointerOver(i)}
              onPointerOut={() => handlePointerOut(i)}
              onPointerMove={handlePointerMove}
              onClick={(e) => handleClick(def, e)}
              onFlipActive={(active) =>
                setFlipCount((c) => c + (active ? 1 : -1))
              }
            />
          ))}
          <group ref={labelAnchorRef}>
            {labelIndex !== null && (
              <Html center prepend zIndexRange={[20, 0]}>
                <div
                  style={{
                    opacity: hovering ? 1 : 0,
                    transform: `translateY(${hovering ? 0 : 8}px)`,
                    transition: "opacity 0.22s ease, transform 0.22s ease",
                    pointerEvents: "none",
                  }}
                  className="flex items-center gap-2 whitespace-nowrap rounded-full border border-amber-300/40 bg-black/75 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-amber-100 shadow-[0_0_24px_rgba(245,217,140,0.25)] backdrop-blur-md"
                >
                  <span className="text-amber-300/70">✦</span>
                  {formatSection(CARDS[labelIndex].section)}
                  <span className="text-amber-300/70">↓</span>
                </div>
              </Html>
            )}
          </group>
        </group>
      </Float>
      <pointLight
        ref={cursorLightRef}
        color="#f5d98c"
        intensity={0}
        distance={1.6}
        decay={2}
      />
    </>
  );
}
