import React from "react";

export default function PageHeader({ title = "Dashboard", breadcrumb = "Dashboard / Overview", children }) {
  return (
    <div className="flex justify-between items-center mb-6">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        
        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
          {breadcrumb.split(' / ').map((part, index) => (
            <React.Fragment key={index}>
              <span className={index === 0 ? "text-gray-500" : "text-gray-400"}>{part}</span>
              {index < breadcrumb.split(' / ').length - 1 && <span>/</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right Content (Tombol/Form) */}
      <div>
        {children}
      </div>
    </div>
  );
}