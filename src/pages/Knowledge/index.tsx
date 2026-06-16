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
  X,
  CheckCircle2,
  BookMarked,
  User,
  Calendar,
  Copy,
  Share2,
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { useKnowledgeStore } from '@/store/knowledgeStore';
import { cn } from '@/lib/utils';

export default function Knowledge() {
  const [activeTab, setActiveTab] = useState<'all' | 'rule' | 'case' | 'specification' | 'faq'>('all');
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    rules,
    knowledgeItems,
    selectedKnowledge,
    showKnowledgeModal,
    successMessage,
    toggleRule,
    enableAllRules,
    disableAllRules,
    openKnowledgeModal,
    closeKnowledgeModal,
  } = useKnowledgeStore();

  const categories = [
    { key: 'all', label: '全部', count: knowledgeItems.length, icon: BookOpen },
    { key: 'specification', label: '编制规范', count: knowledgeItems.filter((k) => k.type === 'specification').length, icon: ScrollText },
    { key: 'case', label: '常见错误', count: knowledgeItems.filter((k) => k.type === 'case').length, icon: ShieldAlert },
    { key: 'rule', label: '校验规则', count: rules.length, icon: Lightbulb },
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

  const filteredRules = rules.filter((rule) => {
    if (selectedCategory && rule.category !== selectedCategory) {
      return false;
    }
    if (keyword) {
      const kw = keyword.toLowerCase();
      if (
        !rule.name.toLowerCase().includes(kw) &&
        !rule.description.toLowerCase().includes(kw)
      ) {
        return false;
      }
    }
    return true;
  });

  const ruleCategories = [
    { key: '时限校验', count: rules.filter((r) => r.category === '时限校验').length },
    { key: '联动校验', count: rules.filter((r) => r.category === '联动校验').length },
    { key: '材料校验', count: rules.filter((r) => r.category === '材料校验').length },
    { key: '内容校验', count: rules.filter((r) => r.category === '内容校验').length },
    { key: '情形校验', count: rules.filter((r) => r.category === '情形校验').length },
    { key: '格式校验', count: rules.filter((r) => r.category === '格式校验').length },
  ];

  return (
    <div className="flex gap-6">
      <div className="w-60 flex-shrink-0 space-y-4">
        {successMessage && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <p className="text-xs text-green-700 font-medium">{successMessage}</p>
          </div>
        )}

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
                  onClick={() => {
                    setActiveTab(cat.key as typeof activeTab);
                    setSelectedCategory(null);
                  }}
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
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors mb-1',
                  selectedCategory === null
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <span>全部规则</span>
                <span className="text-xs text-slate-400">{rules.length}</span>
              </button>
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
            系统内置 {rules.length} 条校验规则，已启用 {rules.filter((r) => r.enabled).length} 条
          </p>
          <div className="space-y-2">
            <button
              onClick={enableAllRules}
              className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
            >
              启用全部规则
            </button>
            <button
              onClick={disableAllRules}
              className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
            >
              停用全部规则
            </button>
          </div>
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
                共 {filteredRules.length} 条规则，已启用 {filteredRules.filter((r) => r.enabled).length} 条
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {filteredRules.map((rule) => {
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

                      <button
                        onClick={() => toggleRule(rule.id)}
                        className="flex items-center gap-2"
                        title={rule.enabled ? '点击停用' : '点击启用'}
                      >
                        <div
                          className={cn(
                            'relative w-11 h-6 rounded-full transition-colors',
                            rule.enabled ? 'bg-blue-500' : 'bg-slate-300'
                          )}
                        >
                          <div
                            className={cn(
                              'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all',
                              rule.enabled ? 'left-[22px]' : 'left-[2px]'
                            )}
                          ></div>
                        </div>
                        <span
                          className={cn(
                            'text-xs font-medium',
                            rule.enabled ? 'text-blue-600' : 'text-slate-400'
                          )}
                        >
                          {rule.enabled ? '已启用' : '已停用'}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
              {filteredRules.length === 0 && (
                <div className="py-16 text-center">
                  <Lightbulb className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">暂无相关校验规则</p>
                </div>
              )}
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
                  onClick={() => openKnowledgeModal(item)}
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
                    {item.content.replace(/[#*]/g, '').slice(0, 120)}
                    {item.content.length > 120 && '...'}
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
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{item.likes}</span>
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

      {showKnowledgeModal && selectedKnowledge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    (typeLabels[selectedKnowledge.type] || typeLabels.specification).color
                  )}
                >
                  {(() => {
                    const Icon = (typeLabels[selectedKnowledge.type] || typeLabels.specification).icon;
                    return <Icon className="w-6 h-6" />;
                  })()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-semibold text-slate-800">
                      {selectedKnowledge.title}
                    </h3>
                    <span
                      className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded-full',
                        (typeLabels[selectedKnowledge.type] || typeLabels.specification).color
                      )}
                    >
                      {(typeLabels[selectedKnowledge.type] || typeLabels.specification).label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {selectedKnowledge.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      更新于 {selectedKnowledge.updatedAt}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {selectedKnowledge.views} 次浏览
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {selectedKnowledge.likes} 个赞
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={closeKnowledgeModal}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="flex flex-wrap gap-1.5 mb-5">
                {selectedKnowledge.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                  >
                    <Tag className="w-3 h-3 inline mr-1" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="prose prose-slate max-w-none">
                {selectedKnowledge.content.split('\n').map((line, idx) => {
                  if (line.startsWith('## ')) {
                    return (
                      <h2 key={idx} className="text-lg font-bold text-slate-800 mt-6 mb-3 flex items-center gap-2">
                        <BookMarked className="w-5 h-5 text-blue-500" />
                        {line.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (line.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="text-base font-semibold text-slate-700 mt-4 mb-2">
                        {line.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (line.startsWith('- ')) {
                    return (
                      <li key={idx} className="text-slate-600 text-sm leading-relaxed ml-4 list-disc">
                        {line.replace('- ', '')}
                      </li>
                    );
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <p key={idx} className="font-semibold text-slate-700 mt-2 mb-1">
                        {line.replace(/\*\*/g, '')}
                      </p>
                    );
                  }
                  if (line.trim() === '') {
                    return <div key={idx} className="h-2" />;
                  }
                  return (
                    <p key={idx} className="text-slate-600 text-sm leading-relaxed mb-2">
                      {line}
                    </p>
                  );
                })}
              </div>

              {selectedKnowledge.type === 'case' && (
                <div className="mt-6 p-5 bg-red-50 border border-red-100 rounded-xl">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5" />
                    常见错误示例
                  </h4>
                  <div className="space-y-2 text-sm text-red-700">
                    <div className="p-3 bg-white rounded-lg border border-red-100">
                      <p className="font-medium mb-1">❌ 错误写法：</p>
                      <p>承诺时限：20个工作日（超出法定时限15个工作日）</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-green-200 bg-green-50">
                      <p className="font-medium mb-1 text-green-800">✅ 正确写法：</p>
                      <p className="text-green-700">承诺时限：10个工作日（不超过法定时限15个工作日）</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedKnowledge.type === 'specification' && (
                <div className="mt-6 p-5 bg-blue-50 border border-blue-100 rounded-xl">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    编制规范要点
                  </h4>
                  <ul className="space-y-2">
                    {[
                      '事项名称应使用国家标准规范表述，不得使用简称或口语化表述',
                      '法定依据必须引用现行有效法律法规，标注文号和具体条款',
                      '申请材料应明确材料类型、份数、规格要求、来源渠道',
                      '受理条件应为可量化、可验证的具体条件，避免模糊表述',
                      '办理流程应明确每个环节的办理主体、时限、输出结果',
                    ].map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-blue-700">
                        <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedKnowledge.attachments && selectedKnowledge.attachments.length > 0 && (
                <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-slate-500" />
                    相关附件
                  </h4>
                  <div className="space-y-2">
                    {selectedKnowledge.attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{att.name}</p>
                            <p className="text-xs text-slate-400">{att.size}</p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          下载
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  有用
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <Copy className="w-4 h-4" />
                  复制链接
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                  分享
                </button>
              </div>
              <button
                onClick={closeKnowledgeModal}
                className="px-5 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
