'use client';
export function Waveform() {
  return <div className="broadcast-wave" aria-hidden="true">{Array.from({length: 35}, (_, i) => <i key={i} style={{height: `${18 + ((i * 37 + 13) % 79)}%`, animationDelay: `${i * -.13}s`}}/>)}</div>;
}
