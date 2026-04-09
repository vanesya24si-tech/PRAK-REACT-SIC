import frameworkData from "./framework.json";

export default function FrameworkList() {
  return (
    // Mengubah bg-gray-50 menjadi bg-pink-50
    <div className="min-h-screen bg-pink-50 p-8 md:p-12">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {/* Mengubah text-blue-600 menjadi text-pink-600 */}
          Framework <span className="text-pink-600">Ecosystem</span>
        </h1>
        <p className="text-gray-500 mt-2">Menjelajahi teknologi terbaik untuk pengembangan modern.</p>
      </div>

      {/* Grid Layout */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {frameworkData.map((item) => (
          <div 
            key={item.id} 
            className="group relative flex flex-col justify-between overflow-hidden bg-white border border-pink-100 p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            {/* Background Accent Decor - Diubah ke bg-pink-100 agar lebih lembut */}
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-pink-100 rounded-full transition-transform group-hover:scale-150 duration-500 opacity-50" />

            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                {/* Hover text diubah ke pink-500 */}
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-pink-500 transition-colors">
                  {item.name}
                </h2>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-pink-400 bg-pink-50 px-2 py-1 rounded">
                  {item.details.developer}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2">
                {item.description}
              </p>
            </div>

            <div className="relative">
              {/* Tags Section - Warna tag diubah ke tema pink/rose */}
              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1 text-[11px] font-medium rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Link - Link website diubah ke pink-600 */}
              <div className="pt-4 border-t border-pink-50 flex justify-between items-center">
                <a 
                  href={item.details.officialWebsite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-pink-600 flex items-center gap-1 group/link"
                >
                  Visit Website 
                  <span className="transition-transform group-hover/link:translate-x-1">→</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}