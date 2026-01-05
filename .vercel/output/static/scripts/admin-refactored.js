import { adminManager } from '../lib/admin-manager';

// DOM element references
const $ = (id: string) => document.getElementById(id) as HTMLElement;

const btnLogin = $("btnLogin") as HTMLButtonElement;
const btnLogout = $("btnLogout") as HTMLButtonElement;
const btnNew = $("btnNew") as HTMLButtonElement;
const btnSave = $("btnSave") as HTMLButtonElement;
const btnDelete = $("btnDelete") as HTMLButtonElement;
const state = $("state");
const list = $("list");
const postCount = $("postCount");

// Form elements
const title = $("title") as HTMLInputElement;
const slug = $("slug") as HTMLInputElement;
const excerpt = $("excerpt") as HTMLInputElement;
const content = $("content") as HTMLTextAreaElement;
const published = $("published") as HTMLInputElement;

let currentPost: any = null;

// Utility functions
function setState(msg: string) {
  if (state) state.textContent = msg;
  console.log('[Admin]', msg);
}

function clearForm() {
  currentPost = null;
  if (title) title.value = '';
  if (slug) slug.value = '';
  if (excerpt) excerpt.value = '';
  if (content) content.value = '';
  if (published) published.checked = false;
}

function slugifyEvent() {
  if (title && slug && !slug.value) {
    slug.value = adminManager.slugify(title.value);
  }
}

async function updatePostCount() {
  const posts = await adminManager.loadBlogPosts();
  if (postCount) {
    postCount.textContent = `${posts.length} posts`;
  }
}

async function renderPostList() {
  const posts = await adminManager.loadBlogPosts();
  if (!list) return;
  
  list.innerHTML = '';
  posts.forEach((post) => {
    const button = document.createElement('button');
    button.className = 'w-full text-left rounded-xl border px-4 py-3 text-sm hover:-translate-y-0.5 transition';
    button.style.borderColor = 'rgb(var(--border))';
    button.style.background = 'rgb(var(--bg)/0.35)';
    button.innerHTML = `
      <div class="font-medium">${post.title}</div>
      <div class="text-xs opacity-70">${post.slug} • ${post.published ? 'published' : 'draft'}</div>
    `;
    button.onclick = () => loadPost(post.id);
    list.appendChild(button);
  });
  
  updatePostCount();
}

async function loadPost(id: string) {
  const post = await adminManager.loadBlogPost(id);
  if (!post) {
    setState('Post no encontrado');
    return;
  }

  currentPost = post;
  if (title) title.value = post.title || '';
  if (slug) slug.value = post.slug || '';
  if (excerpt) excerpt.value = post.excerpt || '';
  if (content) content.value = post.content || '';
  if (published) published.checked = post.published || false;
  
  setState('Post cargado');
}

async function savePost() {
  if (!title || !slug || !content) {
    setState('Faltan campos: título, slug y contenido');
    return;
  }

  const postData = {
    title: title.value.trim(),
    slug: slug.value.trim(),
    excerpt: excerpt.value.trim() || null,
    content: content.value.trim(),
    published: published.checked
  };

  const savedPost = currentPost 
    ? await adminManager.updateBlogPost(currentPost.id, postData)
    : await adminManager.createBlogPost(postData);

  if (savedPost) {
    setState('Guardado ✓');
    clearForm();
    await renderPostList();
  } else {
    setState('Error al guardar');
  }
}

async function deletePost() {
  if (!currentPost) {
    setState('Selecciona un post');
    return;
  }

  if (confirm('¿Estás seguro de eliminar este post?')) {
    const success = await adminManager.deleteBlogPost(currentPost.id);
    
    if (success) {
      setState('Eliminado ✓');
      clearForm();
      await renderPostList();
    } else {
      setState('Error al eliminar');
    }
  }
}

async function logout() {
  await adminManager.signOut();
  setState('Sesión cerrada');
  clearForm();
  if (list) list.innerHTML = '';
  updatePostCount();
}

// Event handlers
btnLogin?.addEventListener('click', async () => {
  setState('Iniciando login...');
  const result = await adminManager.signInWithOAuth('google');
  
  if (result.error) {
    setState('Error en OAuth: ' + result.error.message);
  } else {
    setState('Redirigiendo a Google...');
  }
});

btnLogout?.addEventListener('click', logout);

btnNew?.addEventListener('click', () => {
  clearForm();
  setState('Nuevo post');
});

btnSave?.addEventListener('click', savePost);

btnDelete?.addEventListener('click', deletePost);

title?.addEventListener('input', slugifyEvent);

// Initialize on load
(async () => {
  console.log('[Admin] Initializing...');
  
  try {
    const session = await adminManager.getSession();
    if (session?.user?.email) {
      setState(`Autenticado como ${session.user.email}`);
      await renderPostList();
    } else {
      setState('No autenticado');
    }
  } catch (err) {
    console.error('[Admin] Initialization error:', err);
    setState('Error de inicialización');
  }
})();