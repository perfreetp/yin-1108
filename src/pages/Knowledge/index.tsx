import { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  FileText,
  AlertTriangle,
  FileQuestion,
  BookCheck,
  ChevronRight,
  Eye,
  ThumbsUp,
  Clock,
  Tag,
  Plus,
  Lightbulb,
  ShieldAlert,
  ScrollText,
} from 'lucide-react';
import { knowledgeItems, validationRules } from '@/data/knowledge';
import StatusBadge from '@/components/StatusBadge';
import { cn } from '@/lib/utils';

export default function Knowledge() {
  const [activeTab, setActiveTab] = useState<'all' | 'rule' | 'case' | 'specification' | 'faq'>('all');
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: '全部', count: knowledgeItems.length, icon: BookOpen },
    { key: 'specification', label: '编制规范', count: knowledgeItems.filter((k) => k.type === 'specification').length, icon: ScrollText },
    { key: 'case', label: '常见错误', count: knowledgeItems.filter((k) => k.type === 'case').length, icon: ShieldAlert },
    { key: 'rule', label: '校验规则', count: validationRules.length, icon: Lightbulb },
    { key: 'faq', label: '常见问题', count: knowledgeItems.filter((k) => k.type === 'faq').length, icon: FileQuestion },
  ];

  const typeLabels: Record<string, { label: string; color: string; icon: any }> = {
    specification: { label: '编制规范', color: 'bg-blue-100 text-blue-700', icon: ScrollText },
    case: { label: '常见错误', color: 'bg-red-100 text-red-700', icon: ShieldAlert },
    rule: { label: '校验规则', color: 'bg-amber-100 text-amber-700', icon: Lightbulb },
    faq: { label: '常见问题', color: 'bg-green-100 text-green-700', icon: FileQuestion },
  };

  const filteredItems = knowledgeItems.filter((item) => {
    if (activeTab !== 'all' && item.type !== activeTab) {
      return false;
    }
    if (keyword) {
      const kw = keyword.toLowerCase();
      if (
        !item.title.toLowerCase().includes(kw) &&
        !item.content.toLowerCase().includes(kw)
      ) {
        return false;
      }
    }
    return true;
  });

  const ruleCategories = [
    { key: '时限校验', count: 2 },
    { key: '联动校验', count: 2 },
    { key: '材料校验', count: 1 },
    { key: '内容校验', count: 2 },
    { key: '情形校验', count: 1 },
    { key: '格式校验', count: 1 },
  ];

  return (
    <div className="flex gap-6">
      <div className="w-60 flex-shrink-0 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">知识分类</h3>
          </div>
          <div className="p-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.key;

              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveTab(cat.key as typeof activeTab)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5',
                      isActive ? 'text-blue-600' : 'text-slate-400'
                    )}
                  />
                  <span className="flex-1 font-medium">{cat.label}</span>
                  <span
                    className={cn(
                      'px-2 py-0.5 text-xs font-medium rounded-full',
                      isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'rule' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">规则分类</h3>
            </div>
            <div className="p-2">
              {ruleCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors',
                  selectedCategory === cat.key
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <span>{cat.key}</span>
                <span className="text-xs text-slate-400">{cat.count}</span>
              </button>
            ))}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <Lightbulb className="w-8 h-8 mb-3 opacity-80" />
          <h4 className="font-semibold mb-2">智能校验助手</h4>
          <p className="text-sm opacity-80 mb-3">
            系统内置 10+ 条校验规则，帮助您快速发现编制中的问题
          </p>
          <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
            启用全部规则
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索知识、规则、案例..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
                <Filter className="w-4 h-4" />
                筛选
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                新建知识点
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'rule' ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">校验规则列表</h3>
              <p className="text-sm text-slate-500 mt-1">
                共 {validationRules.length} 条规则，已启用 {validationRules.filter((r) => r.enabled).length} 条
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {validationRules.map((rule) => {
                const severityConfig = {
                  error: { color: 'bg-red-100 text-red-600', label: '错误' },
                  warning: { color: 'bg-amber-100 text-amber-600', label: '警告' },
                  info: { color: 'bg-blue-100 text-blue-600', label: '提示' },
                };

                return (
                  <div key={rule.id} className="p-5 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center',
                            severityConfig[rule.severity].color
                          )}
                        >
                          {rule.severity === 'error' ? (
                            <AlertTriangle className="w-5 h-5" />
                          ) : rule.severity === 'warning' ? (
                            <ShieldAlert className="w-5 h-5" />
                          ) : (
                            <Lightbulb className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-slate-800">{rule.name}</h4>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-mono rounded">
                              {rule.code}
                            </span>
                            <span
                              className={cn(
                              'px-2 py-0.5 text-xs font-medium rounded-full',
                              severityConfig[rule.severity].color
                            )}
                            >
                              {severityConfig[rule.severity].label}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">{rule.description}</p>
                          <div className="mt-2 flex items-center gap-3">
                            <span className="text-xs text-slate-400">分类：{rule.category}</span>
                            {rule.field && (
                              <span className="text-xs text-slate-400">字段：{rule.field}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div
                          className="relative w-11 h-6 rounded-full transition-colors cursor-pointer"
                          style={{ backgroundColor: rule.enabled ? '#3b82f6' : '#e2e8f0' }}
                        >
                          <div
                            className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                            style={{ transform: rule.enabled ? 'translateX(22px)' : 'translateX(2px)' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const typeInfo = typeLabels[item.type] || typeLabels.specification;
              const Icon = typeInfo.icon;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:border-blue-200 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      typeInfo.color
                    )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded-full',
                        typeInfo.color
                      )}
                    >
                      {typeInfo.label}
                    </span>
                  </div>

                  <h4 className="font-medium text-slate-800 mb-2 line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                    {item.content.replace(/[#*]/g, '').slice(0, 100)}...
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{item.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.updatedAt.split(' ')[0]}</span>
                      </div>
                    </div>
                    <button className="text-sm text-blue-600 flex items-center gap-1 hover:text-blue-700">
                      查看详情
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab !== 'rule' && filteredItems.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 py-16 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">暂无相关知识内容</p>
          </div>
        )}
      </div>
    </div>
  );
}
