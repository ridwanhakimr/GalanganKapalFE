import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getRequests, approveRequest, rejectRequest } from '../services/request.service';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import RequestList from '../components/RequestList';

const ApprovalPage = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getRequests();
      setRequests(data);
    } catch (err) {
      setMsg({ type: 'error', text: 'Gagal mengambil data pengajuan' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveRequest(id);
      setMsg({ type: 'success', text: 'Peminjaman berhasil disetujui, stok dikurangi.' });
      fetchRequests();
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Gagal menyetujui' });
      setTimeout(() => setMsg({ type: '', text: '' }), 4000);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRequest(id);
      setMsg({ type: 'success', text: 'Permintaan telah ditolak.' });
      fetchRequests();
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Gagal menolak' });
      setTimeout(() => setMsg({ type: '', text: '' }), 4000);
    }
  };

  if (user.role === 'Staff') return <div className="p-6">Akses ditolak.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Persetujuan Pengajuan Barang</h1>
      
      {msg.text && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 shadow-sm ${msg.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
          {msg.type === 'success' ? <CheckCircle /> : <AlertCircle />} {msg.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? <div className="p-12 text-center text-slate-400">Loading...</div> : (
          <RequestList 
            requests={requests} 
            userRole={user.role} 
            onApprove={handleApprove} 
            onReject={handleReject} 
          />
        )}
      </div>
    </div>
  );
};
export default ApprovalPage;
