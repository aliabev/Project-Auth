# Client Authentication Flow Prototype

Clickable front-end prototype for a **client-only** authentication journey across desktop web and mobile web.

## How to run

No backend is required.

```bash
python3 -m http.server 4173
```

Then open: `http://localhost:4173`

## Implemented screens/states

1. Login
2. Password
3. SMS 2FA
4. Forgot login
5. Login recovery sent
6. Forgot password
7. Reset link sent
8. Reset password
9. Reset success
10. Account locked
11. Session expired
12. No internet
13. Server error (timeout/server unavailable)
14. Invalid reset link
15. Expired reset link
16. Help modal (opened from Login)
17. Mock authenticated landing state after successful 2FA

## Behavior included

- Happy path: Login → Password → 2FA → Authenticated.
- Recovery paths:
  - Login → Forgot login → Login recovery sent.
  - Login/Password → Forgot password → Reset link sent → Reset password → Reset success.
- Username is the primary identifier and persists after auth errors.
- Password is cleared after failed submit.
- OTP is 6 digits with paste + backspace support.
- Account lock after 5 wrong password attempts (20-minute copy) and 5 wrong OTP attempts.
- Resend timer on 2FA screen.
- Help modal with support phone and support chat button.
- Mock state triggers for offline, timeout/server unavailable, generic server error handling, invalid/expired reset links, and session expiration.

## File structure

- `index.html` — app entry.
- `src/app.js` — centralized mock auth flow + event wiring (state-machine-like transitions).
- `src/components/button.js` — reusable button renderer.
- `src/components/input.js` — reusable text/password input renderers.
- `src/components/otp.js` — reusable segmented OTP renderer.
- `src/components/modal.js` — reusable modal renderer.
- `src/components/alert.js` — reusable alert/banner renderer.
- `src/styles.css` — responsive desktop/mobile layout and UI states.
