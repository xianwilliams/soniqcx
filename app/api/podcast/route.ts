import {getEpisodes} from '../../podcast/feed';
export async function GET(){const data=await getEpisodes();return Response.json(data,{headers:{'Cache-Control':data.fresh?'public, max-age=300':'no-store'}})}
