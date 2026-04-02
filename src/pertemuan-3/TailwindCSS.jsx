export default function ComelDashboard() {
  return (
    <div className="min-h-screen bg-[#fdf2f8] p-8 font-sans selection:bg-pink-200">
      {/* Navbar Comel */}
      <nav className="flex justify-between items-center mb-12 bg-white p-5 rounded-full shadow-sm border border-pink-100">
        <h1 className="text-3xl font-bold text-pink-500 tracking-tight">HAY <span className="text-xs text-pink-300">🎀</span></h1>
        <div className="flex gap-8 text-gray-600 font-medium items-center">
          <span className="hover:text-pink-400 cursor-pointer transition">Home ✨</span>
          <span className="hover:text-pink-400 cursor-pointer transition">Project 🚀</span>
          <button className="bg-pink-400 text-white px-8 py-2.5 rounded-full hover:bg-pink-500 transition shadow-md shadow-pink-100 active:scale-95">Login 🌸</button>
        </div>
      </nav>

      {/* Header Gemas */}
      <div className="text-center mb-16 space-y-2">
        <h2 className="text-5xl font-extrabold text-gray-800 tracking-tighter">Tailwind <span className="text-pink-500">Cute-class</span> 🧸</h2>
        <p className="text-gray-500 text-lg max-w-md mx-auto">Eksperimen property CSS yang gemes banget dalam satu tempat! Let's play! 💕</p>
      </div>

      {/* Grid Dashboard */}
      <div className="grid grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Typography Card */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg shadow-gray-50/50 transform hover:-translate-y-1 transition duration-300">
          <div className="flex items-center gap-3 mb-4">
             <span className="text-4xl">✍️</span>
             <h3 className="text-2xl font-bold text-gray-800">Typography</h3>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">Mainin ukuran, ketebalan, dan warna huruf biar tulisannya makin *aesthetic* dan gampang dibaca.</p>
          <button className="w-full border-2 border-pink-300 text-pink-500 py-3 rounded-2xl font-semibold hover:bg-pink-50 transition active:scale-95">Rounded LG Button ☁️</button>
        </div>

        {/* Spacing Card */}
        <div className="bg-[#fff1f2] p-8 rounded-3xl border border-red-100 shadow-lg shadow-red-50/50 transform hover:-translate-y-1 transition duration-300">
          <div className="flex items-center gap-3 mb-4">
             <span className="text-4xl">📏</span>
             <h3 className="text-2xl font-bold text-red-800">Spacing Card</h3>
          </div>
          <p className="text-red-700 italic leading-relaxed bg-white/50 p-4 rounded-xl border border-red-100">Coba atur margin (m-4) buat jarak luar dan padding (p-6) buat jarak dalam. Biar kontennya nggak sesak dan tetep rapi!</p>
        </div>

        {/* Gradients Card */}
        <div className="bg-gradient-to-br from-violet-300 via-pink-300 to-amber-200 p-8 rounded-3xl text-white shadow-xl shadow-pink-100/50 transform hover:scale-[1.02] transition duration-300">
          <div className="flex items-center gap-3 mb-4">
             <span className="text-4xl">🌈</span>
             <h3 className="text-2xl font-bold">Gradients Color</h3>
          </div>
          <p className="text-white/90 text-lg font-medium leading-relaxed">Perpaduan warna-warni *pastel* yang lembut bikin *mood* jadi hepi. Gemes banget kan kombinasinya?</p>
        </div>

        {/* Hover Shadow Card */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-pink-100 transition-all duration-500 group cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
             <span className="text-4xl transform group-hover:rotate-12 transition">☁️</span>
             <h3 className="text-2xl font-bold text-gray-800">Hover Shadow</h3>
          </div>
          <p className="text-gray-500 leading-relaxed group-hover:text-gray-700 transition">Coba deh arahin kursor kamu ke sini. Liat bayangannya jadi makin *soft* dan warnanya berubah dikit. *Magic*! ✨</p>
        </div>

        {/* Full Width Card - Call to Action */}
        <div className="col-span-2 bg-white p-10 rounded-3xl border border-gray-100 shadow-lg shadow-gray-50/50 flex justify-between items-center gap-8 transform hover:shadow-2xl transition duration-500">
          <div className="flex items-center gap-6">
            <span className="text-6xl p-4 bg-pink-50 rounded-full">💝</span>
            <div>
              <h3 className="text-3xl font-extrabold text-gray-800 tracking-tight">Siap Belajar Lebih Lanjut? ✨</h3>
              <p className="text-gray-500 text-lg mt-1 max-w-xl">Yuk, pake utility class Tailwind buat bikin website yang *modern* dan super *cute* tanpa pusing mikirin file CSS ribet!</p>
            </div>
          </div>
          <button className="bg-black text-white px-10 py-5 rounded-full text-lg font-bold shadow-lg shadow-gray-300 hover:bg-gray-800 transition active:scale-95 whitespace-nowrap">Mulai Sekarang 🦄</button>
        </div>
      </div>

      {/* Footer Kecil */}
      <footer className="text-center mt-20 text-pink-300 text-sm">
        Made with 💖 by nesya | Tailwind Cute Edition
      </footer>
    </div>
  );
}