import { database } from "./storage";
import type { Project } from "../project-types";
import { initialProjects } from '../initial-projects';
type Row = Omit<Project,"media"|"published"|"updatedAt"> & {media:string;published:number;updated_at:string};
function decode(row:Row):Project {return {...row,media:JSON.parse(row.media),published:row.published===1,updatedAt:row.updated_at};}
export async function listProjects(admin=false) {
  const result=await database().prepare('SELECT * FROM projects ORDER BY position ASC, updated_at DESC').all<Row>();
  const merged=new Map(initialProjects.map(p=>[p.id,p]));
  for(const row of result.results)merged.set(row.id,decode(row));
  return [...merged.values()].filter(p=>admin||p.published).sort((a,b)=>a.position-b.position);
}
export async function findProject(id:string,admin=false) {
  const row=await database().prepare('SELECT * FROM projects WHERE id = ?').bind(id).first<Row>();
  const project=row?decode(row):initialProjects.find(p=>p.id===id);
  return project&&(admin||project.published)?project:null;
}
