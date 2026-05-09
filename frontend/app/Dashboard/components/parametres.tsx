"use client";

import { useState } from "react";
import AccountSection from "./AccountSection";
import SecuritySection from "./SecuritySection";

type SettingsTab = "account" | "security";

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and security preferences</p>
      </div>

      {}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("account")}
          className={`px-5 py-2.5 font-medium text-sm transition-all cursor-pointer ${
            activeTab === "account"
              ? "text-[#7E52FF] border-b-2 border-[#7E52FF]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-5 py-2.5 font-medium text-sm transition-all cursor-pointer ${
            activeTab === "security"
              ? "text-[#7E52FF] border-b-2 border-[#7E52FF]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Security
        </button>
      </div>

      {}
      <div>
        {activeTab === "account" ? <AccountSection /> : <SecuritySection />}
      </div>
    </div>
  );
}
