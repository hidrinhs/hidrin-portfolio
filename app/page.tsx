import { Portfolio } from '@/components/portfolio/portfolio';
import { listProjects } from '@/lib/server/projects';
export const dynamic='force-dynamic';
export default async function Home(){try{return <Portfolio projects={await listProjects()}/>;}catch{return <main className="access-message"><h1>Portfolio gerade nicht erreichbar.</h1><p>Bitte lade die Seite gleich erneut.</p></main>;}}
