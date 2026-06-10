import { useLayoutEffect, useMemo, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cardThemes, type CardTheme, type ThemeId } from "../../lib/theme";

export type TarotSymbol = "star" | "moon" | "sun" | "infinity" | "flower";

export type TarotCardDef = {
  title: string;
  numeral: string;
  symbol: TarotSymbol;
  section: string;
  frontImage?: string;
  backImage?: string;
};

const CARD_WIDTH = 1.1;
const CARD_HEIGHT = 1.85;
const CARD_DEPTH = 0.015;
const TEX_W = 512;
const TEX_H = 896;

function darken(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) * (1 - amount));
  const g = Math.max(0, ((n >> 8) & 0xff) * (1 - amount));
  const b = Math.max(0, (n & 0xff) * (1 - amount));
  return `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
}

function drawSymbol(
  ctx: CanvasRenderingContext2D,
  symbol: TarotSymbol,
  cx: number,
  cy: number,
  size: number,
  symbolColor: string,
  backColor: string,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = symbolColor;
  ctx.fillStyle = symbolColor;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  switch (symbol) {
    case "star": {
      const points = 8;
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? size : size * 0.4;
        const a = (i * Math.PI) / points - Math.PI / 2;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "moon": {
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = darken(backColor, -0.2);
      ctx.beginPath();
      ctx.arc(size * 0.35, 0, size * 0.95, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "sun": {
      const rays = 12;
      for (let i = 0; i < rays; i++) {
        const a = (i * Math.PI * 2) / rays;
        const x1 = Math.cos(a) * size * 0.7;
        const y1 = Math.sin(a) * size * 0.7;
        const x2 = Math.cos(a) * size * 1.15;
        const y2 = Math.sin(a) * size * 1.15;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.55, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "infinity": {
      ctx.lineWidth = 8;
      const r = size * 0.5;
      ctx.beginPath();
      ctx.arc(-r, 0, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(r, 0, r, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case "flower": {
      const petals = 6;
      for (let i = 0; i < petals; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / petals);
        ctx.beginPath();
        ctx.ellipse(0, -size * 0.5, size * 0.25, size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = symbolColor;
      ctx.fill();
      break;
    }
  }
  ctx.restore();
}

function makeFrontTexture(def: TarotCardDef, cardColor: string, ct: CardTheme): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, 0, TEX_H);
  grad.addColorStop(0, darken(cardColor, 0.35));
  grad.addColorStop(0.5, cardColor);
  grad.addColorStop(1, darken(cardColor, 0.45));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, TEX_W, TEX_H);

  ctx.strokeStyle = ct.frame;
  ctx.lineWidth = 6;
  ctx.strokeRect(22, 22, TEX_W - 44, TEX_H - 44);
  ctx.lineWidth = 2;
  ctx.strokeRect(38, 38, TEX_W - 76, TEX_H - 76);

  ctx.fillStyle = ct.symbol;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 72px Georgia, serif";
  ctx.fillText(def.numeral, TEX_W / 2, 120);

  drawSymbol(ctx, def.symbol, TEX_W / 2, TEX_H / 2, 170, ct.symbol, cardColor);

  ctx.font = "italic 40px Georgia, serif";
  ctx.fillStyle = ct.symbol;
  ctx.fillText(def.title, TEX_W / 2, TEX_H - 110);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function makeBackTexture(ct: CardTheme): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createRadialGradient(
    TEX_W / 2,
    TEX_H / 2,
    50,
    TEX_W / 2,
    TEX_H / 2,
    TEX_W,
  );
  grad.addColorStop(0, ct.backHighlight);
  grad.addColorStop(1, ct.back);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, TEX_W, TEX_H);

  ctx.strokeStyle = ct.frame;
  ctx.lineWidth = 6;
  ctx.strokeRect(22, 22, TEX_W - 44, TEX_H - 44);
  ctx.lineWidth = 2;
  ctx.strokeRect(38, 38, TEX_W - 76, TEX_H - 76);

  const cx = TEX_W / 2;
  const cy = TEX_H / 2;
  ctx.strokeStyle = ct.symbol;
  ctx.fillStyle = ct.symbol;

  for (let ring = 0; ring < 4; ring++) {
    const r = 60 + ring * 60;
    ctx.lineWidth = ring === 0 ? 4 : 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  const spokes = 12;
  for (let i = 0; i < spokes; i++) {
    const a = (i * Math.PI * 2) / spokes;
    const x1 = cx + Math.cos(a) * 60;
    const y1 = cy + Math.sin(a) * 60;
    const x2 = cx + Math.cos(a) * 240;
    const y2 = cy + Math.sin(a) * 240;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  drawSymbol(ctx, "sun", cx, cy, 36, ct.symbol, ct.back);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

const HOVER_EMISSIVE = 0.32;

type CardMeshProps = {
  frontMap: THREE.Texture;
  backMap: THREE.Texture;
  hovered: boolean;
  frameColor: string;
  symbolColor: string;
};

function CardMesh({ frontMap, backMap, hovered, frameColor, symbolColor }: CardMeshProps) {
  const frontMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const backMatRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, dt) => {
    const target = hovered ? HOVER_EMISSIVE : 0;
    const a = 1 - Math.exp(-9 * dt);
    if (frontMatRef.current)
      frontMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        frontMatRef.current.emissiveIntensity,
        target,
        a,
      );
    if (backMatRef.current)
      backMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        backMatRef.current.emissiveIntensity,
        target,
        a,
      );
  });

  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]} />
      <meshStandardMaterial attach="material-0" color={frameColor} roughness={0.5} metalness={0.7} />
      <meshStandardMaterial attach="material-1" color={frameColor} roughness={0.5} metalness={0.7} />
      <meshStandardMaterial attach="material-2" color={frameColor} roughness={0.5} metalness={0.7} />
      <meshStandardMaterial attach="material-3" color={frameColor} roughness={0.5} metalness={0.7} />
      <meshStandardMaterial
        ref={frontMatRef}
        attach="material-4"
        map={frontMap}
        roughness={0.55}
        metalness={0.15}
        emissive={symbolColor}
        emissiveMap={frontMap}
        emissiveIntensity={0}
      />
      <meshStandardMaterial
        ref={backMatRef}
        attach="material-5"
        map={backMap}
        roughness={0.55}
        metalness={0.15}
        emissive={symbolColor}
        emissiveMap={backMap}
        emissiveIntensity={0}
      />
    </mesh>
  );
}

function ProceduralCard({
  def,
  hovered,
  themeId,
  cardColor,
}: {
  def: TarotCardDef;
  hovered: boolean;
  themeId: ThemeId;
  cardColor: string;
}) {
  const ct = cardThemes[themeId];
  const frontMap = useMemo(() => makeFrontTexture(def, cardColor, ct), [def, cardColor, themeId]);
  const backMap = useMemo(() => makeBackTexture(ct), [themeId]);
  return (
    <CardMesh
      frontMap={frontMap}
      backMap={backMap}
      hovered={hovered}
      frameColor={ct.frame}
      symbolColor={ct.symbol}
    />
  );
}

function ImageCard({
  def,
  hovered,
  themeId,
  cardColor,
}: {
  def: TarotCardDef;
  hovered: boolean;
  themeId: ThemeId;
  cardColor: string;
}) {
  const ct = cardThemes[themeId];
  const fallbackBack = useMemo(() => makeBackTexture(ct), [themeId]);
  const fallbackFront = useMemo(() => makeFrontTexture(def, cardColor, ct), [def, cardColor, themeId]);
  const paths = [def.frontImage, def.backImage].filter(Boolean) as string[];
  const loaded = useTexture(paths);
  const arr = Array.isArray(loaded) ? loaded : [loaded];
  const frontMap = def.frontImage ? arr[0] : fallbackFront;
  const backMap = def.backImage ? arr[def.frontImage ? 1 : 0] : fallbackBack;
  useLayoutEffect(() => {
    if (frontMap instanceof THREE.Texture) frontMap.colorSpace = THREE.SRGBColorSpace;
    if (backMap instanceof THREE.Texture) backMap.colorSpace = THREE.SRGBColorSpace;
  }, [frontMap, backMap]);
  return (
    <CardMesh
      frontMap={frontMap}
      backMap={backMap}
      hovered={hovered}
      frameColor={ct.frame}
      symbolColor={ct.symbol}
    />
  );
}

export default function TarotCard({
  def,
  hovered,
  themeId,
  cardColor,
}: {
  def: TarotCardDef;
  hovered: boolean;
  themeId: ThemeId;
  cardColor: string;
}) {
  return def.frontImage || def.backImage ? (
    <ImageCard def={def} hovered={hovered} themeId={themeId} cardColor={cardColor} />
  ) : (
    <ProceduralCard def={def} hovered={hovered} themeId={themeId} cardColor={cardColor} />
  );
}
