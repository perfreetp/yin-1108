import { useState } from 'react';
import {
  FileEdit,
  Search,
  Plus,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Copy,
  Upload,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { serviceItems } from '@/data/items';
import StatusBadge from '@/components/StatusBadge';
import type { ItemStatus } from '@/types';
import { cn } from '@/lib/utils';

export default function Compilation() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'reviewing' | 'returned'>('all');
  const [keyword, setKeyword] = useState('');

  const tabs = [
    { key: 'all', label: '全部', count: serviceItems.length },
    { key: 'draft', label: '草稿', count: serviceItems.filter((i) => i.status === 'draft').length },
    {
      key: 'reviewing',
      label: '审核中',
      count: serviceItems.filter((i) => i.status === 'reviewing').length,
    },
    {
      key: 'returned',
      label: '已退回',
      count: serviceItems.filter((i) => i.status === 'returned').length,
    },
  ];

  const filteredItems = serviceItems.filter((item) => {
    if (activeTab !== 'all' && item.status !== activeTab) {
      return false;
    }
    if (keyword) {
      const kw = keyword.toLowerCase();
      if (
        !item.name.toLowerCase().includes(kw) &&
        !item.code.toLowerCase().includes(kw)
      ) {
        return false;
      }
    }
    return true;
  });

  const stats = [
    { label: '我的编制', value: 12, icon: FileEdit, color: 'blue' },
    { label: '待提交', value: 5, icon: Clock, color: 'amber' },
    { label: '已通过', value: 28, icon: CheckCircle2, color: 'green' },
    { label: '被退回', value: 3, icon: AlertCircle, color: 'red' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses: Record<string, string> = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            amber: 'bg-amber-50 text-amber-600',
            red: 'bg-red-50 text-red-600',
          };

          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-200"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    colorClasses[stat.color]
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-100">
          <div className="flex items-center justify-between px-5">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={cn(
                    'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                    activeTab === tab.key
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      'ml-2 px-2 py-0.5 text-xs rounded-full',
                      activeTab === tab.key
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-md transition-colors">
                <Upload className="w-4 h-4" />
                批量导入
              </button>
              <button
                onClick={() => navigate('/compilation/new')}
                className="flex items-center gap-2 px-4 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                新建编制
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索事项名称、编码..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
              <Filter className="w-4 h-4" />
              筛选
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => navigate(`/compilation/${item.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                      item.status === 'draft'
                        ? 'bg-slate-100 text-slate-600'
                        : item.status === 'reviewing'
                        ? 'bg-amber-100 text-amber-600'
                        : item.status === 'returned'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-blue-100 text-blue-600'
                    )}
                  >
                    <FileEdit className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-slate-800">{item.name}</h4>
                      <StatusBadge status={item.status} size="sm" />
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      {item.code} · {item.department}
                    </p>
                    {item.status === 'returned' && (
                      <p className="text-xs text-red-600 mt-2 bg-red-50 px-2 py-1 rounded inline-block">
                        退回原因：办理流程与受理条件不匹配，请修正
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/item-library/${item.id}`);
                    }}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="查看"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/compilation/${item.id}`);
                    }}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="编辑"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="复制"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-500">编制进度</span>
                  <span className="text-xs font-medium text-slate-700">
                    {item.progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      item.progress >= 100
                        ? 'bg-green-500'
                        : item.progress >= 50
                        ? 'bg-blue-500'
                        : 'bg-amber-500'
                    )}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span>创建时间：{item.createdAt}</span>
                  <span>更新时间：{item.updatedAt}</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  继续编制
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-16 text-center">
            <FileEdit className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">暂无相关事项</p>
            <button
              onClick={() => navigate('/compilation/new')}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700"
            >
              + 新建编制事项
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
