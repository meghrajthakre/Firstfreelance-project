import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { C } from "./constants";
import { apiClient } from "../../../../services/api"; 

export default function Controls({ rateDiff, setRateDiff }) {
    // Get matchId from URL params
    const { matchId } = useParams();
    
    const [betLock, setBetLock] = useState("Unlock");
    const [mode, setMode] = useState("Lagai");
    const [sessionLock, setSessionLock] = useState("Unlock");
    const [localRateDiff, setLocalRateDiff] = useState("1");
    const [settings, setSettings] = useState(null);
    
    // Individual loading states for each button
    const [isBetLockSubmitting, setIsBetLockSubmitting] = useState(false);
    const [isSessionLockSubmitting, setIsSessionLockSubmitting] = useState(false);
    const [isRateDiffSubmitting, setIsRateDiffSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch current settings on mount
    useEffect(() => {
        if (matchId) {
            fetchSettings();
        } else {
            setIsLoading(false);
            setError("No match ID provided in URL");
        }
    }, [matchId]);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiClient.get(`/manual/settings/${matchId}`);
            
            console.log("Fetch settings response:", response.data);
            
            if (response.data?.success && response.data?.data) {
                const settingsData = response.data.data;
                setSettings(settingsData);
                setBetLock(settingsData.betLock ? "Lock" : "Unlock");
                setMode(settingsData.mode || "Lagai");
                setSessionLock(settingsData.sessionLock ? "Lock" : "Unlock");
                setLocalRateDiff(String(settingsData.rateDiff || 1));
                if (setRateDiff) {
                    setRateDiff(settingsData.rateDiff || 1);
                }
            } else {
                console.log("No settings found, using defaults");
                // Use default values
                setBetLock("Unlock");
                setMode("Lagai");
                setSessionLock("Unlock");
                setLocalRateDiff("1");
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
            console.error("Error details:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            
            setError(error.response?.data?.message || error.message || "Failed to load settings");
            // If settings don't exist (404), use defaults
            if (error.response?.status === 404) {
                // Use default values
                setBetLock("Unlock");
                setMode("Lagai");
                setSessionLock("Unlock");
                setLocalRateDiff("1");
                // Clear the error since we're using defaults
                setError(null);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRateDiffSubmit = async () => {
        if (!matchId) {
            console.error("No matchId provided");
            return;
        }
        
        setIsRateDiffSubmitting(true);
        try {
            const payload = {
                matchId,
                rateDiff: Number(localRateDiff)
            };
            
            const response = await apiClient.post("/manual/settings/update", payload);
            
            console.log("Rate diff update response:", response.data);
            
            if (response.data?.success) {
                setRateDiff(Number(localRateDiff));
                console.log("Rate difference updated successfully");
                await fetchSettings();
            } else {
                throw new Error(response.data?.message || "Update failed");
            }
        } catch (error) {
            console.error("Failed to update rate difference:", error);
            console.error("Error details:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            setError(error.response?.data?.message || error.message || "Failed to update rate difference");
        } finally {
            setIsRateDiffSubmitting(false);
        }
    };

    const handleBetLockSubmit = async () => {
        if (!matchId) {
            console.error("No matchId provided");
            return;
        }
        
        setIsBetLockSubmitting(true);
        try {
            const payload = {
                matchId,
                betLock: betLock === "Lock",
                mode: mode
            };
            
            const response = await apiClient.post("/manual/settings/update", payload);
            
            console.log("Bet lock update response:", response.data);
            
            if (response.data?.success) {
                console.log("Bet lock and mode updated successfully");
                await fetchSettings();
            } else {
                throw new Error(response.data?.message || "Update failed");
            }
        } catch (error) {
            console.error("Failed to update bet lock:", error);
            console.error("Error details:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            setError(error.response?.data?.message || error.message || "Failed to update bet lock");
        } finally {
            setIsBetLockSubmitting(false);
        }
    };

    const handleSessionLockSubmit = async () => {
        if (!matchId) {
            console.error("No matchId provided");
            return;
        }
        
        setIsSessionLockSubmitting(true);
        try {
            const payload = {
                matchId,
                sessionLock: sessionLock === "Lock"
            };
            
            const response = await apiClient.post("/manual/settings/update", payload);
            
            console.log("Session lock update response:", response.data);
            
            if (response.data?.success) {
                console.log("Session lock updated successfully");
                await fetchSettings();
            } else {
                throw new Error(response.data?.message || "Update failed");
            }
        } catch (error) {
            console.error("Failed to update session lock:", error);
            console.error("Error details:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            setError(error.response?.data?.message || error.message || "Failed to update session lock");
        } finally {
            setIsSessionLockSubmitting(false);
        }
    };

    const thCls = "text-left px-4 py-2 text-gray-600 font-medium text-sm border-b border-gray-200 bg-white";
    const tdCls = "px-4 py-3 bg-white";

    // Button styles with hover effects
    const buttonStyles = {
        background: C.submitBtn || "#4B75B8",
        transition: 'all 0.3s ease',
        transform: 'scale(1)',
        opacity: 1,
        cursor: 'pointer'
    };

    const buttonHoverStyles = {
        transform: 'scale(1.05)',
        opacity: 0.9,
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    };

    const buttonDisabledStyles = {
        opacity: 0.6,
        cursor: 'not-allowed',
        transform: 'scale(0.98)'
    };

    // Reusable button component
    const SubmitButton = ({ onClick, isSubmitting, children }) => (
        <button
            onClick={onClick}
            disabled={isSubmitting || isLoading}
            className="text-white text-sm font-semibold px-6 py-1.5 rounded relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            style={{
                ...buttonStyles,
                ...(isSubmitting || isLoading ? buttonDisabledStyles : {}),
                background: C.submitBtn || "#4B75B8"
            }}
            onMouseEnter={(e) => {
                if (!isSubmitting && !isLoading) {
                    Object.assign(e.currentTarget.style, buttonHoverStyles);
                }
            }}
            onMouseLeave={(e) => {
                if (!isSubmitting && !isLoading) {
                    Object.assign(e.currentTarget.style, {
                        transform: 'scale(1)',
                        opacity: 1,
                        boxShadow: 'none'
                    });
                }
            }}
        >
            {isSubmitting ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                </span>
            ) : (
                children
            )}
        </button>
    );

    // Error display
    if (error && !isLoading) {
        return (
            <div className="border border-red-300 rounded overflow-hidden mb-4 p-4 bg-red-50">
                <div className="flex items-center gap-2 text-red-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">{error}</span>
                </div>
                <button 
                    onClick={fetchSettings}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="border border-gray-200 rounded overflow-hidden mb-4 p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="text-gray-500">Loading settings...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-gray-200 rounded overflow-hidden mb-4">
            {/* Match ID Display - Optional, for debugging */}
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs text-gray-500">
                Match ID: {matchId}
            </div>

            {/* Bet Lock & Mode Table */}
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className={thCls}>Bet Lock</th>
                        <th className={thCls}>Mode</th>
                        <th className={thCls}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-t border-gray-100">
                        <td className={tdCls}>
                            <select
                                value={betLock}
                                onChange={(e) => setBetLock(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-36"
                                disabled={isBetLockSubmitting || isSessionLockSubmitting || isRateDiffSubmitting}
                            >
                                <option value="Unlock">Unlock</option>
                                <option value="Lock">Lock</option>
                            </select>
                        </td>
                        <td className={tdCls}>
                            <select
                                value={mode}
                                onChange={(e) => setMode(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-36"
                                disabled={isBetLockSubmitting || isSessionLockSubmitting || isRateDiffSubmitting}
                            >
                                <option value="Lagai">Lagai</option>
                                <option value="Khai">Khai</option>
                            </select>
                        </td>
                        <td className={tdCls}>
                            <SubmitButton 
                                onClick={handleBetLockSubmit} 
                                isSubmitting={isBetLockSubmitting}
                            >
                                Submit
                            </SubmitButton>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Session Lock Table */}
            <table className="w-full border-collapse border-t-2 border-gray-200">
                <thead>
                    <tr>
                        <th className={thCls}>Session Lock/Unlock</th>
                        <th className={thCls}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-t border-gray-100">
                        <td className={tdCls}>
                            <select
                                value={sessionLock}
                                onChange={(e) => setSessionLock(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-36"
                                disabled={isBetLockSubmitting || isSessionLockSubmitting || isRateDiffSubmitting}
                            >
                                <option value="Unlock">Unlock</option>
                                <option value="Lock">Lock</option>
                            </select>
                        </td>
                        <td className={tdCls}>
                            <SubmitButton 
                                onClick={handleSessionLockSubmit} 
                                isSubmitting={isSessionLockSubmitting}
                            >
                                Submit
                            </SubmitButton>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Match Rate Difference Table */}
            <table className="w-full border-collapse border-t-2 border-gray-200">
                <thead>
                    <tr>
                        <th className={thCls}>Name</th>
                        <th className={thCls}>Diff</th>
                        <th className={thCls}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-t border-gray-100">
                        <td className={`${tdCls} text-gray-700`}>Match Rate Difference</td>
                        <td className={tdCls}>
                            <select
                                value={localRateDiff}
                                onChange={(e) => setLocalRateDiff(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-28"
                                disabled={isBetLockSubmitting || isSessionLockSubmitting || isRateDiffSubmitting}
                            >
                                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </td>
                        <td className={tdCls}>
                            <SubmitButton 
                                onClick={handleRateDiffSubmit} 
                                isSubmitting={isRateDiffSubmitting}
                            >
                                Submit
                            </SubmitButton>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}