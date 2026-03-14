import { button } from './components/button.js';
import { textInput, passwordInput } from './components/input.js';
import { otpInput } from './components/otp.js';
import { modal } from './components/modal.js';
import { alertBanner } from './components/alert.js';

const SCREENS = {
  LOGIN: 'login', PASSWORD: 'password', OTP: 'otp', FORGOT_LOGIN: 'forgot-login', LOGIN_RECOVERY_SENT: 'login-recovery-sent',
  FORGOT_PASSWORD: 'forgot-password', RESET_LINK_SENT: 'reset-link-sent', RESET_PASSWORD: 'reset-password', RESET_SUCCESS: 'reset-success',
  ACCOUNT_LOCKED: 'account-locked', SESSION_EXPIRED: 'session-expired', NO_INTERNET: 'no-internet', SERVER_ERROR: 'server-error',
  INVALID_RESET_LINK: 'invalid-reset-link', EXPIRED_RESET_LINK: 'expired-reset-link', AUTH_SUCCESS: 'authenticated',
};

const state = {
  screen: SCREENS.LOGIN,
  username: '', password: '', email: '', otp: '', helpOpen: false,
  passAttempts: 0, otpAttempts: 0, resendIn: 30,
  errors: {}, loading: false, capsLock: false,
};

const app = document.getElementById('app');
let timerId;

const setScreen = (screen) => {
  state.screen = screen;
  state.errors = {};
  if (screen === SCREENS.OTP) {
    state.resendIn = 30;
    clearInterval(timerId);
    timerId = setInterval(() => {
      if (state.screen !== SCREENS.OTP) return;
      state.resendIn = Math.max(0, state.resendIn - 1);
      render();
    }, 1000);
  }
  render();
};

const withLatency = (fn) => {
  state.loading = true;
  render();
  setTimeout(() => {
    state.loading = false;
    fn();
    render();
  }, 350);
};

const pageAlert = () => {
  if (state.screen === SCREENS.NO_INTERNET) return { type: 'warning', message: 'No internet connection. Reconnect and retry.' };
  if (state.screen === SCREENS.SERVER_ERROR) return { type: 'error', message: 'Server unavailable / timeout. Please try again.' };
  if (state.screen === SCREENS.SESSION_EXPIRED) return { type: 'warning', message: 'Your session expired. Please sign in again.' };
  return null;
};

const simpleInfo = (title, body, primaryId = 'back-login', primaryLabel = 'Back to login', secondary = '') => `
  <h2>${title}</h2><p>${body}</p>
  ${button({ id: primaryId, label: primaryLabel })}
  ${secondary}
`;

const links = (arr) => `<div class="links-row">${arr.map(({ id, label }) => `<button id="${id}">${label}</button>`).join('')}</div>`;

const screenBody = () => {
  switch (state.screen) {
    case SCREENS.LOGIN:
      return `
        <h2>Client sign in</h2><p>Enter your username to continue.</p>
        ${textInput({ id: 'username', label: 'Username', value: state.username, placeholder: 'alex_client', error: state.errors.username })}
        ${button({ id: 'continue', label: state.loading ? 'Loading...' : 'Continue', disabled: state.loading })}
        ${links([{ id: 'forgot-login', label: 'Forgot login' }, { id: 'forgot-password', label: 'Forgot password' }, { id: 'help', label: 'Help' }])}
      `;
    case SCREENS.PASSWORD:
      return `
        <h2>Password</h2><p>Signing in as <strong>${state.username || 'username'}</strong>.</p>
        ${passwordInput({ id: 'password', label: 'Password', value: state.password, error: state.errors.password })}
        ${state.capsLock ? alertBanner({ type: 'warning', message: 'Caps Lock is ON' }) : ''}
        ${button({ id: 'signin', label: state.loading ? 'Loading...' : 'Sign in', disabled: state.loading })}
        ${links([{ id: 'forgot-password', label: 'Forgot password' }, { id: 'back', label: 'Back' }, { id: 'lock-demo', label: 'Lock demo' }])}
      `;
    case SCREENS.OTP:
      return `
        <h2>SMS verification</h2><p>We sent a 6-digit code to phone ending in ••42.</p>
        ${otpInput({ value: state.otp, error: state.errors.otp })}
        ${button({ id: 'verify', label: state.loading ? 'Loading...' : 'Verify', disabled: state.loading })}
        ${button({ id: 'resend', label: 'Resend code', variant: 'secondary', disabled: state.resendIn > 0 })}
        <p class="muted">${state.resendIn > 0 ? `Resend in ${state.resendIn}s` : 'You can resend now.'}</p>
        ${links([{ id: 'lock-demo', label: 'Lock demo' }, { id: 'cancel', label: 'Cancel' }])}
      `;
    case SCREENS.FORGOT_LOGIN:
      return `<h2>Forgot login</h2><p>Enter your email to recover username.</p>
      ${textInput({ id: 'email', label: 'Email', value: state.email, placeholder: 'name@example.com' })}
      ${button({ id: 'send-login-recovery', label: 'Send recovery' })}
      ${button({ id: 'back-login', label: 'Back', variant: 'secondary' })}`;
    case SCREENS.LOGIN_RECOVERY_SENT:
      return simpleInfo('Login recovery sent', 'If matched, recovery instructions were sent.');
    case SCREENS.FORGOT_PASSWORD:
      return `<h2>Forgot password</h2><p>Request reset with your username.</p>
      ${textInput({ id: 'forgot-user', label: 'Username', value: state.username, placeholder: 'alex_client' })}
      ${button({ id: 'send-reset-link', label: 'Send reset link' })}
      ${button({ id: 'back-login', label: 'Back', variant: 'secondary' })}`;
    case SCREENS.RESET_LINK_SENT:
      return simpleInfo('Reset link sent', 'Check your email/SMS for reset link.', 'open-reset', 'Open reset form', button({ id: 'back-login', label: 'Back to login', variant: 'secondary' }));
    case SCREENS.RESET_PASSWORD:
      return `<h2>Reset password</h2>
      ${passwordInput({ id: 'password', label: 'New password', value: state.password })}
      ${button({ id: 'save-password', label: 'Save new password' })}
      ${links([{ id: 'invalid-link', label: 'Invalid link state' }, { id: 'expired-link', label: 'Expired link state' }])}`;
    case SCREENS.RESET_SUCCESS:
      return simpleInfo('Password updated', 'Your password has been reset.');
    case SCREENS.ACCOUNT_LOCKED:
      return simpleInfo('Account locked', '5 failed attempts. Try again in 20 minutes.');
    case SCREENS.SESSION_EXPIRED:
      return simpleInfo('Session expired', 'For security, your session has ended.');
    case SCREENS.NO_INTERNET:
      return simpleInfo('No internet', 'You appear offline.', 'back-login', 'Retry');
    case SCREENS.SERVER_ERROR:
      return simpleInfo('Server error', 'Timeout/server unavailable.', 'back-login', 'Try again');
    case SCREENS.INVALID_RESET_LINK:
      return simpleInfo('Invalid reset link', 'The reset link is invalid.', 'go-forgot-pass', 'Request new link');
    case SCREENS.EXPIRED_RESET_LINK:
      return simpleInfo('Expired reset link', 'This reset link has expired.', 'go-forgot-pass', 'Request new link');
    case SCREENS.AUTH_SUCCESS:
      return simpleInfo('Authenticated', 'Welcome to product landing (mock).', 'signout', 'Sign out');
    default:
      return '';
  }
};

const render = () => {
  const alert = pageAlert();
  app.innerHTML = `
  <div class="app-shell">
    <header><h1>Client Authentication Prototype</h1></header>
    <div class="device-grid">
      <section class="screen-shell"><span class="device-tag">Desktop web</span>${alert ? alertBanner(alert) : ''}${screenBody()}</section>
      <section class="screen-shell mobile"><span class="device-tag">Mobile web</span>${alert ? alertBanner(alert) : ''}${screenBody()}</section>
    </div>
    <div class="mock-nav"><p>Mock state triggers:</p>${links([
      { id: 'no-internet', label: 'No internet' },
      { id: 'server-error', label: 'Server error' },
      { id: 'session-expired', label: 'Session expired' },
      { id: 'invalid-reset-link', label: 'Invalid reset link' },
      { id: 'expired-reset-link', label: 'Expired reset link' },
    ])}</div>
  </div>
  ${modal({ open: state.helpOpen })}
  `;
  bindEvents();
};

const bindEvents = () => {
  document.getElementById('username')?.addEventListener('input', (e) => (state.username = e.target.value));
  document.getElementById('email')?.addEventListener('input', (e) => (state.email = e.target.value));
  document.getElementById('forgot-user')?.addEventListener('input', (e) => (state.username = e.target.value));
  document.getElementById('password')?.addEventListener('input', (e) => (state.password = e.target.value));
  document.getElementById('password')?.addEventListener('keyup', (e) => {
    state.capsLock = e.getModifierState && e.getModifierState('CapsLock');
    render();
  });

  document.getElementById('toggle-password')?.addEventListener('click', () => {
    const input = document.getElementById('password');
    const toggle = document.getElementById('toggle-password');
    if (!input || !toggle) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    toggle.textContent = show ? 'Hide' : 'Show';
  });

  document.querySelectorAll('[data-otp-index]').forEach((node) => {
    node.addEventListener('input', (e) => {
      const idx = Number(e.target.dataset.otpIndex);
      const clean = e.target.value.replace(/\D/g, '').slice(0, 1);
      const chars = state.otp.padEnd(6, ' ').split('');
      chars[idx] = clean || ' ';
      state.otp = chars.join('').trimEnd();
      if (clean && idx < 5) document.querySelector(`[data-otp-index="${idx + 1}"]`)?.focus();
    });
    node.addEventListener('keydown', (e) => {
      const idx = Number(e.target.dataset.otpIndex);
      if (e.key === 'Backspace' && !e.target.value && idx > 0) {
        document.querySelector(`[data-otp-index="${idx - 1}"]`)?.focus();
      }
    });
    node.addEventListener('paste', (e) => {
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
      if (!pasted) return;
      e.preventDefault();
      state.otp = pasted;
      render();
    });
  });

  const on = (id, handler) => document.getElementById(id)?.addEventListener('click', handler);
  on('continue', () => {
    state.errors = {};
    if (!state.username.trim()) {
      state.errors.username = 'Enter your username';
      return render();
    }
    withLatency(() => setScreen(SCREENS.PASSWORD));
  });
  on('signin', () => {
    state.errors = {};
    if (!state.password) {
      state.errors.password = 'Enter your password';
      return render();
    }
    if (state.password === 'pass123!') {
      withLatency(() => {
        state.password = '';
        setScreen(SCREENS.OTP);
      });
      return;
    }
    state.passAttempts += 1;
    state.password = '';
    if (state.passAttempts >= 5) return setScreen(SCREENS.ACCOUNT_LOCKED);
    state.errors.password = `Incorrect password (${state.passAttempts}/5 attempts)`;
    render();
  });
  on('verify', () => {
    state.errors = {};
    if (state.otp.length !== 6) {
      state.errors.otp = 'Enter 6-digit code';
      return render();
    }
    if (state.otp === '123456') return withLatency(() => setScreen(SCREENS.AUTH_SUCCESS));
    state.otpAttempts += 1;
    state.otp = '';
    if (state.otpAttempts >= 5) return setScreen(SCREENS.ACCOUNT_LOCKED);
    state.errors.otp = `Invalid code (${state.otpAttempts}/5 attempts)`;
    render();
  });

  on('forgot-login', () => setScreen(SCREENS.FORGOT_LOGIN));
  on('forgot-password', () => setScreen(SCREENS.FORGOT_PASSWORD));
  on('help', () => { state.helpOpen = true; render(); });
  on('send-login-recovery', () => setScreen(SCREENS.LOGIN_RECOVERY_SENT));
  on('send-reset-link', () => setScreen(SCREENS.RESET_LINK_SENT));
  on('open-reset', () => setScreen(SCREENS.RESET_PASSWORD));
  on('save-password', () => setScreen(SCREENS.RESET_SUCCESS));
  on('back-login', () => { state.password = ''; state.otp = ''; setScreen(SCREENS.LOGIN); });
  on('back', () => setScreen(SCREENS.LOGIN));
  on('cancel', () => setScreen(SCREENS.LOGIN));
  on('signout', () => setScreen(SCREENS.LOGIN));
  on('lock-demo', () => setScreen(SCREENS.ACCOUNT_LOCKED));
  on('resend', () => { state.resendIn = 30; render(); });
  on('invalid-link', () => setScreen(SCREENS.INVALID_RESET_LINK));
  on('expired-link', () => setScreen(SCREENS.EXPIRED_RESET_LINK));
  on('go-forgot-pass', () => setScreen(SCREENS.FORGOT_PASSWORD));

  on('no-internet', () => setScreen(SCREENS.NO_INTERNET));
  on('server-error', () => setScreen(SCREENS.SERVER_ERROR));
  on('session-expired', () => setScreen(SCREENS.SESSION_EXPIRED));
  on('invalid-reset-link', () => setScreen(SCREENS.INVALID_RESET_LINK));
  on('expired-reset-link', () => setScreen(SCREENS.EXPIRED_RESET_LINK));

  on('close-help', () => { state.helpOpen = false; render(); });
  on('help-overlay', () => { state.helpOpen = false; render(); });
  document.querySelector('.modal-card')?.addEventListener('click', (e) => e.stopPropagation());
  on('open-chat', () => window.alert('Mock support chat launched'));
};

render();
