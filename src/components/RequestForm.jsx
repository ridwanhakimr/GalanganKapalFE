import React, { useState, useEffect } from 'react';
import { createRequest } from '../services/request.service';
import { getItems } from '../services/inventory.service';
import { Hand } from 'lucide-react';

const RequestForm = ({ itemData, onClose, onSuccess, onError }) => {
  const [requestQty, setRequestQty] = useState(1);
  const [requestNotes, setRequestNotes] = useState('');
  
  // State for Dropdown mode
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');

  useEffect(() => {
    // Jika tidak ada itemData spesifik, ambil semua item untuk dropdown
    if (!itemData) {
      getItems().then(data => {
        setItems(data);
        if (data.length > 0) setSelectedItemId(data[0].ID);
      }).catch(err => console.error(err));
    } else {
      setSelectedItemId(itemData.ID);
    }
  }, [itemData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Cari data target untuk validasi stok
    let targetItem = itemData;
    if (!itemData) {
      targetItem = items.find(i => i.ID === selectedItemId);
    }

    if (!targetItem) return;

    if (requestQty > targetItem.Quantity) {
      onError(`🚨 Ditolak! Stok tidak cukup. Sisa stok hanya ${targetItem.Quantity} unit.`);
      return;
    }

    try {
      await createRequest(targetItem.ID, parseInt(requestQty), requestNotes);
      onSuccess('Permintaan barang berhasil dikirim ke Supervisor!');
    } catch (err) {
      onError(err.response?.data?.error || 'Gagal mengirim permintaan');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl border border-slate-200">
        <h3 className="text-xl font-bold bg-slate-100 p-3 rounded-lg flex items-center gap-2">
          📦 {itemData ? itemData.Name : 'Form Request Barang Baru'}
        </h3>
        
        {itemData && (
          <p className="text-sm text-slate-500 mt-2 mb-4">Sisa stok gudang: <strong className="text-slate-900">{itemData.Quantity} unit</strong></p>
        )}

        <form onSubmit={handleSubmit} className={!itemData ? 'mt-4' : ''}>
          
          {/* Dropdown Section (Only visible if itemData is null) */}
          {!itemData && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Pilih Barang dari Gudang</label>
              <select 
                value={selectedItemId} 
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
                required
              >
                <option value="" disabled>-- Pilih Barang --</option>
                {items.map(i => (
                  <option key={i.ID} value={i.ID}>{i.Name} (Stok: {i.Quantity})</option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Jumlah Permintaan</label>
            <input 
              type="number" 
              min="1" 
              value={requestQty} 
              onChange={(e) => setRequestQty(e.target.value)} 
              className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
              required 
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Catatan / Alasan (Opsional)</label>
            <textarea 
              value={requestNotes} 
              onChange={(e) => setRequestNotes(e.target.value)} 
              className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
              rows="2" 
              placeholder="Cth: Untuk proyek kapal A..." 
            />
          </div>
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Hand size={16}/> Ajukan Izin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;
