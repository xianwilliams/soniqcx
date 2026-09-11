import type {Metadata} from 'next';
import './scrollcraft.css';
import './globals.css';
import {Chrome} from './chrome';
export const metadata:Metadata={title:{default:'SONIQCX | Revenue lives here',template:'%s | SONIQCX'},description:'Human-led. AI-enhanced. Revenue accountable. Performance-based customer experience, intelligent technology, and teams built to convert, retain, and grow.',icons:{icon:'/assets/submark.webp'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><Chrome>{children}</Chrome></body></html>}
