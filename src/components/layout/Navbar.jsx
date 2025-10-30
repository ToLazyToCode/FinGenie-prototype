import { useState } from 'react';

function Navbar({ activeSection, setActiveSection }) {
  const sections = [
    { id: 'overview', name: 'Tổng quan & Mô phỏng' },
    { id: 'mvp', name: 'Tính năng MVP' },
    { id: 'bmc', name: 'Mô hình Kinh doanh' },
    { id: 'roadmap', name: 'Lộ trình' }
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-emerald-600">FinGenie</span>
            <span className="text-xs text-slate-500 ml-2 pt-2">Báo cáo Tương tác</span>
          </div>
          {/* Điều hướng */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`nav-btn inline-flex items-center px-1 pt-1 text-sm font-medium text-slate-600 hover:text-emerald-600 ${
                  activeSection === section.id ? 'active' : ''
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
