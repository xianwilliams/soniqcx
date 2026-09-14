import fallback from './episodes.json';
export type Episode={id:string;title:string;duration:string;thumbnail:string};
export type EpisodeFeed={episodes:Episode[];fresh:boolean;checkedAt:string};
const CHANNEL='https://www.youtube.com/@SoniqCX/videos';
const PLAYLIST='https://www.youtube.com/playlist?list=PL-zZGNV-urVSNmg0T2NPkx8Q_v9OFP-76';
let saved:EpisodeFeed|undefined,expires=0,inflight:Promise<EpisodeFeed>|undefined;
// The channel is newest-first. Include the official podcast playlist's videos,
// plus new 20+ minute conversations that have not yet been added to that playlist.
export function parseEpisodes(html:string,playlistIds:Set<string>=new Set()):Episode[]{
 const match=html.match(/var ytInitialData = ([\s\S]*?);<\/script>/);if(!match)throw new Error('Channel data unavailable');
 const data=JSON.parse(match[1]);const found:Episode[]=[];
 function walk(value:unknown){
  if(!value||typeof value!=='object')return;
  if(Array.isArray(value)){value.forEach(walk);return}
  const obj=value as Record<string,any>,v=obj.lockupViewModel;
  if(v?.contentType==='LOCKUP_CONTENT_TYPE_VIDEO'){
   const thumbnail=v.contentImage?.thumbnailViewModel,title=v.metadata?.lockupMetadataViewModel?.title?.content;
   const duration=thumbnail?.overlays?.[0]?.thumbnailBottomOverlayViewModel?.badges?.[0]?.thumbnailBadgeViewModel?.text||'';
   const seconds=duration.split(':').reduce((total:number,part:string)=>total*60+Number(part),0);
   const image=thumbnail?.image?.sources?.at(-1)?.url;
   if(/^[\w-]{11}$/.test(v.contentId)&&typeof title==='string'&&(seconds>=1200||playlistIds.has(v.contentId))&&typeof image==='string'&&new URL(image).hostname==='i.ytimg.com')found.push({id:v.contentId,title,duration,thumbnail:image});
  }
  const old=obj.videoRenderer;
  if(old?.videoId){const duration=old.lengthText?.simpleText||'',seconds=duration.split(':').reduce((a:number,b:string)=>a*60+Number(b),0);if(seconds>=1200||playlistIds.has(old.videoId))found.push({id:old.videoId,title:old.title?.runs?.map((r:{text:string})=>r.text).join('')||'',duration,thumbnail:old.thumbnail?.thumbnails?.at(-1)?.url})}
  Object.values(obj).forEach(walk);
 }
 walk(data);const unique=found.filter((e,i)=>found.findIndex(x=>x.id===e.id)===i).slice(0,7);if(!unique.length)throw new Error('No episodes returned');return unique;
}
export async function getEpisodes():Promise<EpisodeFeed>{
 if(saved&&Date.now()<expires)return saved;if(inflight)return inflight;
 inflight=(async()=>{
  try{
   const edgeCache=(globalThis as unknown as {caches?:{default?:Cache}}).caches?.default;
   const key=new Request('https://soniqcx-experience.aballok.chatgpt.site/__podcast-cache-v1');
   const hit=await edgeCache?.match(key);if(hit){saved=await hit.json() as EpisodeFeed;expires=Date.now()+300000;return saved}
   const [channel,playlist]=await Promise.allSettled([fetch(CHANNEL,{headers:{'Accept-Language':'en-US,en;q=0.9'},signal:AbortSignal.timeout(8000)}),fetch(PLAYLIST,{headers:{'Accept-Language':'en-US,en;q=0.9'},signal:AbortSignal.timeout(8000)})]);
   if(channel.status!=='fulfilled'||!channel.value.ok)throw new Error('YouTube unavailable');const response=channel.value;
   const playlistHtml=playlist.status==='fulfilled'&&playlist.value.ok?await playlist.value.text():'';const playlistIds=new Set(Array.from(playlistHtml.matchAll(/"contentId":"([\w-]{11})"/g),m=>m[1]));
   const html=await response.text();if(html.length>5000000)throw new Error('Channel response too large');
   saved={episodes:parseEpisodes(html,playlistIds),fresh:true,checkedAt:new Date().toISOString()};expires=Date.now()+3600000;
   try{await edgeCache?.put(key,Response.json(saved,{headers:{'Cache-Control':'public, max-age=3600'}}))}catch{}
   return saved;
  }catch{return {...(saved||{episodes:fallback,checkedAt:''}),fresh:false}}
 })();try{return await inflight}finally{inflight=undefined}
}
