import { getChatGPTUser } from "@/app/chatgpt-auth";
import { bindings } from "./storage";

export async function isAdmin() {
  const user = await getChatGPTUser();
  const allowed = bindings().ADMIN_EMAIL?.trim().toLowerCase();
  return !!(allowed && user && user.email.toLowerCase() === allowed);
}
export async function authorize(request?: Request) {
  if (!(await isAdmin())) return Response.json({error:"Bitte mit dem freigeschalteten Admin-Konto anmelden."},{status:403});
  if (request && !["GET","HEAD"].includes(request.method)) {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin) return Response.json({error:"Ungültiger Anfrageursprung."},{status:403});
  }
  return null;
}
