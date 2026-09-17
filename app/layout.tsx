import type {Metadata} from 'next';
import './globals.css';
import './redesign.css';
import './media-refresh.css';
import './immersive-sections.css';
import {Chrome} from './chrome';
export const metadata:Metadata={title:{default:'SONIQCX | Revenue lives here',template:'%s | SONIQCX'},description:'Human-led. AI-enhanced. Revenue accountable. Performance-based customer experience, intelligent technology, and teams built to convert, retain, and grow.',icons:{icon:'/assets/submark.webp'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><head><link rel="preload" href="/assets/archivo-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body><Chrome>{children}</Chrome></body></html>}
