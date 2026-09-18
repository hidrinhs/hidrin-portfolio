import { z } from "zod";
import { authorize } from "@/lib/server/admin";
import { database } from "@/lib/server/storage";
import { listProjects } from "@/lib/server/projects";

const schema=z.object({
  id:z.string().regex(/^[a-z0-9-]{1,80}$/),
  title:z.string().trim().min(1).max(140),category:z.string().trim().min(1).max(80),
  summary:z.string().trim().max(500),body:z.string().max(30000),
  media:z.array(z.object({url:z.string().regex(/^\/(?:api\/media\/[a-z0-9-]+|portfolio\/[a-zA-Z0-9_.-]+)$/),kind:z.enum(['image','video']),alt:z.string().max(400)})).max(30),
  published:z.boolean(),position:z.number().int().min(0).max(9999),
});
export async function GET(){const denied=await authorize();if(denied)return denied;try{return Response.json(await listProjects(true),{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'Projekte können gerade nicht geladen werden.'},{status:503});}}
export async function PUT(request:Request){
  const denied=await authorize(request);if(denied)return denied;
  try{
    const text=await request.text();if(text.length>70000)return Response.json({error:'Projekttext zu groß.'},{status:413});
    const parsed=schema.safeParse(JSON.parse(text));if(!parsed.success)return Response.json({error:'Bitte Titel, Kategorie und gültige Medien angeben.'},{status:400});
    const p=parsed.data;
    for(const m of p.media){if(m.url.startsWith('/api/media/')){const found=await database().prepare('SELECT id FROM uploads WHERE id = ?').bind(m.url.split('/').pop()).first();if(!found)return Response.json({error:'Ein Medium fehlt. Bitte erneut hochladen.'},{status:400});}}
    await database().prepare('INSERT INTO projects (id,title,category,summary,body,media,published,position,updated_at) VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,category=excluded.category,summary=excluded.summary,body=excluded.body,media=excluded.media,published=excluded.published,position=excluded.position,updated_at=excluded.updated_at').bind(p.id,p.title,p.category,p.summary,p.body,JSON.stringify(p.media),p.published?1:0,p.position,new Date().toISOString()).run();
    return Response.json({ok:true});
  }catch(e){console.error('Project save failed',e);return Response.json({error:'Speichern nicht möglich. Deine Eingaben bleiben erhalten.'},{status:503});}
}
