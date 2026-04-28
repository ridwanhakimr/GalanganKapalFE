import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getItems, createItem, getWarehouses, getCategories } from '../services/inventory.service';
import { PackagePlus, Hand, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import RequestForm from '../components/RequestForm';

const Inventory = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', sku: '', quantity: 0, min_stock: 5, warehouse_id: '', category_id: '' });
  const [imageFile, setImageFile] = useState(null);

  // Request states
  const [requestItemData, setRequestItemData] = useState(null);
  const [showDropdownRequestForm, setShowDropdownRequestForm] = useState(false);
  const [popupError, setPopupError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getItems();
      setItems(data);
      if (user.role === 'Admin') {
        const whData = await getWarehouses();
        const catData = await getCategories();
        setWarehouses(whData);
        setCategories(catData);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newItem.name);
      formData.append('sku', newItem.sku);
      formData.append('quantity', newItem.quantity);
      formData.append('min_stock', newItem.min_stock);
      formData.append('warehouse_id', newItem.warehouse_id);
      if (newItem.category_id) formData.append('category_id', newItem.category_id);
      if (imageFile) formData.append('image', imageFile);

      await createItem(formData);
      setSuccessMsg('Barang berhasil ditambahkan!');
      setShowAddForm(false);
      setImageFile(null);
      fetchData(); // refresh data
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setPopupError(err.response?.data?.error || 'Gagal menambah barang');
      setTimeout(() => setPopupError(''), 3000);
    }
  };

  const getAPIUrl = (path) => {
    if (!path) return null;
    return `http://localhost:3000${path}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Inventaris</h1>
          <div className="flex gap-2">
            {user.role === 'Admin' && (
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <PackagePlus size={18} /> Tambah Barang
              </button>
            )}
            {(user.role === 'Staff' || user.role === 'Admin') && (
              <button 
                onClick={() => setShowDropdownRequestForm(true)}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                <Hand size={18} /> Form Request Barang
              </button>
            )}
          </div>
        </div>

        {/* Global Notifications */}
        {successMsg && (
          <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg text-green-800 flex items-center gap-3 shadow-sm animate-fade-in">
            <CheckCircle2 /> {successMsg}
          </div>
        )}
        {popupError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-800 flex items-center gap-3 shadow-sm font-semibold animate-fade-in">
            <AlertCircle /> {popupError}
          </div>
        )}

        {/* Admin Add Item Form */}
        {showAddForm && user.role === 'Admin' && (
          <form onSubmit={handleAddItem} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 max-w-2xl">
            <h2 className="text-lg font-semibold mb-4 text-slate-800">Form Tambah Barang Baru</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm mb-1">Nama Barang</label><input required value={newItem.name} onChange={e=>setNewItem({...newItem, name: e.target.value})} className="w-full p-2 border rounded" /></div>
              <div><label className="block text-sm mb-1">SKU</label><input required value={newItem.sku} onChange={e=>setNewItem({...newItem, sku: e.target.value})} className="w-full p-2 border rounded" /></div>
              <div><label className="block text-sm mb-1">Kuantitas Awal</label><input type="number" required value={newItem.quantity} onChange={e=>setNewItem({...newItem, quantity: e.target.value})} className="w-full p-2 border rounded" /></div>
              <div>
                <label className="block text-sm mb-1">Pilih Gudang</label>
                <select required onChange={e=>setNewItem({...newItem, warehouse_id: e.target.value})} className="w-full p-2 border rounded">
                  <option value="">-- Pilih --</option>
                  {warehouses.map(w => <option key={w.ID} value={w.ID}>{w.Name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Kategori Barang (Opsional)</label>
                <select onChange={e=>setNewItem({...newItem, category_id: e.target.value})} className="w-full p-2 border rounded">
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map(c => <option key={c.ID} value={c.ID}>{c.Name}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1 font-medium flex items-center gap-2"><ImageIcon size={16}/> Foto Barang (Opsional)</label>
                <input type="file" accept="image/png, image/jpeg, image/webp" onChange={e => setImageFile(e.target.files[0])} className="w-full p-2 border border-dashed border-indigo-300 rounded bg-indigo-50 text-sm" />
              </div>
            </div>
            <button type="submit" className="mt-4 bg-slate-800 text-white px-6 py-2 rounded shadow-sm">Simpan Data</button>
          </form>
        )}

        {/* Request Modal (Specific Item) */}
        {requestItemData && (
          <RequestForm 
            itemData={requestItemData} 
            onClose={() => setRequestItemData(null)} 
            onSuccess={(msg) => {
              setSuccessMsg(msg);
              setRequestItemData(null);
              fetchData();
              setTimeout(() => setSuccessMsg(''), 3000);
            }}
            onError={(msg) => {
              setPopupError(msg);
              setTimeout(() => setPopupError(''), 4000);
            }}
          />
        )}

        {/* Request Modal (Dropdown/General) */}
        {showDropdownRequestForm && (
          <RequestForm 
            itemData={null} 
            onClose={() => setShowDropdownRequestForm(false)} 
            onSuccess={(msg) => {
              setSuccessMsg(msg);
              setShowDropdownRequestForm(false);
              fetchData();
              setTimeout(() => setSuccessMsg(''), 3000);
            }}
            onError={(msg) => {
              setPopupError(msg);
              setTimeout(() => setPopupError(''), 4000);
            }}
          />
        )}

        {/* Inventory Grid */}
        {loading ? <div className="text-center py-12 text-slate-400">Memuat data barang...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.ID} className="bg-white border text-left border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition flex flex-col">
                <div className="h-48 bg-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-200">
                  {item.ImageURL ? (
                    <img src={getAPIUrl(item.ImageURL)} alt={item.Name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={48} className="text-slate-300" />
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{item.Name}</h3>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 border border-slate-200">{item.SKU}</span>
                  </div>
                  <div className="flex gap-2 items-center mb-4">
                    <p className="text-sm text-slate-500">{item.Warehouse?.Name || 'Gudang Pusat'}</p>
                    {item.Category && (
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs px-2 py-0.5 rounded font-medium">
                        {item.Category.Name}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">STOK TERSEDIA</p>
                      <p className={`text-xl font-bold ${item.Quantity < item.MinStock ? 'text-red-500' : 'text-slate-800'}`}>
                        {item.Quantity} <span className="text-sm font-normal text-slate-500">unit</span>
                      </p>
                    </div>
                    {(user.role === 'Staff' || user.role === 'Admin') && (
                      <button 
                        onClick={() => setRequestItemData(item)}
                        className="bg-indigo-50 text-indigo-700 p-2 rounded-lg hover:bg-indigo-100"
                        title="Pinjam / Ajukan Barang"
                      >
                        <Hand size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && <div className="col-span-full text-center py-12 text-slate-400">Belum ada barang di inventaris. Silakan hubungi Admin.</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
