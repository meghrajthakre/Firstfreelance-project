import { useState } from "react";

export default function CreateUser({ onGoBack }) {
  const [form, setForm] = useState({ 
    firstName: "", 
    password: "", 
    confirmPassword: "", 
    coins: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError(""); 
    setSuccess(false);
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.firstName || !form.password || !form.confirmPassword || !form.coins) {
      setError("All fields are required");
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (form.password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      // Import your createUser service function here
      const { createUser } = await import("../../services/userService");
      await createUser({
        firstName: form.firstName.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        coins: Number(form.coins),
      });
      setSuccess(true);
      setForm({ firstName: "", password: "", confirmPassword: "", coins: "" });
      
      // Auto redirect after 2 seconds
      setTimeout(() => {
        if (onGoBack) {
          onGoBack();
        }
      }, 1500);
    } catch (e) {
      setError(e?.response?.data?.message || "Something went wrong.");
    } finally { 
      setLoading(false); 
    }
  };

  const isValid = form.firstName && form.password && form.confirmPassword && form.coins;

  const inputCls = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white placeholder:text-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all";

  const fields = [
    { key: "firstName", label: "Full Name", type: "text", placeholder: "Enter full name" },
    { key: "password", label: "Password", type: "password", placeholder: "Min 6 characters" },
    { key: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Re-enter password" },
    { key: "coins", label: "Coins", type: "number", placeholder: "0.00" },
  ];

  return (
    <div className="p-6 font-sans">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Create User
        </h1>
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Users
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-w-md">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/30">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">New User Details</p>
            <p className="text-xs text-gray-400">All fields are required</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="p-6 flex flex-col gap-5">
          {fields.map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                {label}
              </label>
              <input
                name={key}
                type={type}
                value={form[key]}
                onChange={handleChange}
                placeholder={placeholder}
                min={type === "number" ? "0" : undefined}
                step={type === "number" ? "0.01" : undefined}
                className={inputCls}
              />
            </div>
          ))}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              User created successfully! Redirecting...
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={`mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white text-sm font-semibold tracking-wide transition-all ${
              isValid && !loading
                ? "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] shadow-sm"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  className="animate-spin"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
                Create User
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}