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
  X,
  ArrowRight,
  Printer,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '@/components/StatusBadge';
import { useVersionStore } from '@/store/versionStore';
import { cn } from '@/lib/utils';

export default function Version() {
  const navigate = useNavigate();
  const {
    versionItems,
    announcements,
    successMessage,
    publishVersion,
    rollbackVersion,
    openVersionModal,
    closeVersionModal,
    showVersionModal,
    selectedVersion,
    downloadVersion,
    openCompareModal,
    showCompareModal,
    compareVersions,
    closeCompareModal,
  } = useVersionStore();

  const [activeTab, setActiveTab] = useState<'versions' | 'announcements'>('versions');
  const [expandedItems, setExpandedItems] = useState<string[]>(['item-001']);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isExpanded = (id: string) => expandedItems.includes(id);

  return (
    <div className="space-y-4">
      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <p className="text-green-800 font-medium">{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <GitBranch className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">总版本数</p>
              <p className="text-2xl font-bold text-slate-800">
                {versionItems.reduce((sum, item) => sum + item.versions.length, 0)}
              </p>
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
              <p className="text-2xl font-bold text-slate-800">
                {versionItems.reduce(
                  (sum, item) => sum + item.versions.filter((v) => v.status === 'published').length,
                  0
                )}
              </p>
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
              <p className="text-2xl font-bold text-slate-800">
                {versionItems.reduce(
                  (sum, item) => sum + item.versions.filter((v) => v.status === 'draft').length,
                  0
                )}
              </p>
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
            <div className="flex items-center gap-2 py-2">
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
            {versionItems.map((item) => (
              <div key={item.id}>
                <div
                  className="p-5 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="p-1 text-slate-400 hover:text-slate-600">
                        {isExpanded(item.id) ? (
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
                          <StatusBadge status={item.status as any} size="sm" />
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
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openCompareModal('ver-001', 'ver-003')}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="版本对比"
                        >
                          <Diff className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/item-library/${item.id}`)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {isExpanded(item.id) && (
                  <div className="bg-slate-50 border-t border-slate-100">
                    <div className="relative pl-10 pr-5 py-4">
                      <div className="absolute left-11 top-4 bottom-4 w-0.5 bg-slate-200"></div>
                      {item.versions.map((ver, idx) => (
                        <div
                          key={ver.id}
                          className={cn(
                            'relative pl-6',
                            idx < item.versions.length - 1 && 'pb-5'
                          )}
                        >
                          <div
                            className={cn(
                              'absolute left-0 top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10',
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
                                  <StatusBadge status={ver.status as any} size="sm" />
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
                                    onClick={() => publishVersion(item.id, ver.id)}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                    发布
                                  </button>
                                )}
                                {ver.status !== 'draft' && (
                                  <button
                                    onClick={() => rollbackVersion(item.id, ver.id)}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    回退到此版本
                                  </button>
                                )}
                                <button
                                  onClick={() => openVersionModal(ver)}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  查看
                                </button>
                                <button
                                  onClick={() => downloadVersion(item.id, ver.id)}
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
            ))}
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
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-slate-800">{ann.title}</h4>
                        {ann.version && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                            {ann.version}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {ann.content}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                        <span>{ann.publisher}</span>
                        <span>{ann.publishDate}</span>
                        {ann.attachments && ann.attachments.length > 0 && (
                          <span>{ann.attachments.length}个附件</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="text-blue-600 text-sm flex items-center gap-1">
                    查看详情
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showVersionModal && selectedVersion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    版本详情 - {selectedVersion.version}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {selectedVersion.createdBy} · {selectedVersion.createdAt}
                  </p>
                </div>
              </div>
              <button
                onClick={closeVersionModal}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">版本状态</h4>
                <StatusBadge status={selectedVersion.status as any} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">变更内容</h4>
                <ul className="space-y-2">
                  {selectedVersion.changes.map((change, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg"
                    >
                      <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-slate-700">{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">创建人</p>
                  <p className="text-sm text-slate-800 font-medium">
                    {selectedVersion.createdBy}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">创建时间</p>
                  <p className="text-sm text-slate-800 font-medium">
                    {selectedVersion.createdAt}
                  </p>
                </div>
                {selectedVersion.publishDate && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 mb-1">发布时间</p>
                    <p className="text-sm text-green-800 font-medium">
                      {selectedVersion.publishDate}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button
                onClick={closeVersionModal}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Printer className="w-4 h-4" />
                打印
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompareModal && compareVersions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Diff className="w-5 h-5 text-blue-500" />
                版本对比
              </h3>
              <button
                onClick={closeCompareModal}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-2">版本 v1.0</h4>
                  <p className="text-sm text-slate-500 mb-4">2025-02-01 发布</p>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <p className="text-slate-500 text-xs mb-1">承诺时限</p>
                      <p className="font-medium">5 个工作日</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <p className="text-slate-500 text-xs mb-1">申请材料</p>
                      <p className="font-medium">4 项</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-red-200 bg-red-50">
                      <p className="text-red-600 text-xs mb-1">- 已删除</p>
                      <p className="font-medium text-red-700">咨询电话：020-12345678</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">版本 v2.1</h4>
                  <p className="text-sm text-blue-600 mb-4">2025-03-20 发布（当前版本）</p>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-white rounded-lg border border-green-200 bg-green-50">
                      <p className="text-green-600 text-xs mb-1">+ 已修改</p>
                      <p className="font-medium text-green-700">承诺时限：3 个工作日</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-green-200 bg-green-50">
                      <p className="text-green-600 text-xs mb-1">+ 已新增</p>
                      <p className="font-medium text-green-700">申请材料：6 项</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <p className="text-slate-500 text-xs mb-1">咨询电话</p>
                      <p className="font-medium">020-87654321</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button
                onClick={closeCompareModal}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
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
