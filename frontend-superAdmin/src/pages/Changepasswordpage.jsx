import { useState } from "react";

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

function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function StrengthBar({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels    = ["", "Weak", "Fair", "Good", "Strong"];
  const colors    = ["", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-emerald-500"];
  const textColors = ["", "text-red-500", "text-amber-500", "text-blue-500", "text-emerald-600"];

  if (!password) return null;

  return (
    <div className="mt-2.5">
      <div className="flex gap-1 mb-1.5">
        {[1, 2, 3, 4].map(i => (
          <div key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : "bg-gray-200"}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-y-1">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {[
            { label: "8+ chars",  ok: checks[0] },
            { label: "Uppercase", ok: checks[1] },
            { label: "Number",    ok: checks[2] },
            { label: "Symbol",    ok: checks[3] },
          ].map(({ label, ok }) => (
            <span key={label}
              className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${ok ? "text-emerald-600" : "text-gray-400"}`}>
              {ok && <CheckIcon />}{label}
            </span>
          ))}
        </div>
        <span className={`text-xs font-semibold ${textColors[score]}`}>{labels[score]}</span>
      </div>
    </div>
  );
}

/* ── reusable password field ── */
function PasswordField({ label, value, onChange, show, onToggle, placeholder, error, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-4">
      {/* Label — stacks on mobile, right-aligned on sm+ */}
      <label className="text-sm font-semibold text-gray-700 sm:w-44 sm:shrink-0 sm:pt-2.5 sm:text-right">
        {label}
      </label>

      {/* Input */}
      <div className="flex-1 min-w-0">
        <div className={`flex items-center gap-2 border rounded-lg px-4 py-2.5 bg-white transition-all
          ${error
            ? "border-red-400 ring-2 ring-red-100"
            : "border-gray-200 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100"}`}>
          <span className="text-gray-400 shrink-0"><LockIcon /></span>
          <input
            type={show ? "text" : "password"}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="flex-1 min-w-0 outline-none text-sm text-gray-800 placeholder:text-gray-400 bg-transparent"
          />
          <button type="button" onClick={onToggle}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
            <EyeIcon open={show} />
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-500 mt-1.5 ml-0.5 flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════ */
export default function ChangePasswordPage() {
  const [form, setForm]       = useState({ old: "", newP: "", confirm: "" });
  const [show, setShow]       = useState({ old: false, newP: false, confirm: false });
  const [errors, setErrors]   = useState({});
  const [toast, setToast]     = useState(null);
  const [loading, setLoading] = useState(false);

  const toggle   = field => setShow(p => ({ ...p, [field]: !p[field] }));
  const setField = key   => e => {
    setForm(p => ({ ...p, [key]: e.target.value }));
    setErrors(p => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.old)  e.old = "Current password is required";
    if (!form.newP) e.newP = "New password is required";
    else if (form.newP.length < 8) e.newP = "Minimum 8 characters required";
    if (form.old && form.newP && form.old === form.newP)
      e.newP = "New password must differ from current";
    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.newP !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setForm({ old: "", newP: "", confirm: "" });
    setToast({ msg: "Password changed successfully!", err: false });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto w-full">

        {/* Heading */}
        <div className="mb-5 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Change Password</h1>
          <p className="text-sm text-gray-400 mt-1">
            Update your account password. Use a strong password to stay secure.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Teal top stripe */}
          <div className="h-1 w-full bg-gradient-to-r from-teal-400 to-teal-600" />

          <div className="p-4 sm:p-6 md:p-8">

            {/* Security tip */}
            <div className="flex items-start gap-3 bg-teal-50 border border-teal-100 rounded-xl px-3 sm:px-4 py-3 mb-6 sm:mb-8">
              <svg className="text-teal-500 mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-xs text-teal-700 leading-relaxed">
                Choose a unique password with a mix of uppercase, lowercase, numbers, and symbols.
                Avoid reusing passwords from other sites.
              </p>
            </div>

            {/* Fields */}
            <div className="flex flex-col gap-5 sm:gap-6">
              <PasswordField
                label="Old Password"
                placeholder="Enter current password"
                value={form.old}
                onChange={setField("old")}
                show={show.old}
                onToggle={() => toggle("old")}
                error={errors.old}
              />

              <PasswordField
                label="New Password"
                placeholder="Enter new password"
                value={form.newP}
                onChange={setField("newP")}
                show={show.newP}
                onToggle={() => toggle("newP")}
                error={errors.newP}
              >
                <StrengthBar password={form.newP} />
              </PasswordField>

              <PasswordField
                label="Confirm Password"
                placeholder="Re-enter new password"
                value={form.confirm}
                onChange={setField("confirm")}
                show={show.confirm}
                onToggle={() => toggle("confirm")}
                error={errors.confirm}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-6 sm:my-7" />

            {/* Footer row */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-gray-400 text-center sm:text-left">
                You will remain logged in after changing your password.
              </p>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center justify-center gap-2
                  bg-teal-500 hover:bg-teal-600 disabled:opacity-60 disabled:cursor-not-allowed
                  text-white font-semibold text-sm px-6 py-2.5 rounded-lg
                  transition-all shadow-sm hover:shadow-md active:scale-95
                  w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </svg>
                    Updating…
                  </>
                ) : (
                  <>
                    <LockIcon />
                    Change Password
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-5 right-4 sm:bottom-6 sm:right-6
          flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3
          rounded-xl text-sm font-semibold shadow-xl z-50 text-white
          ${toast.err ? "bg-red-500" : "bg-emerald-500"}`}>
          {!toast.err && <CheckIcon />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}