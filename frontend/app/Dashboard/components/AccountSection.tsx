"use client";

import { useState } from "react";

export default function AccountSection() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");
      const userId = user?.id;
      if (!userId) throw new Error("No user ID found");

      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiBase}/users/${userId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (err) {
      console.error("Delete account error:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-8">
        <UserIcon />
        <h2 className="text-xl font-bold text-gray-900">Account</h2>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0 mt-0.5">
            <WarningIcon />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 mb-1">Danger Zone</h3>
            <p className="text-red-600 text-sm mb-2">Delete Account</p>
            <p className="text-gray-700 text-sm mb-4">
              This action is permanent and cannot be undone. All your data, shipments, and trucks
              will be deleted from our servers forever.
            </p>

            <button
              onClick={handleDeleteClick}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <TrashIcon />
              Delete My Account
            </button>

            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Account Deletion</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Are you absolutely sure? This cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className={`flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer ${
                        isDeleting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#7E52FF" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const WarningIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="text-red-600">
    <path d="M13 13h-2v-6h2v6zm0 4h-2v-2h2v2zm-1-15c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11-4.925-11-11-11zm0 20c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);