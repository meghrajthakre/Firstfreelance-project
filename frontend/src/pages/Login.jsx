import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Captcha helpers ──────────────────────────────────────────────────────────

/** Returns a random 4-digit string, e.g. "7241" */
function generateCaptcha() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

/** Per-digit visual styles — alternates to look hand-drawn / bot-resistant */
const CHAR_COLORS = ['text-emerald-600', 'text-blue-500'];
const CHAR_SIZES  = ['text-[26px]',      'text-[22px]'];
const CHAR_STYLES = ['not-italic',       'italic'];

// ── Shared input className ───────────────────────────────────────────────────
const INPUT_CLS = `
  block w-full px-4 py-3 rounded-md
  border border-[var(--border)] bg-[var(--input-bg)]
  text-[var(--text-dark)] text-[15px]
  outline-none transition-all
  focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30
  placeholder:text-gray-400
`;

// ────────────────────────────────────────────────────────────────────────────

const LoginPage = () => {
  const navigate = useNavigate();

  const [username,  setUsername]  = useState('');
  const [password,  setPassword]  = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [captcha,   setCaptcha]   = useState(generateCaptcha);
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setCodeInput('');
    setError('');
  }, []);

  const handleLogin = async () => {
    // Basic validation
    if (!username.trim() || !password.trim()) {
      return setError('Please fill in all fields.');
    }
    if (codeInput.trim() !== captcha) {
      setError('Wrong captcha — a new one has been generated.');
      refreshCaptcha();
      return;
    }

    setError('');
    setLoading(true);

    // Simulate async login (replace with your real API call)
    try {
      await new Promise((r) => setTimeout(r, 600));
      navigate('/dashboard');
    } catch {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Full-page wrapper ────────────────────────────────────── */}
      <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-main)] px-4 font-[Nunito,sans-serif]">

        {/* ── Card ─────────────────────────────────────────────────── */}
        <div className="w-full max-w-[440px] bg-[var(--bg-card)] rounded-xl px-12 py-10 shadow-[var(--shadow)]">

          {/* Title */}
          <h1 className="text-center text-[var(--text-muted)] font-[Rajdhani,sans-serif] text-2xl font-semibold tracking-[3px] mb-8 mt-0 uppercase">
            Log In
          </h1>

          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className={`${INPUT_CLS} mb-4`}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className={`${INPUT_CLS} mb-4`}
          />

          {/* ── Captcha display ───────────────────────────────────── */}
          <div className="flex justify-center mb-3">
            <div className="flex items-center justify-center gap-[2px] bg-[var(--input-bg)] border-2 border-[var(--border)] rounded-md px-8 py-2 select-none font-mono font-bold tracking-[6px]">
              {captcha.split('').map((char, i) => (
                <span
                  key={i}
                  className={`
                    ${CHAR_COLORS[i % CHAR_COLORS.length]}
                    ${CHAR_SIZES[i  % CHAR_SIZES.length]}
                    ${CHAR_STYLES[i % CHAR_STYLES.length]}
                    font-bold
                  `}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          {/* Refresh captcha */}
          <div className="flex justify-end mb-3">
            <button
              type="button"
              onClick={refreshCaptcha}
              aria-label="Generate new captcha"
              className="text-[var(--text-muted)]/70 hover:text-[var(--text-muted)] text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              ↻ New captcha
            </button>
          </div>

          {/* Captcha input */}
          <input
            type="text"
            placeholder="Enter code"
            value={codeInput}
            maxLength={4}
            onChange={(e) => setCodeInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className={`${INPUT_CLS} mb-1 border-2 border-[var(--accent)] focus:ring-[var(--accent)]/30`}
          />

          {/* Error message */}
          {error && (
            <p className="text-[var(--error)] text-[13px] font-semibold text-center mt-2 mb-0" role="alert">
              {error}
            </p>
          )}

          {/* Submit button */}
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="
                px-10 py-[10px] rounded-full
                border border-[var(--accent)] bg-transparent
                text-[var(--text-muted)] font-[Rajdhani,sans-serif] text-[15px] font-semibold tracking-[2px] uppercase
                cursor-pointer transition-all
                hover:bg-white/10 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
              "
            >
              {loading ? 'Logging in…' : 'Log In'}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default LoginPage;