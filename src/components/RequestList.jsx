import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const RequestList = ({ requests, userRole, onApprove, onReject }) => {
  
  if (!requests || requests.length === 0) {
    return <div className="p-8 text-center text-slate-500">Tidak ada data permohonan.</div>;
  }

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-100 border-b border-slate-200 text-sm font-semibold text-slate-600">
          <th className="p-4">Tgl Pengajuan</th>
          <th className="p-4">Barang</th>
          <th className="p-4">Jml Minta</th>
          <th className="p-4">Alasan</th>
          <th className="p-4">Status</th>
          <th className="p-4">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {requests.map(req => (
          <tr key={req.ID} className="border-b border-slate-100 hover:bg-slate-50">
            <td className="p-4 text-sm font-medium">{new Date(req.CreatedAt).toLocaleDateString('id-ID')}</td>
            <td className="p-4 text-sm">{req.Item ? req.Item.Name : 'Item #'+req.ItemID}</td>
            <td className="p-4 text-sm font-bold text-slate-700">{req.QuantityRequested} unit</td>
            <td className="p-4 text-sm text-slate-500">{req.Notes || '-'}</td>
            <td className="p-4">
              <span className={`px-2 py-1 text-xs rounded-full font-medium 
                ${req.Status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                  req.Status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {req.Status.toUpperCase()}
              </span>
            </td>
            <td className="p-4">
              {req.Status === 'pending' && (userRole === 'Supervisor' || userRole === 'Admin') ? (
                 <div className="flex items-center gap-2">
                   <button 
                     onClick={() => onApprove(req.ID)} 
                     className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm shadow-sm"
                   >
                     <CheckCircle size={16} /> Setujui
                   </button>
                   <button 
                     onClick={() => onReject(req.ID)} 
                     className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm shadow-sm"
                   >
                     <XCircle size={16} /> Tolak
                   </button>
                 </div>
              ) : (
                <span className="text-slate-400 text-xs">Selesai</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RequestList;
