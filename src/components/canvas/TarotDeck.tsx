import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Float, Html } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useLenis } from "lenis/react";
import * as THREE from "three";
import type { Group } from "three";
import TarotCard, { type TarotCardDef } from "./TarotCard";
import { cardThemes, type ThemeId } from "../../lib/theme";

const formatSection = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const DRAG_THRESHOLD = 8;

const CARDS: TarotCardDef[] = [
  { title: "THE FOOL",      numeral: "0",     symbol: "flower",   section: "about" },
  { title: "THE MAGICIAN",  numeral: "I",     symbol: "infinity", section: "about"  },
  { title: "THE STAR",      numeral: "XVII",  symbol: "star",     section: "projects" },
  { title: "THE MOON",      numeral: "XVIII", symbol: "moon",     section: "resume" },
  { title: "THE SUN",       numeral: "XIX",   symbol: "sun",      section: "contact" },
];

type Layout = {
  position: [number, number, number];
  rotation: [number, number, number];
};

// Squared-up deck: cards share one X/Y axis and differ only in Z so they read
// as a single neat pile. Only the faintest rotation remains — a perfectly
// uniform stack reads as one solid block rather than separate cards.
const STACK_GAP = 0.02; // Z spacing between neighbouring cards

const STACKED: Layout[] = [
  { position: [0, 0, STACK_GAP * 0], rotation: [0, 0, -0.004] },
  { position: [0, 0, STACK_GAP * 1], rotation: [0, 0,  0.003] },
  { position: [0, 0, STACK_GAP * 2], rotation: [0, 0, -0.002] },
  { position: [0, 0, STACK_GAP * 3], rotation: [0, 0,  0.004] },
  { position: [0, 0, STACK_GAP * 4], rotation: [0, 0, -0.003] },
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
  themeId: ThemeId;
  cardColor: string;
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
  themeId,
  cardColor,
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
      <TarotCard def={def} hovered={hovered} themeId={themeId} cardColor={cardColor} />
    </group>
  );
}

type TarotDeckProps = {
  pinned: boolean;
  onPinnedChange: (pinned: boolean) => void;
  onSpreadChange: (spread: boolean) => void;
};

// Fraction of the visible world width to park the idle deck right of centre.
const IDLE_X_FRACTION = 0.26;
// Below this the hero copy is still full-width (max-w-2xl at 672px plus
// gutters), so there is no clear right-hand column to park the deck in and it
// stays centred behind the text instead.
const NARROW_BREAKPOINT = 1200;

const IDLE_SWAY_AMPLITUDE = 0.4;
const IDLE_SWAY_SPEED = 0.45;
const CURSOR_LIGHT_INTENSITY = 2.6;

function getThemeId(): ThemeId {
  return (document.documentElement.getAttribute("data-theme") as ThemeId) ?? "dark";
}

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
  const [themeId, setThemeId] = useState<ThemeId>(getThemeId);
  const lenis = useLenis();

  const tmpVec = useMemo(() => new THREE.Vector3(), []);
  const dirVec = useMemo(() => new THREE.Vector3(), []);

  // Keep spread open while any card is mid-flip so the deck doesn't collapse
  // when the pointer is temporarily lost as the card turns edge-on.
  const spread = hoveredIndex !== null || pinned || flipCount > 0;
  const hovering = hoveredIndex !== null;
  const ct = cardThemes[themeId];

  // Watch data-theme attribute — R3F uses its own reconciler so React context doesn't reach here
  useEffect(() => {
    const observer = new MutationObserver(() => setThemeId(getThemeId()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

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

      // Idle, the deck parks on the right so it clears the hero copy on the
      // left. Spread, it recentres so the five-card fan stays balanced in the
      // viewport. Derived from the visible world width at the deck's depth
      // rather than a fixed offset, so the gap holds across viewport sizes.
      const cam = state.camera as THREE.PerspectiveCamera;
      const viewH = 2 * Math.tan((cam.fov * Math.PI) / 180 / 2) * cam.position.z;
      const viewW = viewH * (state.size.width / state.size.height);
      // Narrow viewports have no free right-hand column, so the deck stays
      // centred rather than being pushed half off-screen.
      const idleX =
        state.size.width < NARROW_BREAKPOINT ? 0 : viewW * IDLE_X_FRACTION;
      g.position.x = THREE.MathUtils.lerp(
        g.position.x,
        spread ? 0 : idleX,
        1 - Math.exp(-4 * dt),
      );
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
              themeId={themeId}
              cardColor={ct.cardColors[i]}
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
                    borderColor: `${ct.symbol}66`,
                    color: ct.symbol,
                    boxShadow: `0 0 24px ${ct.symbol}40`,
                  }}
                  className="flex items-center gap-2 whitespace-nowrap rounded-full border bg-black/75 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] backdrop-blur-md"
                >
                  <span style={{ color: `${ct.symbol}b3` }}>✦</span>
                  {formatSection(CARDS[labelIndex].section)}
                  <span style={{ color: `${ct.symbol}b3` }}>↓</span>
                </div>
              </Html>
            )}
          </group>
        </group>
      </Float>
      <pointLight
        ref={cursorLightRef}
        color={ct.cursorLight}
        intensity={0}
        distance={1.6}
        decay={2}
      />
    </>
  );
}
