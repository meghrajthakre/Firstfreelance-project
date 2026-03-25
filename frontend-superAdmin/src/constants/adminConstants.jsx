export const EMPTY_FORM = {
  firstName: "",
  masterShare: "", // superadmin's available share — shown read-only
  myShare: "", // what superadmin keeps
  ledgerShare: "",
  fixLimit: "",
  password: "",
  confirmPassword: "",
};

export const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 " +
  "focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition";

export const readonlyCls =
  "w-full border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-400 bg-gray-50 cursor-not-allowed";