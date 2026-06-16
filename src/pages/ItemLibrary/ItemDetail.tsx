import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Download,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Layers,
  GitBranch,
  MessageSquare,
  User,
  Calendar,
  ChevronDown,
  ChevronRight,
  Eye,
  Send,
  Tag,
  Copy,
  Printer,
} from 'lucide-react';
import { useItemStore } from '@/store/itemStore';
import StatusBadge, { StandardBadge } from '@/components/StatusBadge';
import { mockReviewFlow } from '@/data/knowledge';

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentItem, loading, fetchItemDetail, updateItemStatus } = useItemStore();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'basic',
    'conditions',
    'materials',
    'process',
    'timelimit',
    'scenarios',
  ]);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [showFlowModal, setShowFlowModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchItemDetail(id);
    }
  }, [id, fetchItemDetail]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const isExpanded = (section: string) => expandedSections.includes(section);

  if (loading || !currentItem) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const SectionHeader = ({
    id,
    title,
    icon: Icon,
    count,
  }: {
    id: string;
    title: string;
    icon: any;
    count?: number;
  }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-200"
    >
      <div className="flex items-center gap-3">
        {isExpanded(id) ? (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-slate-400" />
        )}
        <Icon className="w-5 h-5 text-blue-500" />
        <span className="font-semibold text-slate-800">{title}</span>
        {count !== undefined && (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
            {count}
          </span>
        )}
      </div>
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回
        </button>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Printer className="w-4 h-4" />
            打印
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            导出
          </button>
          <button
            onClick={() => navigate(`/compilation/${id}`)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            编辑编制
          </button>
          {currentItem.status === 'draft' && (
            <button
              onClick={() => {
                updateItemStatus(id!, 'reviewing');
                navigate('/review');
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              提交审校
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">{currentItem.name}</h1>
              <StatusBadge status={currentItem.status} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {currentItem.code}
              </span>
              <span>{currentItem.department}</span>
              <span>{currentItem.category}</span>
              {currentItem.standardSource && (
                <StandardBadge source={currentItem.standardSource} />
              )}
              {currentItem.currentVersion && (
                <span className="flex items-center gap-1">
                  <GitBranch className="w-4 h-4" />
                  版本 {currentItem.currentVersion}
                </span>
              )}
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                创建人：{currentItem.createdBy}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                创建时间：{currentItem.createdAt}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                更新时间：{currentItem.updatedAt}
              </span>
            </div>
          </div>
          <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <FileText className="w-16 h-16 text-blue-400" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <SectionHeader id="basic" title="基本信息" icon={BookOpen} />
        {isExpanded('basic') && (
          <div className="p-5 grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <InfoRow label="事项类型" value={currentItem.basicInfo?.serviceType} />
              <InfoRow label="服务对象" value={currentItem.basicInfo?.serviceObject} />
              <InfoRow
                label="办理方式"
                value={currentItem.basicInfo?.serviceMode?.join('、')}
              />
              <InfoRow label="咨询电话" value={currentItem.basicInfo?.consultationPhone} />
              <InfoRow label="投诉电话" value={currentItem.basicInfo?.complaintPhone} />
            </div>
            <div className="space-y-4">
              <InfoRow label="办理地点" value={currentItem.basicInfo?.handlingLocation} />
              <InfoRow label="办理时间" value={currentItem.basicInfo?.handlingTime} />
              <div>
                <label className="block text-sm text-slate-500 mb-2">法定依据</label>
                <ul className="space-y-2">
                  {currentItem.basicInfo?.legalBasis?.map((basis, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="w-5 h-5 rounded bg-blue-50 text-blue-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{basis}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <InfoRow label="办理依据说明" value={currentItem.basicInfo?.handlingBasis} />
            </div>
          </div>
        )}

        <SectionHeader id="conditions" title="受理条件" icon={CheckCircle} count={currentItem.conditions?.length} />
        {isExpanded('conditions') && (
          <div className="p-5">
            {currentItem.conditions && currentItem.conditions.length > 0 ? (
              <div className="space-y-3">
                {currentItem.conditions.map((cond, idx) => (
                  <div
                    key={cond.id}
                    className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg"
                  >
                    <span className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-slate-800">{cond.content}</p>
                      <div className="mt-2 flex items-center gap-2">
                        {cond.required && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded">
                            必要条件
                          </span>
                        )}
                        {cond.relatedProcessSteps && cond.relatedProcessSteps.length > 0 && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                            关联流程步骤：{cond.relatedProcessSteps.length}个
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="暂无受理条件" />
            )}
          </div>
        )}

        <SectionHeader id="materials" title="申请材料" icon={FileText} count={currentItem.materials?.length} />
        {isExpanded('materials') && (
          <div className="p-5">
            {currentItem.materials && currentItem.materials.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">序号</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">材料名称</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">类型</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">份数</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">必要性</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">形式</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">来源</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">备注</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentItem.materials.map((mat, idx) => (
                      <tr key={mat.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-600">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-slate-800">{mat.name}</p>
                          {mat.sourceDept && (
                            <p className="text-xs text-slate-500 mt-0.5">来源部门：{mat.sourceDept}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {mat.type === 'original' ? '原件' : mat.type === 'copy' ? '复印件' : '原件+复印件'}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{mat.count}份</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={mat.necessity} type="material" size="sm" />
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {mat.form === 'paper' ? '纸质' : mat.form === 'electronic' ? '电子' : '纸质+电子'}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {mat.source === 'applicant'
                            ? '申请人自备'
                            : mat.source === 'department'
                            ? '部门核发'
                            : mat.source === 'shared'
                            ? '系统共享'
                            : '其他'}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500 max-w-xs truncate">
                          {mat.remark || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {mat.isBlankForm && (
                              <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded" title="空白表格">
                                <FileText className="w-4 h-4" />
                              </button>
                            )}
                            {mat.isSample && (
                              <button className="p-1.5 text-green-500 hover:bg-green-50 rounded" title="示例样本">
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState text="暂无申请材料" />
            )}
          </div>
        )}

        <SectionHeader id="process" title="办理流程" icon={Layers} count={currentItem.process?.length} />
        {isExpanded('process') && (
          <div className="p-5">
            {currentItem.process && currentItem.process.length > 0 ? (
              <div className="relative">
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200"></div>
                {currentItem.process.map((step, idx) => (
                  <div key={step.id} className="relative pl-16 pb-8 last:pb-0">
                    <div className="absolute left-0 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shadow-lg">
                      {step.step}
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800">{step.name}</h4>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {step.handler}
                            </span>
                            <span>{step.handlerDept}</span>
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded">
                              <Clock className="w-3.5 h-3.5" />
                              {step.duration}个工作日
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{step.description}</p>
                      {step.relatedConditions && step.relatedConditions.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <p className="text-xs text-slate-500 mb-2">关联受理条件：</p>
                          <div className="flex flex-wrap gap-2">
                            {step.relatedConditions.map((condId, i) => {
                              const cond = currentItem.conditions?.find((c) => c.id === condId);
                              return (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded"
                                >
                                  {cond?.content || condId}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="暂无办理流程" />
            )}
          </div>
        )}

        <SectionHeader id="timelimit" title="办理时限与收费" icon={Clock} />
        {isExpanded('timelimit') && (
          <div className="p-5 grid grid-cols-2 gap-6">
            <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <h4 className="font-semibold text-slate-700 mb-4">办理时限</h4>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-1">法定时限</p>
                  <p className="text-3xl font-bold text-slate-700">
                    {currentItem.timeLimit?.legalDays}
                    <span className="text-sm font-normal ml-1">工作日</span>
                  </p>
                </div>
                <div className="text-3xl text-blue-400">→</div>
                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-1">承诺时限</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {currentItem.timeLimit?.promiseDays}
                    <span className="text-sm font-normal ml-1">工作日</span>
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  压缩 {Math.round((1 - currentItem.timeLimit!.promiseDays / currentItem.timeLimit!.legalDays) * 100)}%
                </div>
              </div>
              {currentItem.timeLimit?.remark && (
                <p className="mt-4 text-sm text-slate-600 bg-white/60 p-3 rounded-lg">
                  {currentItem.timeLimit.remark}
                </p>
              )}
            </div>
            <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <h4 className="font-semibold text-slate-700 mb-4">收费情况</h4>
              {currentItem.fee?.charge ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-sm rounded">收费</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    <span className="font-medium">收费标准：</span>
                    {currentItem.fee.standard}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">收费依据：</span>
                    {currentItem.fee.basis}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-700">不收费</p>
                    <p className="text-sm text-green-600">本事项无需缴纳任何费用</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <SectionHeader id="scenarios" title="情形化要素" icon={AlertCircle} count={currentItem.scenarios?.length} />
        {isExpanded('scenarios') && (
          <div className="p-5">
            {currentItem.scenarios && currentItem.scenarios.length > 0 ? (
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentItem.scenarios.map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => setActiveScenario(activeScenario === scenario.id ? null : scenario.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeScenario === scenario.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {scenario.name}
                    </button>
                  ))}
                </div>
                {activeScenario &&
                  (() => {
                    const scenario = currentItem.scenarios?.find((s) => s.id === activeScenario);
                    if (!scenario) return null;
                    return (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                        <h5 className="font-semibold text-blue-800 mb-2">{scenario.name}</h5>
                        <p className="text-sm text-blue-700 mb-4">{scenario.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white rounded-lg p-4">
                            <p className="text-sm font-medium text-slate-700 mb-2">适用材料</p>
                            <ul className="space-y-1">
                              {scenario.materials.map((matId, i) => {
                                const mat = currentItem.materials?.find((m) => m.id === matId);
                                return (
                                  <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    {mat?.name || matId}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                          <div className="bg-white rounded-lg p-4">
                            <p className="text-sm font-medium text-slate-700 mb-2">适用流程</p>
                            <ul className="space-y-1">
                              {scenario.process.map((procId, i) => {
                                const proc = currentItem.process?.find((p) => p.id === procId);
                                return (
                                  <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    {proc?.name || procId}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                {!activeScenario && (
                  <p className="text-sm text-slate-500 text-center py-4">点击上方情形标签查看详情</p>
                )}
              </div>
            ) : (
              <EmptyState text="暂无情形化设置，所有申请人适用统一标准" />
            )}
          </div>
        )}

        <SectionHeader id="versions" title="历史版本" icon={GitBranch} count={currentItem.versions?.length} />
        {isExpanded('versions') && (
          <div className="p-5">
            {currentItem.versions && currentItem.versions.length > 0 ? (
              <div className="relative pl-6">
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-200"></div>
                {currentItem.versions.map((ver, idx) => (
                  <div key={ver.id} className="relative pb-6 last:pb-0">
                    <div
                      className={`absolute -left-4 w-4 h-4 rounded-full border-4 border-white shadow ${
                        ver.status === 'published'
                          ? 'bg-green-500'
                          : ver.status === 'superseded'
                          ? 'bg-slate-400'
                          : 'bg-amber-500'
                      }`}
                    ></div>
                    <div className="ml-4 bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{ver.version}</span>
                          <StatusBadge status={ver.status} type="version" size="sm" />
                          {idx === 0 && ver.status === 'published' && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                              当前版本
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">{ver.createdAt}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">创建人：{ver.createdBy}</p>
                      {ver.changes && ver.changes.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {ver.changes.map((change, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></span>
                              {change}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="暂无历史版本" />
            )}
          </div>
        )}

        <SectionHeader id="review" title="审校记录" icon={MessageSquare} count={currentItem.reviewRecords?.length} />
        {isExpanded('review') && (
          <div className="p-5">
            <div className="mb-4">
              <button
                onClick={() => setShowFlowModal(true)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                查看会签流程图
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            {currentItem.reviewRecords && currentItem.reviewRecords.length > 0 ? (
              <div className="space-y-4">
                {currentItem.reviewRecords.map((record) => (
                  <div key={record.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800">{record.reviewer}</span>
                          <span className="text-sm text-slate-500">{record.reviewerDept}</span>
                          <StatusBadge status={record.status} type="review" size="sm" />
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded">
                            {record.type === 'review' ? '审校' : '会签'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">{record.createdAt}</span>
                      </div>
                      {record.opinion && (
                        <p className="mt-3 text-sm text-slate-700 bg-white rounded-lg p-3">
                          {record.opinion}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="暂无审校记录" />
            )}
          </div>
        )}
      </div>

      {showFlowModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">审校流程图</h3>
              <button
                onClick={() => setShowFlowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                {mockReviewFlow.map((node, idx) => (
                  <div key={node.id} className="flex items-center">
                    <div className="text-center">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 ${
                          node.status === 'completed'
                            ? 'bg-green-500 text-white'
                            : node.status === 'processing'
                            ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {node.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <span className="font-bold">{idx + 1}</span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-700">{node.nodeName}</p>
                      <p className="text-xs text-slate-500">{node.assigneeDept}</p>
                      {node.handledAt && <p className="text-xs text-slate-400 mt-1">{node.handledAt.split(' ')[0]}</p>}
                    </div>
                    {idx < mockReviewFlow.length - 1 && (
                      <div
                        className={`w-12 h-0.5 mx-2 ${
                          node.status === 'completed' ? 'bg-green-500' : 'bg-slate-200'
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <label className="block text-sm text-slate-500 mb-1">{label}</label>
      <p className="text-sm text-slate-800">{value || '-'}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-8 text-center">
      <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
}
