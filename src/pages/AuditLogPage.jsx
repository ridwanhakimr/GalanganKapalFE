import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAuditLogs } from '../services/audit.service';
import { ShieldAlert } from 'lucide-react';

const AuditLogPage = () => {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getAuditLogs();
        setLogs(data);
      } catch (err) {
        console.error("Gagal mengambil log:", err);
      }
      setLoading(false);
    };
    if (user.role === 'Admin') fetchLogs();
  }, [user]);

  if (user.role !== 'Admin') {
    return <div className="p-8 text-center text-red-600 font-bold bg-slate-50 h-screen"><ShieldAlert className="mx-auto mb-2" size={48}/>Akses Ditolak: Khusus Admin</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2"><ShieldAlert /> Sistem Jejak Audit</h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         {loading ? <div className="p-12 text-center text-slate-400">Loading system logs...</div> : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800 text-slate-100 text-sm font-semibold">
                <th className="p-3">Waktu</th>
                <th className="p-3">Aksi</th>
                <th className="p-3">Pengguna</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Detail (JSON)</th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono text-slate-700">
              {logs.map(log => (
                <tr key={log.ID} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3 whitespace-nowrap">{new Date(log.CreatedAt).toLocaleString('id-ID')}</td>
                  <td className="p-3 font-semibold text-indigo-700">{log.Action}</td>
                  <td className="p-3">{log.User ? log.User.Name : 'Unknown'}</td>
                  <td className="p-3">{log.IPAddress}</td>
                  <td className="p-3 max-w-xs truncate" title={log.Payload}>{log.Payload}</td>
                </tr>
              ))}
              {logs.length === 0 && <tr><td colSpan="5" className="p-8 text-center font-sans tracking-wide">Bersih. Tidak ada jejak aktivitas.</td></tr>}
            </tbody>
          </table>
         )}
      </div>
    </div>
  );
};
export default AuditLogPage;
