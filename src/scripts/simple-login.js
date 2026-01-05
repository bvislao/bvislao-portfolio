// Simple Google login test
console.log('Script loaded');

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');
  
  const btnLogin = document.getElementById('btnLogin');
  console.log('Login button:', btnLogin);
  
  if (btnLogin) {
    btnLogin.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log('Login button clicked!');
      
      // Check if Supabase is available
      if (typeof window.supabase === 'undefined') {
        console.error('Supabase not loaded');
        alert('Error: Supabase not loaded. Check console for details.');
        return;
      }
      
      try {
        const { data, error } = await window.supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { 
            redirectTo: `${window.location.origin}/admin`
          }
        });
        
        console.log('OAuth result:', { data, error });
        
        if (error) {
          console.error('OAuth error:', error);
          alert('OAuth Error: ' + error.message);
        } else {
          console.log('Redirecting to Google...');
        }
      } catch (err) {
        console.error('Login error:', err);
        alert('Login Error: ' + err.message);
      }
    });
  } else {
    console.error('Login button not found');
  }
});