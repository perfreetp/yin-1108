import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

export default function MainLayout() {
  const { sidebarCollapsed, currentPage, setCurrentPage } = useUIStore();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    setCurrentPage(path || 'dashboard');
  }, [location.pathname, setCurrentPage]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300 min-h-screen flex flex-col',
          sidebarCollapsed ? 'ml-16' : 'ml-60'
        )}
      >
        <Header currentPage={currentPage} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
