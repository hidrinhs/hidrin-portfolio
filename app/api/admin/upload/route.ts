import { authorize } from "@/lib/server/admin";
import { bindings, database } from "@/lib/server/storage";
const allowed=new Set(['image/jpeg','image/png','image/webp','video/mp4','video/webm']);
const MAX=40*1024*1024;
export async function POST(request:Request){
  const denied=await authorize(request);if(denied)return denied;
  const size=Number(request.headers.get('content-length'));
  if(!size||size>MAX+100000)return Response.json({error:'Maximal 40 MB pro Datei.'},{status:413});
  try{
    const data=await request.formData();const file=data.get('file');
    if(!(file instanceof File)||!allowed.has(file.type)||file.size>MAX||!file.size)return Response.json({error:'Erlaubt: JPG, PNG, WebP, MP4 oder WebM bis 40 MB.'},{status:400});
    const bytes=new Uint8Array(await file.arrayBuffer());
    const signature=(file.type==='image/png'&&bytes[0]===137&&bytes[1]===80)||(file.type==='image/jpeg'&&bytes[0]===255&&bytes[1]===216)||(file.type==='image/webp'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP')||(file.type==='video/mp4'&&new TextDecoder().decode(bytes.slice(4,8))==='ftyp')||(file.type==='video/webm'&&bytes[0]===26&&bytes[1]===69);
    if(!signature)return Response.json({error:'Dateiformat konnte nicht bestätigt werden.'},{status:400});
    const id=crypto.randomUUID();await bindings().BUCKET.put(id,bytes,{httpMetadata:{contentType:file.type}});
    try{await database().prepare('INSERT INTO uploads (id,filename,content_type,size,created_at) VALUES (?,?,?,?,?)').bind(id,file.name.slice(0,200),file.type,file.size,new Date().toISOString()).run();}catch(e){await bindings().BUCKET.delete(id);throw e;}
    return Response.json({url:'/api/media/'+id,kind:file.type.startsWith('video/')?'video':'image',alt:''});
  }catch(e){console.error('Upload failed',e);return Response.json({error:'Upload fehlgeschlagen. Bitte erneut versuchen.'},{status:503});}
}
