console.log('Simple admin JS loaded');

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');
  
  const status = document.getElementById('status');
  const debugInfo = document.getElementById('debugInfo');
  
  function addDebug(message) {
    if (debugInfo) {
      const div = document.createElement('div');
      div.textContent = message;
      debugInfo.appendChild(div);
    }
  }
  
  function setStatus(message) {
    if (status) status.textContent = message;
  }
  
  addDebug('Environment Check:');
  addDebug('PUBLIC_SUPABASE_URL: ' + (import.meta.env.PUBLIC_SUPABASE_URL || 'NOT SET'));
  addDebug('PUBLIC_SUPABASE_ANON_KEY: ' + (import.meta.env.PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'));
  
  // Simple Supabase initialization
  const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    setStatus('❌ Error: Supabase environment variables not set');
    addDebug('❌ Cannot initialize Supabase');
    return;
  }
  
  // Initialize Supabase with error handling
  let supabase;
  import('@supabase/supabase-js').then(({ createClient }) => {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
    window.supabase = supabase;
    addDebug('✅ Supabase initialized successfully');
    setStatus('✅ Supabase ready');
    setupButtons();
  }).catch(err => {
    addDebug('❌ Failed to import Supabase: ' + err.message);
    setStatus('❌ Failed to load Supabase');
  });
  
  function setupButtons() {
    const googleBtn = document.getElementById('googleLogin');
    const checkBtn = document.getElementById('checkAuth');
    const logoutBtn = document.getElementById('logout');
    
    if (!googleBtn || !window.supabase) {
      setStatus('❌ Buttons or Supabase not available');
      return;
    }
    
    if (googleBtn) {
      googleBtn.addEventListener('click', async () => {
        setStatus('🔄 Initiating Google login...');
        addDebug('Google login button clicked');
        
        try {
          const { data, error } = await window.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin + '/admin'
            }
          });
          
          addDebug('OAuth call completed');
          addDebug('Data: ' + JSON.stringify(data));
          addDebug('Error: ' + JSON.stringify(error));
          
          if (error) {
            setStatus('❌ OAuth Error: ' + error.message);
            addDebug('❌ OAuth failed: ' + error.message);
          } else {
            setStatus('🔄 Redirecting to Google...');
            addDebug('✅ Redirecting to Google for authentication');
          }
        } catch (err) {
          setStatus('❌ Login Error: ' + String(err));
          addDebug('❌ Exception: ' + String(err));
        }
      });
    }
    
    if (checkBtn) {
      checkBtn.addEventListener('click', async () => {
        setStatus('🔄 Checking session...');
        addDebug('Session check button clicked');
        
        try {
          const { data: { session }, error } = await window.supabase.auth.getSession();
          
          if (error) {
            setStatus('❌ Session Error: ' + error.message);
            addDebug('❌ Session error: ' + error.message);
          } else if (session) {
            setStatus('✅ Session active: ' + session.user.email);
            addDebug('✅ User email: ' + session.user.email);
            addDebug('✅ User ID: ' + session.user.id);
          } else {
            setStatus('ℹ️ No active session');
            addDebug('ℹ️ No session found');
          }
        } catch (err) {
          setStatus('❌ Check Error: ' + String(err));
          addDebug('❌ Session check exception: ' + String(err));
        }
      });
    }
    
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        setStatus('🔄 Signing out...');
        addDebug('Logout button clicked');
        
        try {
          const { error } = await window.supabase.auth.signOut();
          
          if (error) {
            setStatus('❌ Logout Error: ' + error.message);
            addDebug('❌ Logout failed: ' + error.message);
          } else {
            setStatus('✅ Signed out successfully');
            addDebug('✅ Logout successful');
          }
        } catch (err) {
          setStatus('❌ Logout Error: ' + String(err));
          addDebug('❌ Logout exception: ' + String(err));
        }
      });
    }
    
    // Auto-check session on load
    setTimeout(async () => {
      addDebug('Auto-checking session...');
      try {
        const { data: { session } } = await window.supabase.auth.getSession();
        if (session) {
          setStatus('✅ Already logged in: ' + session.user.email);
          addDebug('✅ Auto-detected session for: ' + session.user.email);
          
          if (session.user.email === 'bvislao95@gmail.com') {
            addDebug('✅ Email matches allowed user');
            window.location.href = '/admin';
          } else {
            addDebug('❌ Email does not match allowed user');
            setStatus('❌ Email not authorized');
          }
        } else {
          setStatus('ℹ️ Not logged in');
          addDebug('ℹ️ No active session found');
        }
      } catch (err) {
        addDebug('❌ Auto session check failed: ' + String(err));
      }
    }, 1000);
  }
});