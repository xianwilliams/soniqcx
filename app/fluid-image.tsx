'use client';
import {useEffect, useRef, useState, type ImgHTMLAttributes} from 'react';
type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {src:string};

/** Keep the current artwork visible until its replacement has decoded. */
export function FluidImage(props: ImageProps) {
  const [shown, setShown] = useState(props), [previous, setPrevious] = useState<ImageProps | null>(null);
  const current = useRef(props);
  useEffect(() => {
    if (current.current.src === props.src) return;
    let cancelled = false, timer: ReturnType<typeof setTimeout> | undefined;
    const incoming = new Image();
    if (props.sizes) incoming.sizes = props.sizes;
    if (props.srcSet) incoming.srcset = props.srcSet;
    incoming.src = props.src;
    void incoming.decode().then(() => {
      if (cancelled) return;
      setPrevious(current.current); current.current = props; setShown(props);
      timer = setTimeout(() => setPrevious(null), 420);
    }).catch(() => { /* A failed replacement must not blank the current artwork. */ });
    return () => {cancelled = true;if (timer) clearTimeout(timer);};
  }, [props.src, props.srcSet, props.sizes]);
  return <span className="fluid-image">{previous && <img {...previous} key={previous.src} alt="" aria-hidden="true" className="fluid-image-previous"/>}<img {...shown} key={shown.src} className={previous ? 'fluid-image-arriving' : undefined}/></span>;
}
