import { createClient } from "@supabase/supabase-js";
import type { Project } from "@/lib/projects";

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string;

const ALLOWED_EMAIL = "bvislao95@gmail.com";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

const $ = (id: string) => document.getElementById(id) as HTMLElement;

const btnLogin = $("btnLogin") as HTMLButtonElement;
const btnLogout = $("btnLogout") as HTMLButtonElement;
const btnNew = $("btnNew") as HTMLButtonElement;
const btnSave = $("btnSave") as HTMLButtonElement;
const btnDelete = $("btnDelete") as HTMLButtonElement;
const state = $("state");

const list = $("list");

const name = $("name") as HTMLInputElement;
const badge = $("badge") as HTMLInputElement;
const tagline = $("tagline") as HTMLInputElement;
const description = $("description") as HTMLTextAreaElement;
const highlights = $("highlights") as HTMLInputElement;
const stack = $("stack") as HTMLInputElement;
const repo = $("repo") as HTMLInputElement;
const demo = $("demo") as HTMLInputElement;
const status = $("status") as HTMLSelectElement;
const sort_order = $("sort_order") as HTMLInputElement;
const featured = $("featured") as HTMLInputElement;

let currentId: string | null = null;

function setState(msg: string) {
  state.textContent = msg;
}

async function requireAllowedUser() {
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email ?? "";

  if (!email) {
    setState("Not authenticated.");
    return false;
  }

  if (email !== ALLOWED_EMAIL) {
    await supabase.auth.signOut();
    setState("Access denied: account not allowed.");
    return false;
  }

  setState(`Authenticated as ${email}`);
  return true;
}

async function loadProjects() {
  const ok = await requireAllowedUser();
  if (!ok) return;

  const { data, error } = await supabase
    .from("projects")
    .select("id,name,badge,status,featured,sort_order,updated_at")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    setState(`Error loading projects: ${error.message}`);
    return;
  }

  list.innerHTML = "";
  (data ?? []).forEach((p) => {
    const a = document.createElement("button");
    a.className =
      "w-full text-left rounded-xl border px-4 py-3 text-sm card hover-lift transition";
    a.innerHTML = `<div class="font-medium">${p.name}</div>
                   <div class="text-xs opacity-70">${p.badge} • ${p.status} ${p.featured ? '• Featured' : ''}</div>`;
    a.onclick = () => loadOne(p.id);
    list.appendChild(a);
  });
}

async function loadOne(id: string) {
  const ok = await requireAllowedUser();
  if (!ok) return;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    setState(`Could not load: ${error?.message ?? "not found"}`);
    return;
  }

  currentId = data.id;
  name.value = data.name ?? "";
  badge.value = data.badge ?? "";
  tagline.value = data.tagline ?? "";
  description.value = data.description ?? "";
  highlights.value = (data.highlights ?? []).join(", ");
  stack.value = (data.stack ?? []).join(", ");
  repo.value = data.links?.repo ?? "";
  demo.value = data.links?.demo ?? "";
  status.value = data.status ?? "active";
  sort_order.value = data.sort_order?.toString() ?? "0";
  featured.checked = data.featured ?? false;
}

function clearEditor() {
  currentId = null;
  name.value = "";
  badge.value = "";
  tagline.value = "";
  description.value = "";
  highlights.value = "";
  stack.value = "";
  repo.value = "";
  demo.value = "";
  status.value = "active";
  sort_order.value = "0";
  featured.checked = false;
}

btnLogin.onclick = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/projects-admin` },
  });
};

btnLogout.onclick = async () => {
  await supabase.auth.signOut();
  setState("Logged out.");
  clearEditor();
  list.innerHTML = "";
};

btnNew.onclick = async () => {
  const ok = await requireAllowedUser();
  if (!ok) return;
  clearEditor();
  setState("New project.");
};

btnSave.onclick = async () => {
  const ok = await requireAllowedUser();
  if (!ok) return;

  const n = name.value.trim();
  const b = badge.value.trim();
  const t = tagline.value.trim();
  const d = description.value.trim();

  if (!n || !b || !t || !d) {
    setState("Missing required fields: name, badge, tagline, description.");
    return;
  }

  const highlightsArray = highlights.value
    .split(",")
    .map(h => h.trim())
    .filter(h => h.length > 0);

  const stackArray = stack.value
    .split(",")
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const links: any = {};
  if (repo.value.trim()) links.repo = repo.value.trim();
  if (demo.value.trim()) links.demo = demo.value.trim();

  const payload: any = {
    name: n,
    badge: b,
    tagline: t,
    description: d,
    highlights: highlightsArray,
    stack: stackArray,
    links,
    status: status.value,
    sort_order: parseInt(sort_order.value) || 0,
    featured: featured.checked,
  };

  const { data: userData } = await supabase.auth.getUser();
  payload.author_id = userData.user?.id ?? null;

  const { error } = currentId
    ? await supabase.from("projects").update(payload).eq("id", currentId)
    : await supabase.from("projects").insert(payload);

  if (error) {
    setState(`Error saving: ${error.message}`);
    return;
  }

  setState("Saved ✓");
  await loadProjects();
};

btnDelete.onclick = async () => {
  const ok = await requireAllowedUser();
  if (!ok) return;

  if (!currentId) {
    setState("Select a project.");
    return;
  }

  if (!confirm("Are you sure you want to delete this project?")) {
    return;
  }

  const { error } = await supabase.from("projects").delete().eq("id", currentId);
  if (error) {
    setState(`Error deleting: ${error.message}`);
    return;
  }

  setState("Deleted ✓");
  clearEditor();
  await loadProjects();
};

// On load
(async () => {
  await requireAllowedUser();
  await loadProjects();
})();