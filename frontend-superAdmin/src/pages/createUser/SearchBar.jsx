export default function SearchBar({ search, onSearchChange, onSearch, loading }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 px-6 py-4 border-b border-gray-100">
      <span className="text-sm text-gray-500 font-medium">Search:</span>
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Name..."
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white placeholder:text-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 w-48 transition-all"
      />
      <button
        onClick={onSearch}
        className="text-xs font-semibold text-white bg-gray-800 hover:bg-gray-900 px-3 py-1.5 rounded-lg transition-all"
      >
        {loading ? "..." : "Search"}
      </button>
    </div>
  );
}