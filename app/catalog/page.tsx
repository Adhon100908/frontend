'use client';

import { useState, useEffect } from 'react';

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(false);

  // Ambil data dari API backend Vercel secara langsung
  const fetchProducts = async () => {
    try {
      const res = await fetch('https://backend-ten-phi-17.vercel.app/api/products');
      const result = await res.json();
      if (result.success) {
        setProducts(result.data);
      }
    } catch (err) {
      console.log('Error fetch:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Tambah produk
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) {
      alert('Nama sama harganya jangan lupa diisi dulu yaa!');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('https://backend-ten-phi-17.vercel.app/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          price: Number(price),
          stock: Number(stock) || 0,
        }),
      });

      const resData = await res.json();

      if (resData.success) {
        setTitle('');
        setPrice('');
        setStock('');
        fetchProducts();
      } else {
        alert(resData.message || 'Waduh, gagal nge-save barangnya nih');
      }
    } catch (error) {
      alert('Koneksi lagi bermasalah, coba reload bentar ya');
    } finally {
      setLoading(false);
    }
  };

  // Hapus produk
  const handleDelete = async (id: number) => {
    const yakin = confirm('Yakin mau hapus barang ini dari list?');
    if (!yakin) return;

    try {
      const res = await fetch(`https://backend-ten-phi-17.vercel.app/api/products?id=${id}`, {
        method: 'DELETE',
      });
      const resData = await res.json();

      if (resData.success) {
        fetchProducts();
      } else {
        alert(resData.message || 'Gagal hapus data');
      }
    } catch (error) {
      alert('Gagal nge-hapus produknya nih');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6 font-sans text-white">
      <div className="max-w-xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-pink-500">IndoApril</h1>
          <p className="text-sm text-zinc-400">Atur stok barang jualanmu</p>
        </div>

        {/* Form Input */}
        <div className="bg-zinc-900 p-5 rounded-2xl border border-pink-500/30 mb-6 shadow-md">
          <h2 className="text-base font-semibold text-pink-400 mb-4">Input Barang Baru</h2>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Nama Barang</label>
              <input
                type="text"
                placeholder="misal: Lip Gloss, Parfume..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-pink-500 text-white placeholder-zinc-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-pink-500 text-white placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Sisa Stok</label>
                <input
                  type="number"
                  placeholder="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-pink-500 text-white placeholder-zinc-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-medium text-sm rounded-lg transition-colors"
            >
              {loading ? 'Lagi di-save...' : 'Simpan Barang'}
            </button>
          </form>
        </div>

        {/* Tabel Produk */}
        <div className="bg-zinc-900 rounded-2xl border border-pink-500/30 overflow-hidden shadow-md">
          <table className="w-full text-left text-sm">
            <thead className="bg-pink-950/50 text-pink-300 font-medium border-b border-pink-500/20">
              <tr>
                <th className="p-3">Barang</th>
                <th className="p-3">Harga</th>
                <th className="p-3">Stok</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-zinc-500 text-xs">
                    Belum ada barang, yuk tambahin!
                  </td>
                </tr>
              ) : (
                products.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800/50">
                    <td className="p-3 font-medium text-zinc-100">{item.title}</td>
                    <td className="p-3 text-pink-400 font-semibold">
                      Rp {item.price?.toLocaleString('id-ID')}
                    </td>
                    <td className="p-3 text-zinc-300">{item.stock}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-2.5 py-1 bg-pink-950/80 text-pink-400 border border-pink-800 hover:bg-pink-900 text-xs font-medium rounded-md transition-colors"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}