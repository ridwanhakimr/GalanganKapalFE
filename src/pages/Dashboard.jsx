import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getItems } from '../services/inventory.service';
import { getRequests } from '../services/request.service';
import { LogOut, Package, ClipboardList, ShieldCheck, ActivitySquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logoutUser } = useContext(AuthContext);
  
  const [totalItems, setTotalItems] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [myRequestsCount, setMyRequestsCount] = useState(0);

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const items = await getItems();
        setTotalItems(items.length);

        const requests = await getRequests();
        
        // Count pending
        const pending = requests.filter(r => r.Status === 'pending');
        setPendingCount(pending.length);

        // Count my personal requests
        const myRequests = requests.filter(r => r.RequesterID === user.id);
        setMyRequestsCount(myRequests.length);

      } catch (err) {
        console.error("Dashboard failed to load stats");
      }
    };
    loadDashboardStats();
  }, [user]);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Supervisor': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Staff': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold text-indigo-700 font-mono tracking-tight flex items-center gap-2">
              <Package/> SHIPYARD YARD
            </h1>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
              <button onClick={logoutUser} className="flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900">Halo, {user.name}!</h2>
          <p className="mt-1 text-slate-500 mb-8">Pilih modul untuk mulai mengelola operasional kapal Anda hari ini.</p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            
            <Link to="/inventory" className="block outline-none hover:-translate-y-1 transition-transform">
              <div className="overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md p-6 flex flex-col h-full">
                <div className="p-3 bg-white/20 w-fit text-white rounded-lg mb-4"><Package size={28} /></div>
                <div className="mt-auto">
                  <p className="text-blue-100 font-medium text-sm">Gudang & Inventaris</p>
                  <div className="flex items-end justify-between mt-1">
                    <p className="text-3xl font-bold text-white">{totalItems}</p>
                    <span className="text-xs text-blue-200 font-medium">Items</span>
                  </div>
                </div>
              </div>
            </Link>

            {(user.role === 'Staff' || user.role === 'Admin') && (
              <Link to="/inventory" className="block outline-none hover:-translate-y-1 transition-transform">
                <div className="overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md p-6 flex flex-col h-full relative">
                  <div className="absolute top-0 right-0 p-4"><ClipboardList size={40} className="text-slate-100 opacity-50"/></div>
                  <div className="p-3 bg-emerald-50 w-fit text-emerald-600 rounded-lg mb-4 relative z-10"><ClipboardList size={24} /></div>
                  <div className="mt-auto relative z-10">
                    <p className="text-slate-500 font-medium text-sm">Permintaan Saya</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{myRequestsCount}</p>
                  </div>
                </div>
              </Link>
            )}

            {(user.role === 'Supervisor' || user.role === 'Admin') && (
              <Link to="/approval" className="block outline-none hover:-translate-y-1 transition-transform">
                <div className="overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md p-6 flex flex-col h-full relative group">
                  <div className="absolute top-0 right-0 p-4"><ShieldCheck size={40} className="text-amber-50 opacity-50 group-hover:text-amber-100 transition-colors"/></div>
                  <div className="p-3 bg-amber-50 w-fit text-amber-600 rounded-lg mb-4 relative z-10"><ShieldCheck size={24} /></div>
                  <div className="mt-auto relative z-10">
                    <p className="text-slate-500 font-medium text-sm">Persetujuan Menunggu</p>
                    <div className="flex items-center gap-3">
                      <p className="text-3xl font-bold text-amber-600 mt-1">{pendingCount}</p>
                      {pendingCount > 0 && <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span></span>}
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {user.role === 'Admin' && (
              <Link to="/audit" className="block outline-none hover:-translate-y-1 transition-transform">
                <div className="overflow-hidden rounded-xl bg-slate-800 border border-slate-700 shadow-md p-6 flex flex-col h-full">
                  <div className="p-3 bg-slate-700 w-fit text-cyan-400 rounded-lg mb-4"><ActivitySquare size={24} /></div>
                  <div className="mt-auto">
                    <p className="text-slate-300 font-medium text-sm">Jejak Audit Sistem</p>
                    <p className="text-xl font-mono text-cyan-400 mt-1">LOGS.CHK</p>
                  </div>
                </div>
              </Link>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};
export default Dashboard;
