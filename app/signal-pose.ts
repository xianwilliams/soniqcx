export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const keys = [
  { p: 0, x: 2.15, y: -.04, z: 0, rx: -.12, ry: -.42, rz: -.09, scale: 1.27, gap: .23 },
  { p: .18, x: 2, y: .02, z: .1, rx: -.05, ry: -.60, rz: -.06, scale: 1.22, gap: .28 },
  { p: .42, x: 2.9, y: .05, z: -.2, rx: .12, ry: -1.15, rz: .08, scale: 1.18, gap: .75 },
  { p: .64, x: 2.85, y: .10, z: -.1, rx: -.16, ry: -.82, rz: -.08, scale: 1.22, gap: .95 },
  { p: .86, x: 2.65, y: .04, z: .2, rx: 0, ry: -.45, rz: -.03, scale: 1.2, gap: .26 },
  { p: 1, x: 2.65, y: .04, z: .2, rx: 0, ry: -.35, rz: 0, scale: 1.2, gap: .23 },
];
export function signalPose(progress: number) {
  const p = clamp(progress);
  let index = 0;
  while (index < keys.length - 2 && p > keys[index + 1].p) index++;
  const a = keys[index], b = keys[index + 1];
  const t = clamp((p - a.p) / (b.p - a.p));
  const k = t * t * (3 - 2 * t);
  const v = (key: keyof typeof a) => a[key] + (b[key] - a[key]) * k;
  return { x:v('x'), y:v('y'), z:v('z'), rx:v('rx'), ry:v('ry'), rz:v('rz'), scale:v('scale'), gap:v('gap') };
}
