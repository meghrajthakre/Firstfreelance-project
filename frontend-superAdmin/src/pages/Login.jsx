import { useState } from "react";
import { loginUser } from "../services/userService";

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function LoginPage() {
  const [form, setForm]       = useState({ username: "", password: "" });
  const [showPass, setShow]   = useState(false);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState(null);

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required";
    if (!form.password)        e.password = "Password is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      // loginUser now stores the token in sessionStorage internally.
      // The axios interceptor picks it up automatically for all future requests.
      await loginUser(form.username, form.password);

      setToast("Login successful! Redirecting…");
      setTimeout(() => {
        window.location.href = "/superadmin/dashboard";
      }, 1200);

    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && typeof data.errors === "object") {
        setErrors(data.errors);
      } else {
        setErrors({ password: data?.message ?? "Invalid username or password" });
      }
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: "" }));
  };

  return (
    <>
      <style>{`
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes spinSlow { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .fade-up { animation: fadeUp .45s ease forwards; }
        .spin-slow { animation: spinSlow 18s linear infinite; }
      `}</style>

      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4 relative overflow-hidden">

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-teal-400/8 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-teal-500/5 spin-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-teal-500/8 spin-slow" style={{animationDirection:'reverse'}} />
        </div>

        <div className="w-full max-w-md relative fade-up">

          {/* Logo */}
          <div className="text-center mb-8">
            <p className="text-sm text-slate-400 mt-1.5">Superadmin Portal — Sign in to continue</p>
          </div>

          {/* Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600" />

            <div className="p-8">
              <h2 className="text-lg font-bold text-white mb-6">Welcome back</h2>

              <div className="flex flex-col gap-5">

                {/* Username */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Username
                  </label>
                  <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-[#0d1117] transition-all
                    ${errors.username
                      ? "border-red-500/60 ring-2 ring-red-500/20"
                      : "border-[#30363d] focus-within:border-teal-500/60 focus-within:ring-2 focus-within:ring-teal-500/20"}`}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input
                      type="text"
                      value={form.username}
                      onChange={e => set("username", e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleSubmit()}
                      placeholder="Enter your username"
                      autoCapitalize="none"
                      autoCorrect="off"
                      autoComplete="username"
                      className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-slate-600"
                    />
                  </div>
                  {errors.username && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                    <button type="button" className="text-xs text-teal-400 hover:text-teal-300 font-medium transition-colors">
                      Forgot password?
                    </button>
                  </div>
                  <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-[#0d1117] transition-all
                    ${errors.password
                      ? "border-red-500/60 ring-2 ring-red-500/20"
                      : "border-[#30363d] focus-within:border-teal-500/60 focus-within:ring-2 focus-within:ring-teal-500/20"}`}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    <input
                      type={showPass ? "text" : "password"}
                      value={form.password}
                      onChange={e => set("password", e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleSubmit()}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-slate-600"
                    />
                    <button type="button" onClick={() => setShow(p => !p)}
                      className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0">
                      <EyeIcon open={showPass} />
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember me */}
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-4 h-4 border border-[#30363d] rounded peer-checked:bg-teal-500 peer-checked:border-teal-500 transition-all bg-[#0d1117]" />
                    <svg className="absolute inset-0 m-auto w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
                </label>

                {/* Submit */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 bg-teal-500 hover:bg-teal-400
                    disabled:opacity-60 disabled:cursor-not-allowed text-[#0d1117] font-bold text-sm
                    py-3 rounded-xl transition-all shadow-lg hover:shadow-teal-500/25 active:scale-[.98] mt-1">
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 12a9 9 0 11-6.219-8.56"/>
                      </svg>
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign In
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </button>

              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-600 mt-6">
            © 2026 Top11. All rights reserved.
          </p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2.5 px-5 py-3 bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-xl z-50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {toast}
        </div>
      )}
    </>
  );
}