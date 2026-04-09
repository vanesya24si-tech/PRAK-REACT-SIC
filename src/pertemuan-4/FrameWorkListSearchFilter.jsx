import { useState } from "react";
import frameworkData from "./framework.json";

export default function FrameworkListSerchFilter() {
  const [dataForm, setDataForm] = useState({
    searchTerm: "",
    selectedTag: "",
  });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm({
      ...dataForm,
      [name]: value,
    });
  };

  const _searchTerm = dataForm.searchTerm.toLowerCase();
  
  const filteredFrameworks = frameworkData.filter((framework) => {
    const matchesSearch =
      framework.name.toLowerCase().includes(_searchTerm) ||
      framework.description.toLowerCase().includes(_searchTerm) ||
      framework.details.developer.toLowerCase().includes(_searchTerm);

    // PERBAIKAN: Gunakan dataForm.selectedTag
    const matchesTag = dataForm.selectedTag
      ? framework.tags.includes(dataForm.selectedTag)
      : true;

    return matchesSearch && matchesTag;
  });

  const allTags = [
    ...new Set(frameworkData.flatMap((framework) => framework.tags)),
  ];

  return (
    <div className="min-h-screen bg-pink-50 p-8 md:p-12">
      <div className="max-w-5xl mx-auto mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Framework <span className="text-pink-600">Ecosystem</span>
        </h1>
        <p className="text-gray-500 mt-2">Cari dan filter framework favoritmu.</p>
      </div>

      {/* Kontrol Pencarian & Filter */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input
          type="text"
          name="searchTerm"
          placeholder="Cari nama, deskripsi, atau developer..."
          className="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
          onChange={handleChange}
        />

        <select
          name="selectedTag"
          className="w-full p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
          onChange={handleChange} // Tambahkan ini agar select berfungsi
        >
          <option value="">Semua Kategori (All Tags)</option>
          {allTags.map((tag, index) => (
            <option key={index} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {/* Grid Layout */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFrameworks.map((item) => (
          <div key={item.id} className="group relative flex flex-col justify-between overflow-hidden bg-white border border-pink-100 p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-pink-100 rounded-full transition-transform group-hover:scale-150 duration-500 opacity-50" />
            
            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors">{item.name}</h2>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-pink-400 bg-pink-50 px-2 py-1 rounded">
                  {item.details.developer}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-6 line-clamp-2">{item.description}</p>
            </div>

            <div className="relative">
              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map((tag, index) => (
                  <span key={index} className="bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1 text-[11px] font-medium rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="pt-4 border-t border-pink-50 flex justify-between items-center">
                <a href={item.details.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-pink-600 flex items-center gap-1 group/link">
                  Visit Website <span className="transition-transform group-hover/link:translate-x-1">→</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pesan jika data tidak ditemukan */}
      {filteredFrameworks.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          Framework tidak ditemukan... 🌸
        </div>
      )}
    </div>
  );
}