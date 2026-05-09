"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";

export interface SubscriptionData {
  id: number;
  userName: string;
  userAvatar: string;
  amount: string;
  method: string;
  submittedOn: string;
  requestedPlan: string;
  planDuration: string;
  receiptPath: string;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  startDate?: string;
  endDate?: string;
}

export default function SubscriptionView() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
  const [stats, setStats] = useState({ pending: 0, activePro: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const BACKEND_STATIC_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        const [statsResponse, allSubsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/userSubs/stats`, { headers: authHeaders }),
          fetch(`${API_BASE_URL}/userSubs/getAllSubscriptions`, { headers: authHeaders })
        ]);

        if (!statsResponse.ok) throw new Error(`Stats fetch failed with status ${statsResponse.status}`);
        if (!allSubsResponse.ok) throw new Error(`Subscriptions fetch failed with status ${allSubsResponse.status}`);

        const statsText = await statsResponse.text();
        const subsText = await allSubsResponse.text();

        const statsData = JSON.parse(statsText);
        const subsData = JSON.parse(subsText);

        const mappedSubscriptions: SubscriptionData[] = subsData.subscriptions.map((item: any) => {

          let avatarUrl = '';
          if (item.profile_picture) {
            const fileName = item.profile_picture.split(/[\\/]/).pop();
            avatarUrl = `${BACKEND_STATIC_URL}/uploads/profile-pictures/${fileName}`;
          }

          let receiptUrl = '';
          if (item.receipt) {
            const fileName = item.receipt.split(/[\\/]/).pop();

            receiptUrl = `${BACKEND_STATIC_URL}/uploads/receipts/${fileName}`;
          }

          const planDuration = item.duration_days >= 365 ? 'Yearly' : item.duration_days > 30 ? `${item.duration_days} days` : 'Monthly';

          return {
            id: item.id,
            userName: item.business_name || 'Unknown Business',
            userAvatar: avatarUrl,
            amount: `${item.amount} DZD`,
            method: item.payment_method,
            submittedOn: new Date(item.created_at).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            }),
            requestedPlan: item.plan_name,
            planDuration: planDuration,
            receiptPath: receiptUrl,
            status: item.status,
            startDate: item.start_date ? new Date(item.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
            endDate: item.end_date ? new Date(item.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined
          };
        });

        setStats({
          pending: statsData.pending || 0,
          activePro: statsData.activePro || 0,
        });

        setSubscriptions(mappedSubscriptions);

      } catch (err: any) {
        console.error("Error fetching subscription data:", err);

        if (err instanceof SyntaxError && err.message.includes('Unexpected token')) {
          setError("API Route Error: The frontend hit an HTML page instead of the JSON API. Check your API_BASE_URL port.");
        } else {
          setError(err.message || "An error occurred while fetching data.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []);

  const handleConfirm = async (id: number) => {
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/userSubs/activate/${id}`, {
        method: 'PUT',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) throw new Error('Failed to activate subscription');

      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === id ? { ...sub, status: 'active' as const } : sub
        )
      );

      setStats((prev) => ({
        pending: Math.max(0, prev.pending - 1),
        activePro: prev.activePro + 1
      }));

      toast.success("Subscription approved successfully");

    } catch (error) {
      console.error("Error confirming:", error);
      toast.error("Failed to confirm the subscription. Please try again.");
    }
  };

  const handleReject = async (id: number) => {

    if (!window.confirm("Are you sure you want to reject and delete this request?")) return;

    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/userSubs/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) throw new Error('Failed to delete subscription');

      setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));

      setStats((prev) => ({
        ...prev,
        pending: Math.max(0, prev.pending - 1)
      }));

      toast.success("Subscription rejected and removed");

    } catch (error) {
      console.error("Error rejecting:", error);
      toast.error("Failed to reject the subscription. Please try again.");
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => sub.status === activeTab);

  if (isLoading) return <div className="p-8">Loading subscription data...</div>;
  if (error) return <div className="p-8 text-red-500 font-semibold">{error}</div>;

  return (
    <div className="flex flex-col gap-8 w-full p-6">

      {}
      <div className="flex gap-4">
        <div className="bg-[#bfff00] p-6 rounded-xl shadow-sm min-w-[300px]">
          <h3 className="text-sm font-medium mb-4 uppercase tracking-wide">Pending Payments</h3>
          <p className="text-4xl font-bold">{stats.pending}</p>
        </div>

        <div className="bg-[#bfff00] p-6 rounded-xl shadow-sm min-w-[300px]">
          <h3 className="text-sm font-medium mb-4 uppercase tracking-wide">Active Pro</h3>
          <p className="text-4xl font-bold">{stats.activePro.toLocaleString()}</p>
        </div>
      </div>

      {}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 text-sm font-semibold rounded-t-lg transition-colors ${
            activeTab === 'pending'
              ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Pending ({stats.pending})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-3 text-sm font-semibold rounded-t-lg transition-colors ${
            activeTab === 'active'
              ? 'bg-green-100 text-green-700 border-b-2 border-green-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Active Pro ({stats.activePro})
        </button>
      </div>

      {}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            {activeTab === 'pending' ? 'Pending Subscriptions / Awaiting Confirmation' : 'Active Pro Subscriptions'}
          </h2>
          <div className="px-4 py-2 border rounded-md text-sm text-gray-400">Search user...</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium px-4">User</th>
                <th className="pb-3 font-medium px-4">Amount</th>
                <th className="pb-3 font-medium px-4">Method</th>
                <th className="pb-3 font-medium px-4">Submitted On</th>
                <th className="pb-3 font-medium px-4">Requested Plan</th>
                <th className="pb-3 font-medium px-4">Receipt</th>
                <th className="pb-3 font-medium px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={sub.userAvatar || '/default-avatar.png'}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover bg-gray-100"
                      />
                      <div>
                        <span className="font-semibold text-sm text-gray-800 block">{sub.userName}</span>
                        {sub.status === 'pending' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 mt-1">
                            NOT CONFIRMED
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 mt-1">
                            ACTIVE
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-sm text-gray-800">{sub.amount}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{sub.method}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {sub.status === 'active' && sub.startDate ? (
                      <div>
                        <div>Started: {sub.startDate}</div>
                        <div className="text-xs text-gray-400">Ends: {sub.endDate}</div>
                      </div>
                    ) : (
                      sub.submittedOn
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {sub.requestedPlan}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {sub.planDuration}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <a
                      href={sub.receiptPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:text-indigo-700 font-semibold"
                    >
                      View Receipt
                    </a>
                  </td>
                  <td className="py-4 px-4">
                    {sub.status === 'pending' ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleConfirm(sub.id)}
                          className="bg-[#bfff00] text-black px-4 py-1.5 rounded-md text-xs font-bold hover:bg-[#a6e600] transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleReject(sub.id)}
                          className="bg-red-500 text-white px-4 py-1.5 rounded-md text-xs font-bold hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredSubscriptions.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500 text-sm">
                    {activeTab === 'pending'
                      ? 'No pending subscriptions found.'
                      : 'No active subscriptions found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}