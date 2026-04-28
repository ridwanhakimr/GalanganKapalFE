import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getStockMovements } from '../services/inventory.service';
import { ClipboardList, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StockLedger = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'Admin') {
      navigate('/');
    } else {
      fetchMovements();
    }
  }, [user, navigate]);

  const fetchMovements = async () => {
    setLoading(true);
    try {
      const data = await getStockMovements();
      setMovements(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (user?.role !== 'Admin') return null;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <ClipboardList className="text-rose-600" /> Buku Besar Pergerakan Stok
        </h1>
        <p className="text-slate-500 mb-8">Rekam jejak seluruh transaksi keluar masuk barang di galangan kapal.</p>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading buku besar...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-sm font-semibold text-slate-600">
                  <th className="p-4">Tanggal & Waktu</th>
                  <th className="p-4">SKU / ID Item</th>
                  <th className="p-4">Nama Barang</th>
                  <th className="p-4">Jenis Transaksi</th>
                  <th className="p-4 text-right">Perubahan (Qty)</th>
                  <th className="p-4">Referensi Request</th>
                </tr>
              </thead>
              <tbody>
                {movements.map(mov => (
                  <tr key={mov.ID} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4 text-sm font-medium text-slate-600">
                      {new Date(mov.CreatedAt).toLocaleString('id-ID')}
                    </td>
                    <td className="p-4 text-sm font-mono text-slate-500 bg-slate-50 rounded px-2">
                      {mov.Item?.SKU || mov.ItemID.substring(0,8)}
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Package size={14} className="text-slate-400"/> {mov.Item?.Name || 'Unknown Item'}
                    </td>
                    <td className="p-4">
                      {mov.MovementType === 'IN' ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full w-fit">
                          <ArrowDownRight size={14} /> BARANG MASUK
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-100 px-2 py-1 rounded-full w-fit">
                          <ArrowUpRight size={14} /> BARANG KELUAR
                        </span>
                      )}
                    </td>
                    <td className={`p-4 text-right font-bold text-lg ${mov.MovementType === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {mov.MovementType === 'IN' ? '+' : ''}{mov.QtyChange}
                    </td>
                    <td className="p-4 text-sm text-slate-500 font-mono">
                      {mov.RequestID ? mov.RequestID.substring(0,8) + '...' : '-'}
                    </td>
                  </tr>
                ))}
                {movements.length === 0 && (
                  <tr><td colSpan="6" className="p-8 text-center text-slate-500">Belum ada riwayat pergerakan stok.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockLedger;
