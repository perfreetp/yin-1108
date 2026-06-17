import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Send,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Info,
  Clock,
  FileText,
  Layers,
  BookOpen,
  AlertTriangle,
  X,
  GripVertical,
  Copy,
  Eye,
} from 'lucide-react';
import { useItemStore } from '@/store/itemStore';
import type {
  ServiceItemDetail,
  AcceptanceCondition,
  MaterialItem,
  ProcessStep,
  Scenario,
  ValidationIssue,
} from '@/types';
import { templates } from '@/data/templates';
import { mockItemDetail } from '@/data/items';

const steps = [
  { id: 'basic', label: '基本信息', icon: BookOpen },
  { id: 'conditions', label: '受理条件', icon: CheckCircle },
  { id: 'materials', label: '申请材料', icon: FileText },
  { id: 'process', label: '办理流程', icon: Layers },
  { id: 'scenarios', label: '情形化设置', icon: AlertCircle },
];

export default function CompilationForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentItem, fetchItemDetail, saveItem, createItem, updateItemStatus, validateItem, validationResult } = useItemStore();
  const [activeStep, setActiveStep] = useState('basic');
  const [formData, setFormData] = useState<ServiceItemDetail | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showErrors, setShowErrors] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic', 'conditions', 'materials', 'process', 'scenarios']);
  const [saveMessage, setSaveMessage] = useState('');

  const isNew = id === 'new';

  useEffect(() => {
    if (isNew) {
      setShowTemplateModal(true);
      setFormData({
        ...mockItemDetail,
        id: 'new-item-' + Date.now(),
        code: '',
        name: '',
        status: 'draft',
        progress: 0,
      });
    } else if (id) {
      fetchItemDetail(id);
    }
  }, [id, isNew, fetchItemDetail]);

  useEffect(() => {
    if (currentItem && !isNew) {
      setFormData(currentItem);
    }
  }, [currentItem, isNew]);

  useEffect(() => {
    if (formData) {
      validateItem(formData);
    }
  }, [formData, validateItem]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
    setActiveStep(section);
  };

  const updateField = <K extends keyof ServiceItemDetail>(field: K, value: ServiceItemDetail[K]) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const updateBasicField = <K extends keyof ServiceItemDetail['basicInfo']>(
    field: K,
    value: ServiceItemDetail['basicInfo'][K]
  ) => {
    if (!formData) return;
    setFormData({
      ...formData,
      basicInfo: { ...formData.basicInfo, [field]: value },
    });
  };

  const updateTimeLimit = <K extends keyof ServiceItemDetail['timeLimit']>(
    field: K,
    value: ServiceItemDetail['timeLimit'][K]
  ) => {
    if (!formData) return;
    const newTimeLimit = { ...formData.timeLimit, [field]: value };
    setFormData({ ...formData, timeLimit: newTimeLimit });
  };

  // 受理条件操作
  const addCondition = () => {
    if (!formData) return;
    const newCondition: AcceptanceCondition = {
      id: 'cond-' + Date.now(),
      content: '',
      sort: formData.conditions.length + 1,
      required: true,
      relatedProcessSteps: [],
    };
    setFormData({ ...formData, conditions: [...formData.conditions, newCondition] });
  };

  const updateCondition = (id: string, field: keyof AcceptanceCondition, value: any) => {
    if (!formData) return;
    setFormData({
      ...formData,
      conditions: formData.conditions.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    });
  };

  const deleteCondition = (id: string) => {
    if (!formData) return;
    setFormData({ ...formData, conditions: formData.conditions.filter((c) => c.id !== id) });
  };

  // 申请材料操作
  const addMaterial = () => {
    if (!formData) return;
    const newMaterial: MaterialItem = {
      id: 'mat-' + Date.now(),
      name: '',
      type: 'original',
      count: 1,
      necessity: 'required',
      form: 'both',
      source: 'applicant',
      remark: '',
      isBlankForm: false,
      isSample: false,
      sort: formData.materials.length + 1,
      relatedScenarios: [],
    };
    setFormData({ ...formData, materials: [...formData.materials, newMaterial] });
  };

  const updateMaterial = (id: string, field: keyof MaterialItem, value: any) => {
    if (!formData) return;
    setFormData({
      ...formData,
      materials: formData.materials.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    });
  };

  const deleteMaterial = (id: string) => {
    if (!formData) return;
    setFormData({ ...formData, materials: formData.materials.filter((m) => m.id !== id) });
  };

  const splitMaterial = (id: string) => {
    if (!formData) return;
    const mat = formData.materials.find((m) => m.id === id);
    if (!mat) return;
    const copyMaterials: MaterialItem[] = [
      { ...mat, id: 'mat-' + Date.now() + '-1', type: 'original', name: mat.name + '（原件）' },
      { ...mat, id: 'mat-' + Date.now() + '-2', type: 'copy', name: mat.name + '（复印件）' },
    ];
    const newMaterials = formData.materials.filter((m) => m.id !== id);
    const idx = formData.materials.findIndex((m) => m.id === id);
    newMaterials.splice(idx, 0, ...copyMaterials);
    setFormData({ ...formData, materials: newMaterials });
  };

  // 办理流程操作
  const addProcessStep = () => {
    if (!formData) return;
    const newStep: ProcessStep = {
      id: 'step-' + Date.now(),
      step: formData.process.length + 1,
      name: '',
      handler: '',
      handlerDept: '',
      duration: 1,
      description: '',
      conditions: [],
      relatedConditions: [],
    };
    setFormData({ ...formData, process: [...formData.process, newStep] });
  };

  const updateProcessStep = (id: string, field: keyof ProcessStep, value: any) => {
    if (!formData) return;
    setFormData({
      ...formData,
      process: formData.process.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    });
  };

  const deleteProcessStep = (id: string) => {
    if (!formData) return;
    setFormData({ ...formData, process: formData.process.filter((p) => p.id !== id) });
  };

  // 情形化操作
  const addScenario = () => {
    if (!formData) return;
    const newScenario: Scenario = {
      id: 'scenario-' + Date.now(),
      name: '',
      description: '',
      conditions: [],
      materials: [],
      process: [],
    };
    setFormData({ ...formData, scenarios: [...formData.scenarios, newScenario] });
  };

  const updateScenario = (id: string, field: keyof Scenario, value: any) => {
    if (!formData) return;
    setFormData({
      ...formData,
      scenarios: formData.scenarios.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    });
  };

  const deleteScenario = (id: string) => {
    if (!formData) return;
    setFormData({ ...formData, scenarios: formData.scenarios.filter((s) => s.id !== id) });
  };

  const handleSave = () => {
    if (!formData) return;
    if (isNew) {
      const created = createItem(formData);
      setFormData(created);
      navigate('/compilation', { replace: true });
    } else {
      saveItem(formData);
    }
    setSaveMessage('保存成功！');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleSubmit = () => {
    if (!formData || !validationResult) return;
    if (validationResult.errors.length > 0) {
      setShowErrors(true);
      alert('存在校验错误，请先修正后再提交');
      return;
    }
    if (isNew) {
      const created = createItem({ ...formData, status: 'reviewing', progress: 85 });
      updateItemStatus(created.id, 'reviewing');
    } else {
      saveItem({ ...formData, status: 'reviewing', progress: 85 });
      updateItemStatus(formData.id, 'reviewing');
    }
    alert('已成功提交审校！');
    navigate('/review', { replace: true });
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template || !formData) return;
    updateField('templateId', template.id);
    updateField('templateName', template.name);
    setShowTemplateModal(false);
  };

  if (!formData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const totalProcessDuration = formData.process.reduce((sum, step) => sum + step.duration, 0);
  const timeLimitWarning =
    formData.timeLimit.promiseDays > 0 && totalProcessDuration > formData.timeLimit.promiseDays;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              {isNew ? '新建事项编制' : '事项编制 - ' + formData.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {formData.templateName ? '使用模板：' + formData.templateName : '未选择模板'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saveMessage && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {saveMessage}
            </span>
          )}
          {!formData.templateName && (
            <button
              onClick={() => setShowTemplateModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Copy className="w-4 h-4" />
              选择模板
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            保存草稿
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send className="w-4 h-4" />
            提交审校
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-56 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 sticky top-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const sectionErrors = validationResult?.errors.filter((e) => e.field.startsWith(step.id));
              const hasErrors = sectionErrors && sectionErrors.length > 0;

              return (
                <button
                  key={step.id}
                  onClick={() => toggleSection(step.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    activeStep === step.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                      activeStep === step.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {hasErrors ? <AlertTriangle className="w-4 h-4 text-amber-500" /> : idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{step.label}</p>
                  </div>
                  {expandedSections.includes(step.id) ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              );
            })}

            {validationResult && showErrors && (validationResult.errors.length > 0 || validationResult.warnings.length > 0) && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="text-sm font-medium text-amber-800 flex items-center gap-1 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  校验提示
                </h4>
                <div className="space-y-1">
                  {validationResult.errors.map((err) => (
                    <p key={err.id} className="text-xs text-red-600 flex items-start gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0"></span>
                      {err.fieldName}：{err.message}
                    </p>
                  ))}
                  {validationResult.warnings.map((warn) => (
                    <p key={warn.id} className="text-xs text-amber-700 flex items-start gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 flex-shrink-0"></span>
                      {warn.fieldName}：{warn.message}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {expandedSections.includes('basic') && (
            <SectionCard
              id="basic"
              title="基本信息"
              activeStep={activeStep}
              errors={validationResult?.errors.filter((e) => e.field.startsWith('name') || e.field.startsWith('basicInfo'))}
            >
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    事项名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="请输入事项名称"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    事项编码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => updateField('code', e.target.value)}
                    placeholder="如：XK-SC-001"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    事项类型
                  </label>
                  <select
                    value={formData.basicInfo.serviceType}
                    onChange={(e) => updateBasicField('serviceType', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  >
                    <option value="行政许可">行政许可</option>
                    <option value="行政确认">行政确认</option>
                    <option value="行政给付">行政给付</option>
                    <option value="行政奖励">行政奖励</option>
                    <option value="行政裁决">行政裁决</option>
                    <option value="其他行政权力">其他行政权力</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    服务对象
                  </label>
                  <input
                    type="text"
                    value={formData.basicInfo.serviceObject}
                    onChange={(e) => updateBasicField('serviceObject', e.target.value)}
                    placeholder="如：企业法人、其他组织"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    所属部门
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => updateField('department', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    办理地点
                  </label>
                  <input
                    type="text"
                    value={formData.basicInfo.handlingLocation}
                    onChange={(e) => updateBasicField('handlingLocation', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    咨询电话
                  </label>
                  <input
                    type="text"
                    value={formData.basicInfo.consultationPhone}
                    onChange={(e) => updateBasicField('consultationPhone', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    投诉电话
                  </label>
                  <input
                    type="text"
                    value={formData.basicInfo.complaintPhone}
                    onChange={(e) => updateBasicField('complaintPhone', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    法定依据 <span className="text-red-500">*</span>
                  </label>
                  {formData.basicInfo.legalBasis.map((basis, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center text-xs flex-shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={basis}
                        onChange={(e) => {
                          const newBasis = [...formData.basicInfo.legalBasis];
                          newBasis[idx] = e.target.value;
                          updateBasicField('legalBasis', newBasis);
                        }}
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                      <button
                        onClick={() => {
                          const newBasis = formData.basicInfo.legalBasis.filter((_, i) => i !== idx);
                          updateBasicField('legalBasis', newBasis);
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => updateBasicField('legalBasis', [...formData.basicInfo.legalBasis, ''])}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    添加法定依据
                  </button>
                </div>
              </div>
            </SectionCard>
          )}

          {expandedSections.includes('conditions') && (
            <SectionCard
              id="conditions"
              title="受理条件"
              activeStep={activeStep}
              errors={validationResult?.errors.filter((e) => e.field.startsWith('conditions'))}
            >
              <div className="space-y-3">
                {formData.conditions.map((cond, idx) => (
                  <div key={cond.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-1">
                        <GripVertical className="w-5 h-5 text-slate-300 cursor-move" />
                        <span className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                          {idx + 1}
                        </span>
                      </div>
                      <div className="flex-1 space-y-3">
                        <textarea
                          value={cond.content}
                          onChange={(e) => updateCondition(cond.id, 'content', e.target.value)}
                          placeholder="请输入受理条件内容"
                          rows={2}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none bg-white"
                        />
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={cond.required}
                              onChange={(e) => updateCondition(cond.id, 'required', e.target.checked)}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            必要条件
                          </label>
                          <label className="flex items-center gap-2 text-sm text-slate-600">
                            关联流程步骤：
                            <select
                              multiple
                              className="px-2 py-1 text-sm border border-slate-200 rounded"
                            >
                              {formData.process.map((step) => (
                                <option key={step.id} value={step.id}>
                                  步骤{step.step}：{step.name || '未命名'}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteCondition(cond.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addCondition}
                  className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  添加受理条件
                </button>
              </div>
            </SectionCard>
          )}

          {expandedSections.includes('materials') && (
            <SectionCard
              id="materials"
              title="申请材料"
              activeStep={activeStep}
              errors={validationResult?.errors.filter((e) => e.field.startsWith('materials'))}
            >
              <div className="space-y-3">
                {formData.materials.map((mat, idx) => (
                  <div key={mat.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-1 pt-2">
                        <GripVertical className="w-5 h-5 text-slate-300 cursor-move" />
                        <span className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                          {idx + 1}
                        </span>
                      </div>
                      <div className="flex-1 grid grid-cols-6 gap-3">
                        <div className="col-span-2">
                          <label className="block text-xs text-slate-500 mb-1">材料名称 *</label>
                          <input
                            type="text"
                            value={mat.name}
                            onChange={(e) => updateMaterial(mat.id, 'name', e.target.value)}
                            placeholder="请输入材料名称"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">类型</label>
                          <select
                            value={mat.type}
                            onChange={(e) => updateMaterial(mat.id, 'type', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                          >
                            <option value="original">原件</option>
                            <option value="copy">复印件</option>
                            <option value="both">原件+复印件</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">份数</label>
                          <input
                            type="number"
                            min={1}
                            value={mat.count}
                            onChange={(e) => updateMaterial(mat.id, 'count', parseInt(e.target.value))}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">必要性</label>
                          <select
                            value={mat.necessity}
                            onChange={(e) => updateMaterial(mat.id, 'necessity', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                          >
                            <option value="required">必需</option>
                            <option value="conditional">容缺受理</option>
                            <option value="optional">可选</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">形式</label>
                          <select
                            value={mat.form}
                            onChange={(e) => updateMaterial(mat.id, 'form', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                          >
                            <option value="paper">纸质</option>
                            <option value="electronic">电子</option>
                            <option value="both">纸质+电子</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-slate-500 mb-1">材料来源</label>
                          <select
                            value={mat.source}
                            onChange={(e) => updateMaterial(mat.id, 'source', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                          >
                            <option value="applicant">申请人自备</option>
                            <option value="department">部门核发</option>
                            <option value="shared">系统共享</option>
                            <option value="other">其他</option>
                          </select>
                        </div>
                        <div className="col-span-3">
                          <label className="block text-xs text-slate-500 mb-1">备注说明</label>
                          <input
                            type="text"
                            value={mat.remark}
                            onChange={(e) => updateMaterial(mat.id, 'remark', e.target.value)}
                            placeholder="如：需加盖公章、A4纸等"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                          />
                        </div>
                        <div className="col-span-1 flex items-end gap-2">
                          <label className="flex items-center gap-1 text-xs text-slate-600">
                            <input
                              type="checkbox"
                              checked={mat.isBlankForm}
                              onChange={(e) => updateMaterial(mat.id, 'isBlankForm', e.target.checked)}
                              className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600"
                            />
                            空白表格
                          </label>
                          <label className="flex items-center gap-1 text-xs text-slate-600">
                            <input
                              type="checkbox"
                              checked={mat.isSample}
                              onChange={(e) => updateMaterial(mat.id, 'isSample', e.target.checked)}
                              className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600"
                            />
                            示例样本
                          </label>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => splitMaterial(mat.id)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="按原件/复印件拆分"
                        >
                          <Layers className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMaterial(mat.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addMaterial}
                  className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  添加申请材料
                </button>
              </div>
            </SectionCard>
          )}

          {expandedSections.includes('process') && (
            <SectionCard
              id="process"
              title="办理流程"
              activeStep={activeStep}
              errors={validationResult?.errors.filter((e) => e.field.startsWith('process'))}
            >
              {timeLimitWarning && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-700">
                    <p className="font-medium">时限提醒</p>
                    <p className="mt-1">
                      各流程步骤时限之和（{totalProcessDuration}个工作日）已超过承诺办理时限（{formData.timeLimit.promiseDays}个工作日），请检查调整
                    </p>
                  </div>
                </div>
              )}
              <div className="relative pl-6">
                <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-slate-200"></div>
                {formData.process.map((step, idx) => (
                  <div key={step.id} className="relative pb-6 last:pb-0">
                    <div className="absolute -left-1 w-12 h-12 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center font-bold text-blue-500 shadow-lg z-10">
                      {step.step}
                    </div>
                    <div className="ml-14 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-3">
                          <label className="block text-xs text-slate-500 mb-1">步骤名称 *</label>
                          <input
                            type="text"
                            value={step.name}
                            onChange={(e) => updateProcessStep(step.id, 'name', e.target.value)}
                            placeholder="如：申请受理"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                          />
                        </div>
                        <div className="col-span-3">
                          <label className="block text-xs text-slate-500 mb-1">办理人员</label>
                          <input
                            type="text"
                            value={step.handler}
                            onChange={(e) => updateProcessStep(step.id, 'handler', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                          />
                        </div>
                        <div className="col-span-3">
                          <label className="block text-xs text-slate-500 mb-1">办理部门</label>
                          <input
                            type="text"
                            value={step.handlerDept}
                            onChange={(e) => updateProcessStep(step.id, 'handlerDept', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-slate-500 mb-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            办理时限（工作日）
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={step.duration}
                            onChange={(e) => updateProcessStep(step.id, 'duration', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                          />
                        </div>
                        <div className="col-span-1 flex items-end justify-end">
                          <button
                            onClick={() => deleteProcessStep(step.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="col-span-12">
                          <label className="block text-xs text-slate-500 mb-1">办理说明</label>
                          <textarea
                            value={step.description}
                            onChange={(e) => updateProcessStep(step.id, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white resize-none"
                          />
                        </div>
                        <div className="col-span-12">
                          <label className="block text-xs text-slate-500 mb-1">关联受理条件</label>
                          <div className="flex flex-wrap gap-2">
                            {formData.conditions.map((cond) => (
                              <label key={cond.id} className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-xs cursor-pointer hover:bg-blue-50">
                                <input
                                  type="checkbox"
                                  checked={step.relatedConditions.includes(cond.id)}
                                  onChange={(e) => {
                                    const newRelated = e.target.checked
                                      ? [...step.relatedConditions, cond.id]
                                      : step.relatedConditions.filter((id) => id !== cond.id);
                                    updateProcessStep(step.id, 'relatedConditions', newRelated);
                                  }}
                                  className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600"
                                />
                                {cond.content.slice(0, 15)}{cond.content.length > 15 ? '...' : ''}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addProcessStep}
                  className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  添加办理步骤
                </button>
              </div>
            </SectionCard>
          )}

          {expandedSections.includes('scenarios') && (
            <SectionCard
              id="scenarios"
              title="情形化设置"
              activeStep={activeStep}
              errors={validationResult?.errors.filter((e) => e.field.startsWith('scenarios'))}
            >
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">什么是情形化？</p>
                  <p className="mt-1">
                    当不同申请人需要不同的申请材料或办理流程时，可以设置情形化。申请人根据自身情况选择对应情形后，将只看到该情形下需要的材料和流程。
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {formData.scenarios.map((scenario, idx) => (
                  <div key={scenario.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={scenario.name}
                          onChange={(e) => updateScenario(scenario.id, 'name', e.target.value)}
                          placeholder="情形名称，如：首次申请、变更申请"
                          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white w-80"
                        />
                      </div>
                      <button
                        onClick={() => deleteScenario(scenario.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      value={scenario.description}
                      onChange={(e) => updateScenario(scenario.id, 'description', e.target.value)}
                      placeholder="情形描述，说明适用人群或条件"
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white resize-none mb-3"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <p className="text-sm font-medium text-slate-700 mb-2">适用申请材料</p>
                        <div className="space-y-1 max-h-40 overflow-auto">
                          {formData.materials.map((mat) => (
                            <label key={mat.id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:bg-slate-50 p-1 rounded">
                              <input
                                type="checkbox"
                                checked={scenario.materials.includes(mat.id)}
                                onChange={(e) => {
                                  const newMats = e.target.checked
                                    ? [...scenario.materials, mat.id]
                                    : scenario.materials.filter((id) => id !== mat.id);
                                  updateScenario(scenario.id, 'materials', newMats);
                                }}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600"
                              />
                              <span className="truncate">{mat.name || '未命名材料'}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <p className="text-sm font-medium text-slate-700 mb-2">适用办理步骤</p>
                        <div className="space-y-1 max-h-40 overflow-auto">
                          {formData.process.map((proc) => (
                            <label key={proc.id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:bg-slate-50 p-1 rounded">
                              <input
                                type="checkbox"
                                checked={scenario.process.includes(proc.id)}
                                onChange={(e) => {
                                  const newProc = e.target.checked
                                    ? [...scenario.process, proc.id]
                                    : scenario.process.filter((id) => id !== proc.id);
                                  updateScenario(scenario.id, 'process', newProc);
                                }}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600"
                              />
                              <span>步骤{proc.step}：{proc.name || '未命名'}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addScenario}
                  className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  添加办理情形
                </button>
              </div>
            </SectionCard>
          )}

          <SectionCard id="timelimit" title="办理时限与收费" activeStep={activeStep}>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <h4 className="font-semibold text-slate-700 mb-4">办理时限设置</h4>
                <div className="flex items-center gap-6">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">法定时限（工作日）</label>
                    <input
                      type="number"
                      min={1}
                      value={formData.timeLimit.legalDays}
                      onChange={(e) => updateTimeLimit('legalDays', parseInt(e.target.value) || 0)}
                      className="px-4 py-2.5 text-xl font-bold text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-32 text-center"
                    />
                  </div>
                  <div className="text-3xl text-blue-400">→</div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">承诺时限（工作日）</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.timeLimit.promiseDays}
                      onChange={(e) => updateTimeLimit('promiseDays', parseInt(e.target.value) || 0)}
                      className={`px-4 py-2.5 text-xl font-bold bg-white border rounded-lg focus:outline-none focus:ring-2 w-32 text-center ${
                        formData.timeLimit.promiseDays > formData.timeLimit.legalDays
                          ? 'text-red-600 border-red-300 focus:ring-red-500/20 focus:border-red-500'
                          : 'text-blue-600 border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {formData.timeLimit.legalDays > 0 && (
                    <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      formData.timeLimit.promiseDays > formData.timeLimit.legalDays
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {formData.timeLimit.promiseDays > formData.timeLimit.legalDays
                        ? '⚠ 超过法定时限'
                        : `压缩 ${Math.round((1 - formData.timeLimit.promiseDays / formData.timeLimit.legalDays) * 100)}%`}
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <label className="block text-xs text-slate-500 mb-1">时限说明</label>
                  <textarea
                    value={formData.timeLimit.remark}
                    onChange={(e) => updateTimeLimit('remark', e.target.value)}
                    rows={2}
                    placeholder="如：不含受理当日，特殊情况经批准可延长..."
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
              <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <h4 className="font-semibold text-slate-700 mb-4">收费情况</h4>
                <label className="flex items-center gap-2 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.fee.charge}
                    onChange={(e) => {
                      if (!formData) return;
                      setFormData({
                        ...formData,
                        fee: { ...formData.fee, charge: e.target.checked },
                      });
                    }}
                    className="w-5 h-5 rounded border-slate-300 text-green-600"
                  />
                  <span className="text-sm font-medium text-slate-700">本事项是否收费</span>
                </label>
                {formData.fee.charge ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">收费标准</label>
                      <textarea
                        value={formData.fee.standard}
                        onChange={(e) => {
                          if (!formData) return;
                          setFormData({
                            ...formData,
                            fee: { ...formData.fee, standard: e.target.value },
                          });
                        }}
                        rows={2}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">收费依据</label>
                      <textarea
                        value={formData.fee.basis}
                        onChange={(e) => {
                          if (!formData) return;
                          setFormData({
                            ...formData,
                            fee: { ...formData.fee, basis: e.target.value },
                          });
                        }}
                        rows={2}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none"
                      />
                    </div>
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
          </SectionCard>
        </div>
      </div>

      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">选择事项模板</h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-5 space-y-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template.id)}
                  className="w-full p-4 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-800">{template.name}</h4>
                        {template.isStandard && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                            标准模板
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{template.description}</p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                        <span>分类：{template.category}</span>
                        <span>来源：{template.source}</span>
                        <span>字段数：{template.fieldCount}</span>
                        <span>使用次数：{template.usageCount}</span>
                      </div>
                    </div>
                    <Eye className="w-5 h-5 text-slate-400" />
                  </div>
                </button>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                跳过（空白编制）
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionCard({
  id,
  title,
  icon,
  children,
  activeStep,
  errors,
}: {
  id: string;
  title: string;
  icon?: any;
  children: React.ReactNode;
  activeStep: string;
  errors?: ValidationIssue[];
}) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
      activeStep === id ? 'border-blue-300 ring-2 ring-blue-100' : 'border-slate-200'
    }`}>
      <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-200">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          {title}
          {errors && errors.length > 0 && (
            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">
              {errors.length}个问题
            </span>
          )}
        </h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
