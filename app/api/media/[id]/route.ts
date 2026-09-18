import { bindings,database } from "@/lib/server/storage";
import { isAdmin } from "@/lib/server/admin";
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;if(!/^[a-z0-9-]{36}$/.test(id))return new Response('Not found',{status:404});
  try{
    const visible=await database().prepare("SELECT projects.id FROM projects, json_each(projects.media) AS media WHERE projects.published = 1 AND json_extract(media.value, '$.url') = ? LIMIT 1").bind('/api/media/'+id).first();
    if(!visible&&!(await isAdmin()))return new Response('Not found',{status:404});
    const obj=await bindings().BUCKET.get(id,{range:request.headers});if(!obj)return new Response('Not found',{status:404});
    const headers=new Headers({'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'});obj.writeHttpMetadata(headers);headers.set('ETag',obj.httpEtag);
    if(request.headers.has('range')&&obj.range&&'offset' in obj.range){const offset=obj.range.offset??0;const length=obj.range.length??obj.size;headers.set('Content-Range',`bytes ${offset}-${offset+length-1}/${obj.size}`);headers.set('Content-Length',String(length));return new Response(obj.body,{status:206,headers});}
    headers.set('Content-Length',String(obj.size));return new Response(obj.body,{headers});
  }catch(e){console.error('Media retrieval failed',e);return new Response('Media temporarily unavailable',{status:503});}
}

