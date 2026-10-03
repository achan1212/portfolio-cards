import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";
import { cardThemes, type ThemeId } from "../../lib/theme";
import { makeSurfaceMaps, type SurfaceKind } from "./surfaceMaps";

// Relief strength for the book's flat panels. Paper and board are subtle
// surfaces — too much here and the pages look like stucco.
const PANEL_NORMAL_SCALE = new THREE.Vector2(0.7, 0.7);

// ─── Dimensions ───────────────────────────────────────────────────────────────
// Book is modelled around origin at the SPINE so the cover can hinge on X=0.

const BOOK_W = 1.5;   // cover width (spine → fore-edge)
const BOOK_H = 2.0;   // cover height
const COVER_D = 0.045;
const PAGE_D = 0.008;
const PAGE_INSET = 0.04; // pages sit slightly inside the cover edge
const STACK_D = 0.16;    // thickness of the closed page block

const TEX_W = 512;
const TEX_H = 683;

// Cover swings a near-full 180° so the opened spread lies flat. Stopping
// short of PI keeps a visible hinge crease instead of a single flat plane.
const OPEN_ANGLE = Math.PI * 0.97;

// Minimum angular clearance held between the turning page and the front cover
// so the page can never intersect the board it is bound inside.
const PAGE_COVER_GAP = 0.035;

// ─── Cover texture ────────────────────────────────────────────────────────────

function drawCoverTexture(
  ctx: CanvasRenderingContext2D,
  frame: string,
  symbol: string,
  back: string,
  backHighlight: string,
) {
  const w = TEX_W;
  const h = TEX_H;

  // Leather-ish base with a soft centre highlight
  const grad = ctx.createRadialGradient(w / 2, h * 0.42, 0, w / 2, h * 0.42, h * 0.72);
  grad.addColorStop(0, backHighlight);
  grad.addColorStop(1, back);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Grain — deterministic so the texture is stable across re-renders
  let seed = 20260919;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = rand() > 0.5 ? "#ffffff" : "#000000";
    ctx.fillRect(rand() * w, rand() * h, 1.5, 1.5);
  }
  ctx.globalAlpha = 1;

  // Debossed border
  const m = 34;
  ctx.strokeStyle = frame;
  ctx.globalAlpha = 0.75;
  ctx.lineWidth = 3;
  ctx.strokeRect(m, m, w - m * 2, h - m * 2);
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1;
  ctx.strokeRect(m + 10, m + 10, w - (m + 10) * 2, h - (m + 10) * 2);
  ctx.globalAlpha = 1;

  // Centre mark — a nib/pen glyph
  const cx = w / 2;
  const cy = h * 0.44;
  const s = 58;
  ctx.strokeStyle = symbol;
  ctx.fillStyle = symbol;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(cx, cy - s);
  ctx.lineTo(cx + s * 0.55, cy + s * 0.35);
  ctx.lineTo(cx, cy + s * 0.72);
  ctx.lineTo(cx - s * 0.55, cy + s * 0.35);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy - s * 0.35);
  ctx.lineTo(cx, cy + s * 0.5);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy + s * 0.16, s * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // Title
  ctx.fillStyle = symbol;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "600 34px Georgia, serif";
  ctx.fillText("SKETCHBOOK", cx, h * 0.72);

  ctx.globalAlpha = 0.6;
  ctx.font = "400 17px Georgia, serif";
  ctx.fillText("Allan Chan", cx, h * 0.78);
  ctx.globalAlpha = 1;

  // Hairlines flanking the title
  ctx.strokeStyle = frame;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 108, h * 0.755);
  ctx.lineTo(cx - 34, h * 0.755);
  ctx.moveTo(cx + 34, h * 0.755);
  ctx.lineTo(cx + 108, h * 0.755);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawPageTexture(
  ctx: CanvasRenderingContext2D,
  frame: string,
  variant = 0,
  mirrored = false,
) {
  const w = TEX_W;
  const h = TEX_H;

  ctx.fillStyle = "#f4f1e8";
  ctx.fillRect(0, 0, w, h);

  // Paper tooth
  let seed = 991 + variant * 7717;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  ctx.globalAlpha = 0.04;
  for (let i = 0; i < 1800; i++) {
    ctx.fillStyle = rand() > 0.5 ? "#000000" : "#ffffff";
    ctx.fillRect(rand() * w, rand() * h, 2, 2);
  }
  ctx.globalAlpha = 1;

  // Sketch lines. These are drawn in graphite rather than the theme accent —
  // a pale accent on cream paper washes out completely once the book is lit
  // and scaled down, leaving the pages reading as blank grey.
  ctx.strokeStyle = "#5c5347";
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  const boxes =
    variant === 0
      ? [
          [70, 90, 180, 150],
          [290, 120, 150, 200],
          [90, 300, 210, 160],
          [120, 510, 280, 110],
        ]
      : [
          [80, 70, 330, 220],
          [70, 330, 160, 130],
          [260, 320, 170, 190],
          [100, 520, 200, 110],
        ];
  for (const [x, y, bw, bh] of boxes) {
    ctx.strokeRect(x, y, bw, bh);
    ctx.beginPath();
    ctx.moveTo(x + 14, y + bh - 22);
    ctx.quadraticCurveTo(x + bw * 0.42, y + bh * 0.3, x + bw - 14, y + bh - 34);
    ctx.stroke();
  }

  // A few loose construction strokes so the page doesn't read as pure boxes
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 2;
  for (const [x, y, bw, bh] of boxes) {
    ctx.beginPath();
    ctx.moveTo(x + bw * 0.2, y + bh * 0.25);
    ctx.lineTo(x + bw * 0.75, y + bh * 0.4);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Accent is legible here because the text sits on bare paper. The caller may
  // have mirrored the canvas to pre-flip a -Z face; undo that for the text only
  // so the word reads forwards while the abstract marks stay mirrored.
  ctx.save();
  if (mirrored) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }
  ctx.fillStyle = frame;
  ctx.globalAlpha = 0.8;
  ctx.textAlign = "center";
  ctx.font = "italic 500 24px Georgia, serif";
  ctx.fillText("studies", w / 2, h - 52);
  ctx.globalAlpha = 1;
  ctx.restore();
}

function makeTexture(draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext("2d");
  if (ctx) draw(ctx);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// ─── Hinged panel ─────────────────────────────────────────────────────────────
// A panel whose geometry is shifted +X by half its width, so the group's origin
// sits on the spine edge and rotation.y hinges it like a real cover.

type PanelProps = {
  width: number;
  height: number;
  depth: number;
  faceTexture?: THREE.Texture;
  backTexture?: THREE.Texture;
  faceColor?: string;
  edgeColor: string;
  roughness?: number;
  /** Surface relief for the two large faces. */
  surface?: SurfaceKind;
  /** Seed so adjacent panels don't share an identical grain pattern. */
  surfaceSeed?: number;
};

function HingedPanel({
  width,
  height,
  depth,
  faceTexture,
  backTexture,
  faceColor,
  edgeColor,
  roughness = 0.85,
  surface = "paper",
  surfaceSeed = 1,
}: PanelProps) {
  // BoxGeometry face order: +X, -X, +Y, -Y, +Z, -Z. A panel that hinges past
  // 90° shows its -Z face to the camera, so both faces can carry a texture.
  const relief = useMemo(
    () => makeSurfaceMaps(surface, surfaceSeed),
    [surface, surfaceSeed],
  );

  const materials = useMemo(() => {
    // Edges are the cut page-block / board edge: keep them matte and un-mapped
    // so the fore-edge still reads as a stack of thin sheets.
    const edge = new THREE.MeshStandardMaterial({ color: edgeColor, roughness });
    const face = new THREE.MeshStandardMaterial({
      map: faceTexture ?? null,
      color: faceTexture ? "#ffffff" : (faceColor ?? edgeColor),
      roughness,
      normalMap: relief.normalMap,
      normalScale: PANEL_NORMAL_SCALE,
      roughnessMap: relief.roughnessMap,
    });
    const backFace = new THREE.MeshStandardMaterial({
      map: backTexture ?? null,
      color: backTexture ? "#ffffff" : (faceColor ?? edgeColor),
      roughness,
      normalMap: relief.normalMap,
      normalScale: PANEL_NORMAL_SCALE,
      roughnessMap: relief.roughnessMap,
    });
    return [edge, edge, edge, edge, face, backFace];
  }, [edgeColor, faceTexture, backTexture, faceColor, roughness, relief]);

  useEffect(() => {
    return () => {
      for (const m of materials) m.dispose();
      relief.normalMap.dispose();
      relief.roughnessMap.dispose();
    };
  }, [materials, relief]);

  return (
    <mesh position={[width / 2, 0, 0]} castShadow receiveShadow material={materials}>
      <boxGeometry args={[width, height, depth]} />
    </mesh>
  );
}

// ─── Book ─────────────────────────────────────────────────────────────────────

type SketchbookProps = {
  open: boolean;
  themeId: ThemeId;
  onToggle: () => void;
};

export default function Sketchbook({ open, themeId, onToggle }: SketchbookProps) {
  const rootRef = useRef<Group>(null);
  const frontCoverRef = useRef<Group>(null);
  const leafRefs = useRef<(Group | null)[]>([]);
  const hoveredRef = useRef(false);

  const ct = cardThemes[themeId];

  // Spine shares the cover's leather character but its own seed
  const spineRelief = useMemo(() => makeSurfaceMaps("leather", 17), []);
  useEffect(() => {
    return () => {
      spineRelief.normalMap.dispose();
      spineRelief.roughnessMap.dispose();
    };
  }, [spineRelief]);

  const coverTex = useMemo(
    () =>
      makeTexture((ctx) =>
        drawCoverTexture(ctx, ct.frame, ct.symbol, ct.back, ct.backHighlight),
      ),
    [ct.frame, ct.symbol, ct.back, ct.backHighlight],
  );
  const pageTex = useMemo(
    () => makeTexture((ctx) => drawPageTexture(ctx, ct.frame)),
    [ct.frame],
  );
  // The left page is the turned leaf's -Z face, which the camera sees
  // mirrored — pre-flip the canvas so marks and caption read the right way
  // round. Seeded differently so the two pages aren't identical.
  const pageTexFlipped = useMemo(
    () =>
      makeTexture((ctx) => {
        ctx.translate(TEX_W, 0);
        ctx.scale(-1, 1);
        drawPageTexture(ctx, ct.frame, 1, true);
      }),
    [ct.frame],
  );

  useEffect(() => {
    return () => {
      coverTex.dispose();
      pageTex.dispose();
      pageTexFlipped.dispose();
    };
  }, [coverTex, pageTex, pageTexFlipped]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  // Leaves fan out with a stagger so the block doesn't move as one slab
  const leafCount = 4;
  // Topmost leaf is the one that turns over to become the left-hand page
  const TURNING_LEAF = leafCount - 1;
  // The one directly beneath it is revealed as the right-hand page
  const RIGHT_PAGE_LEAF = leafCount - 2;
  useFrame((_, dt) => {
    const a = 1 - Math.exp(-5 * dt);

    // Cover and page must never cross. Opening, the cover leads and the page
    // trails it; closing, that order has to REVERSE — the page settles back
    // down first and the cover shuts over it. Running both directions at the
    // same rates is what let the cover sweep through the page on close.
    const COVER_RATE = open ? 5 : 3.4;
    const PAGE_RATE = open ? 3.8 : 6;

    const front = frontCoverRef.current;
    let coverAngle = 0;
    if (front) {
      const target = open ? -OPEN_ANGLE : 0;
      front.rotation.y = THREE.MathUtils.lerp(
        front.rotation.y,
        target,
        1 - Math.exp(-COVER_RATE * dt),
      );
      coverAngle = front.rotation.y;
    }

    leafRefs.current.forEach((leaf, i) => {
      if (!leaf) return;
      // Only the topmost leaf turns with the cover, becoming the left page.
      // The leaves beneath it stay put and form the right page plus the
      // visible edge of the remaining page block.
      const turns = i === TURNING_LEAF;
      const target = turns && open ? -OPEN_ANGLE : 0;
      let next = THREE.MathUtils.lerp(
        leaf.rotation.y,
        target,
        1 - Math.exp(-PAGE_RATE * dt),
      );

      // Hard guarantee, independent of the rates above: the turning page lives
      // INSIDE the cover, so its angle can never go past the cover's. Both
      // sweep through negative angles, so the page is clamped to stay at or
      // above the cover plus a small gap.
      if (turns && front) {
        next = Math.max(next, coverAngle + PAGE_COVER_GAP);
      }
      leaf.rotation.y = next;
    });

    // Closed, the book faces the viewer. Open, it lies back like a book on a
    // desk so the camera looks DOWN onto the spread — without this the covers
    // rotate edge-on to the camera and read as a folded paper fan.
    const root = rootRef.current;
    if (root) {
      // Lay the book back so the camera looks down onto the spread, but keep
      // enough upright angle that the pages read as pages, not as a thin edge.
      const tiltTarget = open ? -0.55 : -0.3;
      root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, tiltTarget, a);

      // Open spread is twice as wide as the closed cover — scale to fit
      const scaleTarget = open ? 1.0 : hoveredRef.current ? 1.35 : 1.28;
      const s = THREE.MathUtils.lerp(root.scale.x, scaleTarget, a);
      root.scale.setScalar(s);

      // Geometry hangs off the spine at x=0: closed it spans 0→+W, open it
      // spans -W→+W. Closed therefore needs the spine pushed half a cover-width
      // left to centre the visible mass; open is already centred on the spine.
      // The offset is in local units, so it scales with the book.
      const xTarget = open ? 0 : (-BOOK_W / 2) * s;
      root.position.x = THREE.MathUtils.lerp(root.position.x, xTarget, a);

      const yTarget = open ? 0.12 : 0;
      root.position.y = THREE.MathUtils.lerp(root.position.y, yTarget, a);
    }
  });

  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hoveredRef.current = true;
    document.body.style.cursor = "pointer";
  };
  const handleOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hoveredRef.current = false;
    document.body.style.cursor = "auto";
  };
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onToggle();
  };

  const pageW = BOOK_W - PAGE_INSET;
  const pageH = BOOK_H - PAGE_INSET * 1.4;

  return (
    <Float speed={1.1} rotationIntensity={0.14} floatIntensity={0.16} enabled={!open}>
      <group
        ref={rootRef}
        rotation={[-0.32, 0, 0]}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
        onClick={handleClick}
      >
        {/* Back cover — fixed, lies flat under the right-hand page */}
        <group position={[0, 0, -STACK_D / 2 - COVER_D / 2]}>
          <HingedPanel
            width={BOOK_W}
            height={BOOK_H}
            depth={COVER_D}
            faceColor="#e8e2d4"
            edgeColor={ct.back}
            surface="leather"
            surfaceSeed={3}
          />
        </group>

        {/* Spine — bridges the two covers */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[COVER_D * 1.6, BOOK_H, STACK_D + COVER_D * 2]} />
          <meshStandardMaterial
            color={ct.backHighlight}
            roughness={0.8}
            normalMap={spineRelief.normalMap}
            normalScale={PANEL_NORMAL_SCALE}
            roughnessMap={spineRelief.roughnessMap}
          />
        </mesh>

        {/* Page block — leaves hinge with a stagger */}
        {Array.from({ length: leafCount }, (_, i) => {
          // Spread the resting leaves across the block so their stacked edges
          // stay visible as page thickness on the fore-edge.
          const z = -STACK_D / 2 + (i + 0.5) * (STACK_D / leafCount);
          return (
            <group
              key={i}
              ref={(el) => {
                leafRefs.current[i] = el;
              }}
              position={[0, 0, z]}
            >
              <HingedPanel
                width={pageW}
                height={pageH}
                depth={PAGE_D}
                // The leaf that stays put is the right-hand page (+Z visible);
                // the one that turns becomes the left page (-Z visible).
                faceTexture={i === RIGHT_PAGE_LEAF ? pageTex : undefined}
                backTexture={i === TURNING_LEAF ? pageTexFlipped : undefined}
                faceColor="#efeade"
                edgeColor="#e4decf"
                roughness={0.95}
                surface="paper"
                surfaceSeed={41 + i}
              />
            </group>
          );
        })}

        {/* Front cover — the hinge the user sees swing. Its inner face (-Z) is
            paper-coloured because it becomes the left page once opened. */}
        <group ref={frontCoverRef} position={[0, 0, STACK_D / 2 + COVER_D / 2]}>
          <HingedPanel
            width={BOOK_W}
            height={BOOK_H}
            depth={COVER_D}
            faceTexture={coverTex}
            // Once open this face IS the visible left page — the turned leaf
            // sits directly behind it — so it carries the page art.
            backTexture={pageTexFlipped}
            faceColor="#e8e2d4"
            edgeColor={ct.back}
            surface="leather"
            surfaceSeed={5}
          />
        </group>
      </group>
    </Float>
  );
}
