import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse, getCategories, createCategory, updateCategory, deleteCategory } from '../services/inventory.service';
import { Package, MapPin, Edit, Trash2, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MasterData = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('warehouses');
  const [warehouses, setWarehouses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [formData, setFormData] = useState({ name: '', location: '', description: '' });

  // Notification states
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user?.role !== 'Admin') {
      navigate('/');
    } else {
      fetchData();
    }
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const whData = await getWarehouses();
      const catData = await getCategories();
      setWarehouses(whData);
      setCategories(catData);
    } catch (err) {
      console.error(err);
      showMsg('error', 'Gagal memuat data master.');
    }
    setLoading(false);
  };

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 3000);
  };

  const openAddModal = () => {
    setEditMode(false);
    setCurrentId('');
    setFormData({ name: '', location: '', description: '' });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditMode(true);
    setCurrentId(item.ID);
    setFormData({ 
      name: item.Name, 
      location: item.Location || '', 
      description: item.Description || '' 
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'warehouses') {
        if (editMode) await updateWarehouse(currentId, formData);
        else await createWarehouse(formData);
      } else {
        if (editMode) await updateCategory(currentId, { name: formData.name, description: formData.description });
        else await createCategory({ name: formData.name, description: formData.description });
      }
      showMsg('success', `${activeTab === 'warehouses' ? 'Gudang' : 'Kategori'} berhasil ${editMode ? 'diperbarui' : 'ditambahkan'}!`);
      setShowModal(false);
      fetchData();
    } catch (err) {
      showMsg('error', err.response?.data?.error || 'Gagal menyimpan data.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Yakin ingin menghapus ${activeTab === 'warehouses' ? 'gudang' : 'kategori'} ini?`)) return;
    try {
      if (activeTab === 'warehouses') await deleteWarehouse(id);
      else await deleteCategory(id);
      showMsg('success', 'Data berhasil dihapus!');
      fetchData();
    } catch (err) {
      showMsg('error', err.response?.data?.error || 'Gagal menghapus data.');
    }
  };

  if (user?.role !== 'Admin') return null;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Package className="text-indigo-600" /> Manajemen Master Data
        </h1>

        {/* Notifications */}
        {msg.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 shadow-sm animate-fade-in font-medium ${msg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            {msg.type === 'error' ? <AlertCircle /> : <CheckCircle2 />} {msg.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          <button onClick={() => setActiveTab('warehouses')} className={`px-6 py-3 font-semibold text-sm border-b-2 transition ${activeTab === 'warehouses' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            📦 Daftar Gudang
          </button>
          <button onClick={() => setActiveTab('categories')} className={`px-6 py-3 font-semibold text-sm border-b-2 transition ${activeTab === 'categories' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            🏷️ Kategori Barang
          </button>
        </div>

        {/* Header Action */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-slate-500 text-sm">Mengelola data referensi dasar aplikasi.</p>
          <button onClick={openAddModal} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm text-sm font-medium">
            <Plus size={16} /> Tambah {activeTab === 'warehouses' ? 'Gudang' : 'Kategori'}
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading master data...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-sm font-semibold text-slate-600">
                  <th className="p-4 w-1/4">Nama</th>
                  {activeTab === 'warehouses' && <th className="p-4 w-1/4">Lokasi</th>}
                  <th className="p-4">Deskripsi</th>
                  <th className="p-4 w-32 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'warehouses' ? warehouses : categories).map(item => (
                  <tr key={item.ID} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-800">{item.Name}</td>
                    {activeTab === 'warehouses' && <td className="p-4 text-slate-600 flex items-center gap-1"><MapPin size={14} className="text-slate-400"/> {item.Location || '-'}</td>}
                    <td className="p-4 text-slate-500 text-sm">{item.Description || '-'}</td>
                    <td className="p-4 flex justify-center gap-2">
                      <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(item.ID)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
                {(activeTab === 'warehouses' ? warehouses : categories).length === 0 && (
                  <tr><td colSpan={activeTab === 'warehouses' ? 4 : 3} className="p-8 text-center text-slate-400">Data {activeTab === 'warehouses' ? 'gudang' : 'kategori'} kosong.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/50 z-50 flex justify-center items-center backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl border border-slate-200">
              <h3 className="text-xl font-bold bg-slate-100 p-3 rounded-lg flex items-center gap-2 mb-4">
                {editMode ? <Edit size={20} className="text-indigo-600"/> : <Plus size={20} className="text-indigo-600"/>}
                {editMode ? 'Edit' : 'Tambah'} {activeTab === 'warehouses' ? 'Gudang' : 'Kategori'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Nama {activeTab === 'warehouses' ? 'Gudang' : 'Kategori'}</label>
                  <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                {activeTab === 'warehouses' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Lokasi</label>
                    <input value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                )}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Deskripsi Tambahan (Opsional)</label>
                  <textarea value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" rows="3" />
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition">Batal</button>
                  <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-md">Simpan Data</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterData;
