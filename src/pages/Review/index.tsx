import { useState } from 'react';
import {
  ClipboardCheck,
  Search,
  Filter,
  ChevronRight,
  Clock,
  User,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { serviceItems } from '@/data/items';
import StatusBadge from '@/components/StatusBadge';
import type { ReviewStatus } from '@/types';
import { cn } from '@/lib/utils';

export default function Review() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  const reviewItems = serviceItems.filter((item) => item.status === 'reviewing' || item.status === 'published');

  const tabs = [
    { key: 'pending', label: '待我审校', count: 5, icon: Clock, color: 'amber' },
    { key: 'approved', label: '已通过', count: 28, icon: CheckCircle2, color: 'green' },
    { key: 'rejected', label: '已退回', count: 3, icon: XCircle, color: 'red' },
    { key: 'all', label: '全部', count: reviewItems.length, icon: ClipboardCheck, color: 'blue' },
  ];

  const pendingItems = serviceItems.filter((item) => item.status === 'reviewing');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const colorClasses: Record<string, string> = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            amber: 'bg-amber-50 text-amber-600',
            red: 'bg-red-50 text-red-600',
          };

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={cn(
                'bg-white rounded-xl p-5 shadow-sm border transition-all text-left',
                activeTab === tab.key
                  ? 'border-blue-500 ring-2 ring-blue-100'
                  : 'border-slate-200 hover:shadow-md'
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', colorClasses[tab.color])}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{tab.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{tab.count}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-100">
          <div className="flex items-center justify-between px-5 py-4">
            <h3 className="font-semibold text-slate-800">
              {activeTab === 'pending' ? '待我审校' : activeTab === 'approved' ? '已通过' : activeTab === 'rejected' ? '已退回' : '全部审校事项'}
            </h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索事项..."
                  className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
                <Filter className="w-4 h-4" />
                筛选
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {pendingItems.map((item, index) => (
            <div key={item.id} className="p-5 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <h4 className="font-medium text-slate-800 text-lg">{item.name}</h4>
                    <StatusBadge status={item.status} />
                    <span className="text-xs text-slate-400">{item.code}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      <span>申报部门：{item.department}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>提交时间：{item.updatedAt}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4" />
                      <span>会签部门：3个</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-slate-500">审校流程</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((step, idx) => (
                        <div key={step} className="flex items-center">
                          <div
                            className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
                              idx < 2
                                ? 'bg-green-500 text-white'
                                : idx === 2
                                ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                                : 'bg-slate-100 text-slate-400'
                            )}
                          >
                            {idx < 2 ? <CheckCircle2 className="w-4 h-4" /> : step}
                          </div>
                          {idx < 4 && (
                            <div
                              className={cn(
                                'w-12 h-0.5',
                                idx < 2 ? 'bg-green-500' : 'bg-slate-100'
                              )}
                            ></div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <span>当前环节：</span>
                      <span className="font-medium text-blue-600">跨部门会签</span>
                      <span>·</span>
                      <span>剩余 2 个节点</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-6">
                  <button
                    onClick={() => navigate(`/review/${item.id}`)}
                    className="flex items-center gap-1 px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    查看详情
                  </button>
                  <button
                    onClick={() => navigate(`/review/${item.id}/approve`)}
                    className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    通过
                  </button>
                  <button
                    onClick={() => navigate(`/review/${item.id}/reject`)}
                    className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    退回
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pendingItems.length === 0 && (
          <div className="py-16 text-center">
            <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">暂无待审校事项</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-4">会签流转中的事项</h3>
        <div className="grid grid-cols-2 gap-4">
          {serviceItems.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
              onClick={() => navigate(`/review/${item.id}`)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-slate-800">{item.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{item.code}</p>
                </div>
                <StatusBadge status="reviewing" size="sm" />
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">会签进度：2/5</span>
                <span className="text-blue-600 flex items-center gap-1">
                  查看详情
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
