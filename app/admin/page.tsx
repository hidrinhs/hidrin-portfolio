import { requireChatGPTUser,chatGPTSignOutPath } from '@/app/chatgpt-auth';
import { isAdmin } from '@/lib/server/admin';
import { listProjects } from '@/lib/server/projects';
import { AdminEditor } from '@/components/portfolio/admin-editor';
export const dynamic='force-dynamic';
export default async function Admin(){await requireChatGPTUser('/admin');if(!(await isAdmin()))return <main className="access-message"><h1>Zugriff geschützt</h1><p>Dieses Konto ist nicht für die Projektverwaltung freigeschaltet.</p><a href={chatGPTSignOutPath('/admin')}>Mit anderem Konto anmelden</a></main>;try{const projects=await listProjects(true);return <main className="admin-page"><header><a href="/">HS / Portfolio</a><h1>Projektverwaltung</h1><a href={chatGPTSignOutPath('/')}>Abmelden</a></header><AdminEditor initial={projects}/></main>;}catch{return <main className="access-message"><h1>Projekte gerade nicht erreichbar</h1><p>Bitte lade die Seite gleich erneut.</p></main>;}}
