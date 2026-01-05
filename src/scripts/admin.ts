import { createClient } from "@supabase/supabase-js";

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

const title = $("title") as HTMLInputElement;
const slug = $("slug") as HTMLInputElement;
const excerpt = $("excerpt") as HTMLInputElement;
const content = $("content") as HTMLTextAreaElement;
const published = $("published") as HTMLInputElement;

let currentId: string | null = null;

function setState(msg: string) {
  state.textContent = msg;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function requireAllowedUser() {
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email ?? "";

  if (!email) {
    setState("No autenticado.");
    return false;
  }

  if (email !== ALLOWED_EMAIL) {
    await supabase.auth.signOut();
    setState("Acceso denegado: cuenta no permitida.");
    return false;
  }

  setState(`Autenticado como ${email}`);
  return true;
}

async function loadPosts() {
  const ok = await requireAllowedUser();
  if (!ok) return;

  const { data, error } = await supabase
    .from("blog_posts")
    .select("id,title,slug,published,updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    setState(`Error cargando posts: ${error.message}`);
    return;
  }

  list.innerHTML = "";
  (data ?? []).forEach((p) => {
    const a = document.createElement("button");
    a.className =
      "w-full text-left rounded-xl border px-4 py-3 text-sm hover:-translate-y-0.5 transition";
    a.style.borderColor = "rgb(var(--border))";
    a.style.background = "rgb(var(--bg)/0.35)";
    a.innerHTML = `<div class="font-medium">${p.title}</div>
                   <div class="text-xs opacity-70">${p.slug} • ${p.published ? 'published' : 'draft'}</div>`;
    a.onclick = () => loadOne(p.id);
    list.appendChild(a);
  });
}

async function loadOne(id: string) {
  const ok = await requireAllowedUser();
  if (!ok) return;

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    setState(`No se pudo cargar: ${error?.message ?? "not found"}`);
    return;
  }

  currentId = data.id;
  title.value = data.title ?? "";
  slug.value = data.slug ?? "";
  excerpt.value = data.excerpt ?? "";
content.value = data.content ?? "";
published.checked = data.published === true;
}

function clearEditor() {
  currentId = null;
  title.value = "";
  slug.value = "";
  excerpt.value = "";
  content.value = "";
  published.checked = false;
}

title.addEventListener("input", () => {
  if (!slug.value) slug.value = slugify(title.value);
});

btnLogin.onclick = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/admin` },
  });
};

btnLogout.onclick = async () => {
  await supabase.auth.signOut();
  setState("Sesión cerrada.");
  clearEditor();
  list.innerHTML = "";
};

btnNew.onclick = async () => {
  const ok = await requireAllowedUser();
  if (!ok) return;
  clearEditor();
  setState("Nuevo post.");
};

btnSave.onclick = async () => {
  const ok = await requireAllowedUser();
  if (!ok) return;

  const t = title.value.trim();
  const s = slug.value.trim();
  const ex = excerpt.value.trim();
  const md = content.value.trim();

  if (!t || !s || !md) {
    setState("Faltan campos: título, slug y contenido.");
    return;
  }

  const payload: any = {
    title: t,
    slug: s,
    excerpt: ex || null,
    content: md,
    published: published.checked,
  };

  const { data: userData } = await supabase.auth.getUser();
  payload.author_id = userData.user?.id ?? null;

  const { error } = currentId
    ? await supabase.from("blog_posts").update(payload).eq("id", currentId)
    : await supabase.from("blog_posts").insert(payload);

  if (error) {
    setState(`Error guardando: ${error.message}`);
    return;
  }

  setState("Guardado ✓");
  await loadPosts();
};

btnDelete.onclick = async () => {
  const ok = await requireAllowedUser();
  if (!ok) return;

  if (!currentId) {
    setState("Selecciona un post.");
    return;
  }

  const { error } = await supabase.from("blog_posts").delete().eq("id", currentId);
  if (error) {
    setState(`Error eliminando: ${error.message}`);
    return;
  }

  setState("Eliminado ✓");
  clearEditor();
  await loadPosts();
};

// On load
(async () => {
  await requireAllowedUser();
  await loadPosts();
})();