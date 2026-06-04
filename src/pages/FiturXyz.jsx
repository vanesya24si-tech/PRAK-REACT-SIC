import React from "react";

export default function FiturXyz() {
  return (
    <div className="min-h-screen p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search Here..."
            className="w-full max-w-md border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>

        <div className="rounded-3xl border border-gray-100 p-8 shadow-sm bg-gray-50">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Fitur Xyz</h2>
          <p className="text-sm text-gray-500 mb-6">Dashboard / Fitur Xyz</p>
          <div className="rounded-3xl bg-white p-6 border border-gray-100 shadow-sm">
            <p className="text-gray-700">Ini Halaman Fitur Xyz</p>
          </div>
        </div>
      </div>
    </div>
  );
}
