import type {Metadata} from 'next';
import Podcast from './podcast';
export const metadata:Metadata={title:'SHIFT HAPPENS | The SONIQCX Podcast',description:'Big ideas. Real conversations. Watch SHIFT HAPPENS by SONIQCX: conversations about business, AI, leadership, and customer experience.'};
export default async function Page(){return <Podcast/>}
