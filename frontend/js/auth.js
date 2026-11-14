// auth.js - Patron Authentication & Registration
// Built by Shreya Chaudhary

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.auth-form');
  const tabSignIn = document.getElementById('tab-signin');
  const tabRegister = document.getElementById('tab-register');
  const groupName = document.getElementById('group-name');
  const authTitle = document.getElementById('auth-title');
  const authSubtitle = document.getElementById('auth-subtitle');
  const submitBtn = document.getElementById('auth-submit-btn');

  let mode = 'signin'; // 'signin' or 'register'

  // Helper to download JSON session file
  function downloadJson(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  }

  // Switch between Sign In and Register tabs
  function setMode(newMode) {
    mode = newMode;
    const oldMsg = form ? form.querySelector('.form-msg') : null;
    if (oldMsg) oldMsg.remove();

    if (mode === 'register') {
      if (tabRegister) { tabRegister.className = 'btn small'; tabRegister.style.background = 'var(--gold)'; tabRegister.style.color = '#111'; }
      if (tabSignIn) { tabSignIn.className = 'btn small outline'; tabSignIn.style.background = 'transparent'; tabSignIn.style.color = 'var(--gold)'; }
      if (groupName) groupName.style.display = 'flex';
      if (authTitle) authTitle.textContent = 'PATRON REGISTRATION';
      if (authSubtitle) authSubtitle.textContent = 'Create your Royal Patron account to earn dining rewards and personalized reservations.';
      if (submitBtn) submitBtn.textContent = 'CREATE ACCOUNT';
    } else {
      if (tabSignIn) { tabSignIn.className = 'btn small'; tabSignIn.style.background = 'var(--gold)'; tabSignIn.style.color = '#111'; }
      if (tabRegister) { tabRegister.className = 'btn small outline'; tabRegister.style.background = 'transparent'; tabRegister.style.color = 'var(--gold)'; }
      if (groupName) groupName.style.display = 'none';
      if (authTitle) authTitle.textContent = 'ACCOUNT SIGN IN';
      if (authSubtitle) authSubtitle.textContent = 'Sign in to access your table bookings, order history, and exclusive member privileges.';
      if (submitBtn) submitBtn.textContent = 'SIGN IN';
    }
  }

  if (tabSignIn) tabSignIn.addEventListener('click', () => setMode('signin'));
  if (tabRegister) tabRegister.addEventListener('click', () => setMode('register'));

  // Check if patron is already signed in
  const currentUser = localStorage.getItem('saffron_current_user');
  if (currentUser) {
    try {
      const user = JSON.parse(currentUser);
      const card = document.querySelector('.auth-card');
      if (card && user.email) {
        const welcomeBadge = document.createElement('div');
        welcomeBadge.className = 'form-msg success';
        welcomeBadge.style.marginBottom = '20px';
        welcomeBadge.innerHTML = `Signed in as <strong>${user.name || user.email}</strong> (${user.role || 'Patron'}). <a href="#" id="auth-signout" style="text-decoration: underline; margin-left: 8px; color: var(--gold);">Sign Out</a>`;
        card.insertBefore(welcomeBadge, card.querySelector('.auth-tabs') || form);

        document.getElementById('auth-signout')?.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('saffron_current_user');
          window.location.reload();
        });
      }
    } catch (e) {}
  }

  // Handle form submission (Login or Register)
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl = document.getElementById('name');
      const emailEl = document.getElementById('email');
      const passEl = document.getElementById('password');

      const name = nameEl ? nameEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const password = passEl ? passEl.value.trim() : '';

      // Clear previous error messages
      const oldMsg = form.querySelector('.form-msg');
      if (oldMsg) oldMsg.remove();
      [emailEl, passEl, nameEl].forEach(el => el && el.classList.remove('input-error'));

      const status = document.createElement('div');

      // Validation
      if (mode === 'register' && !name) {
        status.className = 'form-msg error';
        status.textContent = 'Please provide your full name.';
        if (nameEl) nameEl.classList.add('input-error');
        form.appendChild(status);
        return;
      }

      if (!email || !password) {
        status.className = 'form-msg error';
        status.textContent = 'Please provide both your email and password.';
        if (!email && emailEl) emailEl.classList.add('input-error');
        if (!password && passEl) passEl.classList.add('input-error');
        form.appendChild(status);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.className = 'form-msg error';
        status.textContent = 'Please enter a valid email address.';
        if (emailEl) emailEl.classList.add('input-error');
        form.appendChild(status);
        return;
      }

      if (password.length < 6) {
        status.className = 'form-msg error';
        status.textContent = 'Password must be at least 6 characters long.';
        if (passEl) passEl.classList.add('input-error');
        form.appendChild(status);
        return;
      }

      status.className = 'form-msg';
      status.textContent = mode === 'register' ? 'Creating your account...' : 'Signing in...';
      form.appendChild(status);

      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const payload = mode === 'register' ? { name, email, password } : { email, password };

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.json().then(data => ({ ok: res.ok, status: res.status, data })))
      .then(({ ok, status: httpStatus, data }) => {
        if (!ok) {
          status.className = 'form-msg error';
          status.textContent = data.message || 'Authentication failed. Please check credentials.';
          return;
        }

        const user = data.user || { name: name || 'Patron', email, role: 'patron' };
        const sessionData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || 'patron',
          loggedInAt: new Date().toLocaleString()
        };

        localStorage.setItem('saffron_current_user', JSON.stringify(sessionData));
        downloadJson(sessionData, 'user_session.json');

        status.className = 'form-msg success';
        if (mode === 'register') {
          status.innerHTML = `<strong>Account Created!</strong><br>Welcome, ${user.name}! Your account is now active.`;
        } else {
          status.innerHTML = `<strong>Welcome back, ${user.name || user.email}!</strong><br>Successfully signed in.`;
        }

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      })
      .catch(() => {
        // Fallback for offline mode
        const sessionData = {
          name: name || 'Patron',
          email,
          role: 'patron',
          loggedInAt: new Date().toLocaleString()
        };
        localStorage.setItem('saffron_current_user', JSON.stringify(sessionData));
        downloadJson(sessionData, 'user_session.json');

        status.className = 'form-msg success';
        status.innerHTML = `<strong>Signed in!</strong> (Offline fallback mode).`;
        setTimeout(() => window.location.reload(), 1200);
      });
    });
  }

  // Export User Session button
  const exportBtn = document.getElementById('export-user-json');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const savedUser = localStorage.getItem('saffron_current_user');
      if (!savedUser) {
        alert('No active session found. Please sign in first.');
      } else {
        downloadJson(JSON.parse(savedUser), 'user_session.json');
      }
    });
  }
});
