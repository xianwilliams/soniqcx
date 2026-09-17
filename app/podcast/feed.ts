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
 walk(data);const unique=found.filter((e,i)=>found.findIndex(x=>x.id===e.id)===i).slice(0,12);if(!unique.length)throw new Error('No episodes returned');return unique;
}
// YouTube's official Atom feeds remain available when its HTML pages reject
// data-center requests. Descriptions identify full podcast uploads, not shorts.
function xmlText(value:string){return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi,(_,entity:string)=>{
 const named:Record<string,string>={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"};
 if(named[entity])return named[entity];const code=entity[1]?.toLowerCase()==='x'?parseInt(entity.slice(2),16):parseInt(entity.slice(1),10);return code<=0x10ffff?String.fromCodePoint(code):'';
})}
export function parsePodcastRSS(channel:string,playlist:string,known:Episode[]=fallback):Episode[]{
 const entries=(xml:string)=>Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g),m=>{const tag=(name:string)=>xmlText(m[1].match(new RegExp('<'+name+'(?: [^>]*)?>([\\s\\S]*?)<\\/'+name+'>'))?.[1]||'');return {id:tag('yt:videoId'),title:tag('title'),description:tag('media:description')};}).filter(e=>/^[\w-]{11}$/.test(e.id));
 const official=entries(playlist),ids=new Set(official.map(e=>e.id));
 const recent=entries(channel).filter(e=>ids.has(e.id)||known.some(k=>k.id===e.id)||/shift happens|\bpodcast\b|in this episode/i.test(e.title+' '+e.description));
 if(!recent.length&&!official.length)throw new Error('Podcast feeds unavailable');
 const toEpisode=(e:{id:string;title:string}):Episode=>({id:e.id,title:e.title,duration:known.find(k=>k.id===e.id)?.duration||'Watch episode',thumbnail:`https://i.ytimg.com/vi/${e.id}/hqdefault.jpg`});
 // Keep the known archive between recent uploads and older playlist-only items.
 return [...recent.map(toEpisode),...known,...official.map(toEpisode)].filter((e,i,all)=>all.findIndex(x=>x.id===e.id)===i).slice(0,12);
}
async function readFeed(url:string){const r=await fetch(url,{signal:AbortSignal.timeout(8000)});if(!r.ok)throw new Error('Podcast feed unavailable');return r.text()}
async function loadEpisodes():Promise<Episode[]>{
 try{
  const [channel,playlist]=await Promise.allSettled([readFeed(CHANNEL),readFeed(PLAYLIST)]);
  if(channel.status!=='fulfilled')throw new Error('Channel unavailable');
  const playlistHtml=playlist.status==='fulfilled'?playlist.value:'';
  const ids=new Set(Array.from(playlistHtml.matchAll(/"(?:contentId|videoId)":"([\w-]{11})"/g),m=>m[1]));
  if(channel.value.length>5000000)throw new Error('Channel response too large');
  return parseEpisodes(channel.value,ids);
 }catch{
  const [channel,playlist]=await Promise.allSettled([
   readFeed('https://www.youtube.com/feeds/videos.xml?channel_id=UCsgJv-p60QdrD4TzcusnzQQ'),
   readFeed('https://www.youtube.com/feeds/videos.xml?playlist_id=PL-zZGNV-urVSNmg0T2NPkx8Q_v9OFP-76')
  ]);
  return parsePodcastRSS(channel.status==='fulfilled'?channel.value:'',playlist.status==='fulfilled'?playlist.value:'',saved?.episodes||fallback);
 }
}
export async function getEpisodes():Promise<EpisodeFeed>{
 if(saved&&Date.now()<expires)return saved;if(inflight)return inflight;
 inflight=(async()=>{
  try{
   const edgeCache=(globalThis as unknown as {caches?:{default?:Cache}}).caches?.default;
   const key=new Request('https://soniqcx-experience.aballok.chatgpt.site/__podcast-cache-v3');
   const hit=await edgeCache?.match(key);if(hit){saved=await hit.json() as EpisodeFeed;expires=Date.now()+300000;return saved}
   const episodes=await loadEpisodes();
   saved={episodes,fresh:true,checkedAt:new Date().toISOString()};expires=Date.now()+300000;
   try{await edgeCache?.put(key,Response.json(saved,{headers:{'Cache-Control':'public, max-age=300'}}))}catch{}
   return saved;
  }catch{saved={...(saved||{episodes:fallback,checkedAt:''}),fresh:false};expires=Date.now()+60000;return saved}
 })();try{return await inflight}finally{inflight=undefined}
}
