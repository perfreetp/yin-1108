import { useState } from 'react';
import {
  GitBranch,
  Search,
  Plus,
  Eye,
  Download,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Diff,
  RotateCcw,
  Send,
  ChevronDown,
  ChevronRight,
  Tag,
  Calendar,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '@/components/StatusBadge';
import { announcements } from '@/data/knowledge';
import { cn } from '@/lib/utils';

export default function Version() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'versions' | 'announcements'>('versions');
  const [expandedItems, setExpandedItems] = useState<string[]>(['item-001']);

  const itemVersions = [
    {
      id: 'item-001',
      name: '企业设立登记',
      code: 'XK-SC-001',
      department: '省市场监督管理局',
      currentVersion: 'v2.1',
      status: 'published',
      versions: [
        {
          id: 'ver-003',
          version: 'v2.1',
          status: 'published',
          publishDate: '2025-03-20',
          createdBy: '李四',
          createdAt: '2025-03-18 14:00:00',
          changes: ['调整承诺办理时限', '更正联系方式信息'],
          size: '156KB',
        },
        {
          id: 'ver-002',
          version: 'v2.0',
          status: 'superseded',
          publishDate: '2025-02-28',
          createdBy: '李四',
          createdAt: '2025-02-25 10:00:00',
          changes: ['优化受理条件描述', '新增情形化要素', '补充申请材料说明'],
          size: '152KB',
        },
        {
          id: 'ver-001',
          version: 'v1.0',
          status: 'superseded',
          publishDate: '2025-02-01',
          createdBy: '张三',
          createdAt: '2025-01-25 09:00:00',
          changes: ['初始版本发布'],
          size: '148KB',
        },
      ],
    },
    {
      id: 'item-002',
      name: '食品经营许可证核发',
      code: 'XK-SC-002',
      department: '省市场监督管理局',
      currentVersion: 'v1.3',
      status: 'reviewing',
      versions: [
        {
          id: 'ver-004',
          version: 'v1.3',
          status: 'draft',
          createdBy: '王五',
          createdAt: '2025-03-22 16:45:00',
          changes: ['新增材料要求', '调整办理流程'],
          size: '145KB',
        },
        {
          id: 'ver-003',
          version: 'v1.2',
          status: 'published',
          publishDate: '2025-03-15',
          createdBy: '王五',
          createdAt: '2025-03-10 14:30:00',
          changes: ['修正法定依据引用'],
          size: '142KB',
        },
      ],
    },
    {
      id: 'item-003',
      name: '户口迁移审批',
      code: 'XK-GA-001',
      department: '省公安厅',
      currentVersion: 'v0.8',
      status: 'draft',
      versions: [
        {
          id: 'ver-001',
          version: 'v0.8',
          status: 'draft',
          createdBy: '赵六',
          createdAt: '2025-03-21 11:20:00',
          changes: ['补充办理材料信息', '完善流程说明'],
          size: '138KB',
        },
      ],
    },
  ];

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <GitBranch className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">总版本数</p>
              <p className="text-2xl font-bold text-slate-800">186</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">已发布版本</p>
              <p className="text-2xl font-bold text-slate-800">156</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">待发布版本</p>
              <p className="text-2xl font-bold text-slate-800">24</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">版本冲突</p>
              <p className="text-2xl font-bold text-slate-800">2</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-100">
          <div className="flex items-center justify-between px-5">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('versions')}
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === 'versions'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                )}
              >
                版本管理
              </button>
              <button
                onClick={() => setActiveTab('announcements')}
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === 'announcements'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                )}
              >
                发布公告
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索事项..."
                  className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => navigate('/announcement/new')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                发布公告
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'versions' ? (
          <div className="divide-y divide-slate-100">
            {itemVersions.map((item) => {
              const isExpanded = expandedItems.includes(item.id);

              return (
                <div key={item.id}>
                  <div
                    className="p-5 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => toggleExpand(item.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </button>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-slate-800">{item.name}</h4>
                            <StatusBadge status={item.status} size="sm" />
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {item.code} · {item.department} · 当前版本 {item.currentVersion}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500">
                          共 {item.versions.length} 个版本
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/version/compare`);
                            }}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="版本对比"
                          >
                            <Diff className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/version/${item.id}`);
                            }}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-slate-50 border-t border-slate-100">
                      <div className="relative pl-8 pr-5 py-4">
                        <div className="absolute left-9 top-4 bottom-4 w-0.5 bg-slate-200"></div>
                        {item.versions.map((ver, idx) => (
                          <div
                            key={ver.id}
                            className={cn(
                              'relative pl-6 pb-4 last:pb-0',
                              idx < item.versions.length - 1 && 'pb-5'
                            )}
                          >
                            <div
                              className={cn(
                                'absolute left-0 top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm',
                                ver.status === 'published'
                                  ? 'bg-green-500'
                                  : ver.status === 'superseded'
                                  ? 'bg-slate-400'
                                  : 'bg-amber-500'
                              )}
                            ></div>
                            <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-blue-500" />
                                    <span className="font-semibold text-slate-800">
                                      {ver.version}
                                    </span>
                                    <StatusBadge status={ver.status} size="sm" />
                                    {idx === 0 && ver.status === 'published' && (
                                      <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded">
                                        当前版本
                                      </span>
                                    )}
                                  </div>
                                  <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                                    <div className="flex items-center gap-1">
                                      <User className="w-3.5 h-3.5" />
                                      {ver.createdBy}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-3.5 h-3.5" />
                                      {ver.createdAt}
                                    </div>
                                    {ver.publishDate && (
                                      <div className="flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        发布于 {ver.publishDate}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1">
                                  {ver.status === 'draft' && (
                                    <button
                                      onClick={() => {}}
                                      className="flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                      <Send className="w-3.5 h-3.5" />
                                      发布
                                    </button>
                                  )}
                                  {ver.status !== 'draft' && (
                                    <button
                                      onClick={() => {}}
                                      className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5" />
                                      回退
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {}}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    查看
                                  </button>
                                  <button
                                    onClick={() => {}}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    下载
                                  </button>
                                </div>
                              </div>

                              <div className="mt-3 pt-3 border-t border-slate-100">
                                <p className="text-xs text-slate-500 mb-2">变更内容：</p>
                                <ul className="space-y-1">
                                  {ver.changes.map((change, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2 text-sm text-slate-600"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                                      {change}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-5 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/announcement/${ann.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                        ann.type === 'release'
                          ? 'bg-green-50 text-green-600'
                          : ann.type === 'change'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-amber-50 text-amber-600'
                      )}
                    >
                      {ann.type === 'release' ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : ann.type === 'change' ? (
                        <ArrowUpDown className="w-6 h-6" />
                      ) : (
                        <Send className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">{ann.title}</h4>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {ann.content}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                        <span>{ann.publisher}</span>
                        <span>{ann.publishDate}</span>
                        {ann.version && <span>版本：{ann.version}</span>}
                      </div>
                    </div>
                  </div>
                  <button className="text-blue-600 text-sm flex items-center gap-1">
                    查看详情
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
