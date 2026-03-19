import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Captcha helpers ──────────────────────────────────────────────────────────

function generateCaptcha() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// Per-digit visual styles — alternates colours & sizes for bot resistance
const CHAR_COLORS = ['text-emerald-600', 'text-blue-500'];
const CHAR_SIZES  = ['text-[26px]',      'text-[22px]'];
const CHAR_STYLES = ['not-italic',       'italic'];

// ── Shared input class — uses your @theme tokens ─────────────────────────────
const INPUT_CLS = `
  block w-full px-4 py-3 rounded-md
  border border-(--color-border)
  bg-(--color-input-bg)
  text-(--color-text-dark) text-[15px]
  font-nunito
  outline-none transition-all
  focus:border-(--color-accent)
  focus:ring-2 focus:ring-(--color-accent)/30
  placeholder:text-gray-400
`;

// ─────────────────────────────────────────────────────────────────────────────

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
    if (!username.trim() || !password.trim())
      return setError('Please fill in all fields.');

    if (codeInput.trim() !== captcha) {
      setError('Wrong captcha — a new one has been generated.');
      refreshCaptcha();
      return;
    }

    setError('');
    setLoading(true);

    try {
      navigate('/dashboard');
    } catch {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    // ── Full-page wrapper ────────────────────────────────────────────────────
    <div className="
      min-h-screen w-full
      flex items-center justify-center
      bg-(--color-bg-main)
      px-4
      font-nunito
    ">

      {/* ── Card  ─  bg-(--color-bg-card) = #3A5F9A from your index.css ──── */}
      <div className="
        w-full max-w-[440px]
        bg-(--color-bg-card)
        rounded-xl
        px-12 py-10
        shadow-[0_8px_32px_rgba(0,0,0,0.18)]
        animate-slide-up
      ">

        {/* Title */}
        <h1 className="
          text-center
          text-(--color-text-muted)
          font-rajdhani text-2xl font-semibold
          tracking-[3px] uppercase
          mb-8 mt-0
        ">
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

        {/* ── Captcha display box ─────────────────────────────────────────── */}
        <div className="flex justify-center mb-3">
          <div className="
            flex items-center justify-center gap-[2px]
            bg-(--color-input-bg)
            border-2 border-(--color-border)
            rounded-md px-8 py-2
            select-none font-mono font-bold tracking-[6px]
          ">
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

        {/* Refresh captcha link */}
        <div className="flex justify-end mb-3">
          <button
            type="button"
            onClick={refreshCaptcha}
            aria-label="Generate new captcha"
            className="
              text-(--color-text-muted)/70
              hover:text-(--color-text-muted)
              text-xs font-nunito
              flex items-center gap-1
              transition-colors cursor-pointer
            "
          >
            ↻ New captcha
          </button>
        </div>

        {/* Captcha input — accent border to stand out */}
        <input
          type="text"
          placeholder="Enter code"
          value={codeInput}
          maxLength={4}
          onChange={(e) => setCodeInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          className={`
            ${INPUT_CLS} mb-1
            border-2 border-(--color-accent)
            focus:ring-(--color-accent)/30
          `}
        />

        {/* Error message */}
        {error && (
          <p
            role="alert"
            className="
              text-(--color-error)
              text-[13px] font-semibold font-nunito
              text-center mt-2 mb-0
            "
          >
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
              border border-(--color-accent)
              bg-transparent
              text-(--color-text-muted)
              font-rajdhani text-[15px] font-semibold tracking-[2px] uppercase
              cursor-pointer transition-all
              hover:bg-white/10
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
            "
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;