import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  FileEdit,
  ClipboardCheck,
  GitBranch,
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    key: 'dashboard',
    label: '工作台',
    icon: LayoutDashboard,
    path: '/dashboard',
    badge: '3',
  },
  {
    key: 'item-library',
    label: '事项库',
    icon: Database,
    path: '/item-library',
  },
  {
    key: 'compilation',
    label: '编制台',
    icon: FileEdit,
    path: '/compilation',
    badge: '12',
  },
  {
    key: 'review',
    label: '审校中心',
    icon: ClipboardCheck,
    path: '/review',
    badge: '5',
  },
  {
    key: 'version',
    label: '版本发布',
    icon: GitBranch,
    path: '/version',
  },
  {
    key: 'supervision',
    label: '督办看板',
    icon: BarChart3,
    path: '/supervision',
  },
  {
    key: 'knowledge',
    label: '知识规则',
    icon: BookOpen,
    path: '/knowledge',
  },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, setCurrentPage } = useUIStore();
  const location = useLocation();

  const getCurrentPage = () => {
    const path = location.pathname.split('/')[1];
    return path || 'dashboard';
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-50',
        sidebarCollapsed ? 'w-16' : 'w-60'
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">政</span>
            </div>
            <span className="font-semibold text-lg">清单管理平台</span>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="w-8 h-8 mx-auto rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">政</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            'p-1 rounded hover:bg-slate-700 transition-colors',
            sidebarCollapsed && 'absolute -right-3 top-5 bg-slate-700 rounded-full'
          )}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      <nav className="py-4 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = getCurrentPage() === item.key;

            return (
              <li key={item.key}>
                <NavLink
                  to={item.path}
                  onClick={() => setCurrentPage(item.key)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group',
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 flex-shrink-0 transition-colors',
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    )}
                  />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 font-medium">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            'px-2 py-0.5 text-xs font-medium rounded-full',
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-700 text-slate-300'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700 p-3">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
          {!sidebarCollapsed && <span className="text-sm font-medium">系统设置</span>}
        </NavLink>
      </div>
    </aside>
  );
}
