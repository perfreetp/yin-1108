import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Send,
  Clock,
  FileText,
  CheckCircle,
  User,
  Calendar,
  MessageSquare,
  X,
  AlertCircle,
  Eye,
  Edit,
  GitBranch,
} from 'lucide-react';
import { useItemStore } from '@/store/itemStore';
import StatusBadge from '@/components/StatusBadge';
import { mockReviewFlow } from '@/data/knowledge';
import type { ReviewFlowNode, ReviewRecord } from '@/types';

export default function ReviewDetail() {
  const { id, action } = useParams<{ id: string; action?: string }>();
  const navigate = useNavigate();
  const { currentItem, loading, fetchItemDetail, updateItemStatus } = useItemStore();
  const [reviewFlow, setReviewFlow] = useState<ReviewFlowNode[]>(mockReviewFlow);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [opinion, setOpinion] = useState('');
  const [showOpinionPanel, setShowOpinionPanel] = useState(action === 'approve' || action === 'reject');
  const [reviewRecords, setReviewRecords] = useState<ReviewRecord[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchItemDetail(id);
    }
  }, [id, fetchItemDetail]);

  useEffect(() => {
    if (currentItem?.reviewRecords) {
      setReviewRecords(currentItem.reviewRecords);
    }
  }, [currentItem]);

  useEffect(() => {
    if (action === 'reject') {
      setShowRejectModal(true);
    }
  }, [action]);

  if (loading || !currentItem) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const currentNode = reviewFlow.find((n) => n.status === 'processing');
  const currentIdx = reviewFlow.findIndex((n) => n.status === 'processing');

  const handleApprove = () => {
    if (!opinion.trim()) {
      alert('请填写审校意见');
      return;
    }
    setShowOpinionPanel(false);
    const newFlow = [...reviewFlow];
    if (currentNode) {
      newFlow[currentIdx] = {
        ...currentNode,
        status: 'completed',
        opinion,
        handledAt: new Date().toLocaleString('zh-CN'),
        handler: '当前用户',
      };
      if (currentIdx + 1 < newFlow.length) {
        newFlow[currentIdx + 1] = {
          ...newFlow[currentIdx + 1],
          status: 'processing',
        };
      }
    }
    setReviewFlow(newFlow);
    const newRecord: ReviewRecord = {
      id: 'review-' + Date.now(),
      itemId: id!,
      versionId: currentItem.versions?.[0]?.id || '',
      type: currentNode?.nodeType === 'sign' ? 'sign' : 'review',
      status: 'approved',
      reviewer: '当前用户',
      reviewerDept: currentNode?.assigneeDept || '',
      opinion,
      createdAt: new Date().toLocaleString('zh-CN'),
    };
    setReviewRecords([...reviewRecords, newRecord]);
    if (currentIdx + 1 >= newFlow.length) {
      updateItemStatus(id!, 'published');
      setSuccessMessage('事项已全部审校通过，已发布！');
    } else {
      setSuccessMessage('审校通过，已推进到下一节点！');
    }
    setOpinion('');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('请填写退回原因');
      return;
    }
    setShowRejectModal(false);
    setShowOpinionPanel(false);
    const newRecord: ReviewRecord = {
      id: 'review-' + Date.now(),
      itemId: id!,
      versionId: currentItem.versions?.[0]?.id || '',
      type: 'review',
      status: 'rejected',
      reviewer: '当前用户',
      reviewerDept: currentNode?.assigneeDept || '',
      opinion: rejectReason,
      createdAt: new Date().toLocaleString('zh-CN'),
    };
    setReviewRecords([...reviewRecords, newRecord]);
    updateItemStatus(id!, 'returned');
    setRejectReason('');
    setOpinion('');
    setSuccessMessage('已退回修改，退回意见已留痕记录');
    setTimeout(() => {
      setSuccessMessage('');
      navigate('/compilation');
    }, 2000);
  };

  const quickReasons = [
    '申请材料不完整，请补充',
    '受理条件描述不准确，请修正',
    '办理流程与受理条件不匹配',
    '法定依据引用有误',
    '承诺时限超过法定时限',
  ];

  return (
    <div className="space-y-4">
      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-800 font-medium">{successMessage}</p>
        </div>
      )}

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
            <h1 className="text-xl font-bold text-slate-800">事项审校</h1>
            <p className="text-sm text-slate-500 mt-1">
              当前环节：{currentNode?.nodeName}（{currentNode?.assigneeDept}）
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/item-library/${id}`)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            查看完整清单
          </button>
          <button
            onClick={() => navigate(`/compilation/${id}`)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
            编辑事项
          </button>
          {!showOpinionPanel && currentNode?.status === 'processing' && (
            <>
              <button
                onClick={() => setShowOpinionPanel(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                通过
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                <ThumbsDown className="w-4 h-4" />
                退回
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              <FileText className="w-7 h-7 text-blue-500" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-slate-800">{currentItem.name}</h2>
                <StatusBadge status={currentItem.status} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span>{currentItem.code}</span>
                <span>{currentItem.department}</span>
                <span>{currentItem.category}</span>
                {currentItem.currentVersion && (
                  <span className="flex items-center gap-1">
                    <GitBranch className="w-4 h-4" />
                    版本 {currentItem.currentVersion}
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  创建人：{currentItem.createdBy}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  提交时间：{currentItem.updatedAt}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-5">审校流程</h3>
        <div className="flex items-center justify-between relative">
          <div className="absolute top-7 left-0 right-0 h-0.5 bg-slate-200 z-0"></div>
          {reviewFlow.map((node, idx) => {
            const isLast = idx === reviewFlow.length - 1;
            const progress =
              node.status === 'completed'
                ? 100
                : node.status === 'processing'
                ? 50
                : 0;

            return (
              <div key={node.id} className="relative z-10 text-center flex-1">
                {!isLast && (
                  <div
                    className={`absolute top-7 left-1/2 w-full h-0.5 ${
                      node.status === 'completed' ? 'bg-green-500' : 'bg-slate-200'
                    }`}
                    style={{ zIndex: 0 }}
                  ></div>
                )}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 relative z-10 ${
                    node.status === 'completed'
                      ? 'bg-green-500 text-white'
                      : node.status === 'processing'
                      ? 'bg-blue-500 text-white ring-4 ring-blue-100 animate-pulse'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {node.status === 'completed' ? (
                    <CheckCircle className="w-7 h-7" />
                  ) : node.nodeType === 'start' ? (
                    <Send className="w-6 h-6" />
                  ) : node.nodeType === 'end' ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : node.nodeType === 'sign' ? (
                    <MessageSquare className="w-6 h-6" />
                  ) : (
                    <span className="font-bold text-lg">{idx}</span>
                  )}
                </div>
                <p className="text-sm font-medium text-slate-800">{node.nodeName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{node.assigneeDept}</p>
                {node.handledAt && (
                  <p className="text-xs text-slate-400 mt-1">{node.handledAt.split(' ')[0]}</p>
                )}
                {node.opinion && (
                  <div className="mt-2 p-2 bg-slate-50 rounded-lg text-xs text-slate-600 text-left max-w-xs mx-auto">
                    <p className="font-medium text-slate-700 mb-0.5">
                      {node.handler}：
                    </p>
                    <p>{node.opinion}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showOpinionPanel && currentNode?.status === 'processing' && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                <ThumbsUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800">通过审校</h4>
                <p className="text-sm text-green-600">请填写审校意见</p>
              </div>
            </div>
            <button
              onClick={() => setShowOpinionPanel(false)}
              className="p-1 text-green-600 hover:text-green-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <textarea
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            placeholder="请输入您的审校意见，同意通过的理由等..."
            rows={4}
            className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white resize-none"
          />
          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              onClick={() => setShowOpinionPanel(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-white/60 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleApprove}
              className="flex items-center gap-2 px-5 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              确认通过
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            编制要点检查
          </h3>
          <div className="space-y-2">
            {[
              { label: '事项名称规范性', status: 'pass' },
              { label: '法定依据完整性', status: 'pass' },
              { label: '申请材料颗粒度', status: 'pass' },
              { label: '受理条件与流程联动', status: 'warning', detail: '步骤2未关联受理条件' },
              { label: '法定时限与承诺时限对比', status: 'pass' },
              { label: '情形化要素完整性', status: 'warning', detail: '情形2未关联材料' },
              { label: '收费事项标注', status: 'pass' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg">
                {item.status === 'pass' ? (
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm text-slate-700">{item.label}</p>
                  {item.detail && (
                    <p className="text-xs text-amber-600 mt-0.5">{item.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            审校意见留痕
          </h3>
          <div className="space-y-4 max-h-80 overflow-auto">
            {reviewRecords.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-sm">
                暂无审校意见
              </div>
            )}
            {reviewRecords.map((record) => (
              <div key={record.id} className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-slate-800">{record.reviewer}</span>
                    <span className="text-xs text-slate-500">{record.reviewerDept}</span>
                    <StatusBadge status={record.status} type="review" size="sm" />
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                      {record.type === 'review' ? '审校' : '会签'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{record.createdAt}</p>
                  {record.opinion && (
                    <div className="mt-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-700">
                      {record.opinion}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <ThumbsDown className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">退回修改</h3>
              </div>
              <button
                onClick={() => setShowRejectModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-4">
                请填写退回原因，退回后事项状态将变更为"已退回"，编制人员可根据退回意见进行修改。
              </p>
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-700 mb-2">快捷选择原因：</p>
                <div className="flex flex-wrap gap-2">
                  {quickReasons.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setRejectReason(reason)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        rejectReason === reason
                          ? 'bg-red-50 border-red-300 text-red-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">
                  详细退回意见 <span className="text-red-500">*</span>
                </p>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="请详细说明退回原因，方便编制人员修改..."
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleReject}
                className="flex items-center gap-2 px-5 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                <ThumbsDown className="w-4 h-4" />
                确认退回
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
