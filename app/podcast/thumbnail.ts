// Optimized copies of known thumbnails; new uploads use their live YouTube image.
const local = new Set(["YK89SMqFlFY","IHbObC70PSs","Np317iqc9mo","Kd2VS-MfRGs","Ql-kn-2kr1k","jk_7Nd5plMw","vOTHsqCiYmI","HoW2fS5j61E","PX13HitOFQU","rB37Cb8CeSc","FNBHJSkePH8","jhSDZvmeDQg"]);
export function thumbnail(ep: {id: string; thumbnail: string}) {
  return local.has(ep.id) ? `/assets/episode-${ep.id}.webp` : ep.thumbnail;
}
