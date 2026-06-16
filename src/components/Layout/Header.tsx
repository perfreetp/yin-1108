import { Search, Bell, User, ChevronDown, HelpCircle, Globe } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useState } from 'react';

const pageTitles: Record<string, string> = {
  dashboard: '工作台',
  'item-library': '事项库',
  compilation: '编制台',
  review: '审校中心',
  version: '版本发布',
  supervision: '督办看板',
  knowledge: '知识规则',
  settings: '系统设置',
};

export default function Header({ currentPage }: { currentPage: string }) {
  const { user, level, setLevel } = useUserStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const pageTitle = pageTitles[currentPage] || '政务服务事项管理平台';

  const levels = [
    { value: 'provincial', label: '省级' },
    { value: 'municipal', label: '市级' },
    { value: 'county', label: '县级' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-slate-800">{pageTitle}</h1>
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {levels.map((lvl) => (
            <button
              key={lvl.value}
              onClick={() => setLevel(lvl.value as any)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                level === lvl.value
                  ? 'bg-white text-blue-600 shadow-sm font-medium'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索事项、模板、规则..."
            className="w-72 pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Globe className="w-5 h-5" />
        </button>

        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>

        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="h-6 w-px bg-slate-200"></div>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-slate-700">{user?.name || '用户'}</p>
              <p className="text-xs text-slate-500">{user?.department || ''}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
              <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                个人资料
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                修改密码
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
