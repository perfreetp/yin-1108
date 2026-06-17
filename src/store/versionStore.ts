import { create } from 'zustand';
import type { ItemVersionInfo, VersionStatus, Announcement, ServiceItemDetail } from '@/types';
import { announcements } from '@/data/knowledge';
import { useItemStore } from './itemStore';

interface VersionState {
  announcements: Announcement[];
  selectedVersion: ItemVersionInfo | null;
  showVersionModal: boolean;
  showCompareModal: boolean;
  compareVersions: [string, string] | null;
  successMessage: string;

  getVersionItems: () => Array<{
    id: string;
    name: string;
    code: string;
    department: string;
    currentVersion: string;
    status: string;
    versions: ItemVersionInfo[];
  }>;

  publishVersion: (itemId: string, versionId: string) => void;
  rollbackVersion: (itemId: string, versionId: string) => void;
  openVersionModal: (version: ItemVersionInfo) => void;
  closeVersionModal: () => void;
  openCompareModal: (v1: string, v2: string) => void;
  closeCompareModal: () => void;
  downloadVersion: (itemId: string, versionId: string) => void;
  setSuccessMessage: (msg: string) => void;
  addAnnouncement: (ann: Omit<Announcement, 'id'>) => void;
}

function cloneItem(detail: ServiceItemDetail) {
  return {
    id: detail.id,
    name: detail.name,
    code: detail.code,
    department: detail.department,
    currentVersion: detail.currentVersion,
    status: detail.status,
    versions: [...(detail.versions || [])],
  };
}

export const useVersionStore = create<VersionState>((set, get) => ({
  announcements: announcements,
  selectedVersion: null,
  showVersionModal: false,
  showCompareModal: false,
  compareVersions: null,
  successMessage: '',

  getVersionItems: () => {
    const { itemDetails } = useItemStore.getState();
    return Object.values(itemDetails)
      .filter((d) => d.versions && d.versions.length > 0)
      .map(cloneItem);
  },

  publishVersion: (itemId, versionId) => {
    const { itemDetails } = useItemStore.getState();
    const detail = itemDetails[itemId];
    const version = detail?.versions?.find((v) => v.id === versionId);
    if (!detail || !version) return;

    useItemStore.getState().updateItemVersion(
      itemId,
      version.version,
      'published',
      new Date().toISOString().split('T')[0]
    );

    get().addAnnouncement({
      title: `关于发布《${detail.name}》${version.version}版本的公告`,
      type: 'release',
      version: version.version,
      content: `根据编制工作安排，经审核通过，现发布《${detail.name}》${version.version}版本，主要变更内容：${version.changes.join('；')}。本版本自发布之日起施行。`,
      publishDate: new Date().toISOString().split('T')[0],
      publisher: '省政务服务管理局',
    });

    set({ successMessage: `版本 ${version.version} 已成功发布！` });
    setTimeout(() => set({ successMessage: '' }), 3000);
  },

  rollbackVersion: (itemId, versionId) => {
    const { itemDetails } = useItemStore.getState();
    const detail = itemDetails[itemId];
    const version = detail?.versions?.find((v) => v.id === versionId);
    if (!detail || !version) return;

    let newStatus: any = detail.status;
    if (version.status === 'published') {
      newStatus = 'published';
    } else if (version.status === 'superseded') {
      newStatus = 'published';
    } else {
      newStatus = 'draft';
    }

    useItemStore.getState().updateItemVersion(
      itemId,
      version.version,
      newStatus,
      new Date().toISOString().split('T')[0]
    );

    set({ successMessage: `已回退到版本 ${version.version}，事项状态已同步为"${newStatus === 'published' ? '已发布' : newStatus === 'draft' ? '草稿' : '审核中'}"！` });
    setTimeout(() => set({ successMessage: '' }), 3000);
  },

  openVersionModal: (version) => {
    set({ selectedVersion: version, showVersionModal: true });
  },

  closeVersionModal: () => {
    set({ showVersionModal: false, selectedVersion: null });
  },

  openCompareModal: (v1, v2) => {
    set({ compareVersions: [v1, v2], showCompareModal: true });
  },

  closeCompareModal: () => {
    set({ showCompareModal: false, compareVersions: null });
  },

  downloadVersion: (itemId, versionId) => {
    const { itemDetails } = useItemStore.getState();
    const detail = itemDetails[itemId];
    const version = detail?.versions?.find((v) => v.id === versionId);
    if (!detail || !version) return;

    const content = `
事项名称：${detail.name}
事项编码：${detail.code}
所属部门：${detail.department}
当前事项状态：${detail.status}
版本号：${version.version}
版本状态：${version.status}
发布/创建日期：${version.publishDate || version.createdAt}
创建人：${version.createdBy}

变更内容：
${version.changes.map((c, i) => `${i + 1}. ${c}`).join('\n')}

--- 事项基本要素 ---
事项类型：${detail.basicInfo?.serviceType || ''}
服务对象：${detail.basicInfo?.serviceObject || ''}
法定期限：${detail.timeLimit?.legalDays || 0}工作日
承诺期限：${detail.timeLimit?.promiseDays || 0}工作日
受理条件：${(detail.conditions || []).length}项
申请材料：${(detail.materials || []).length}项
办理流程：${(detail.process || []).length}步
办理情形：${(detail.scenarios || []).length}种
`.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${detail.name}_${version.version}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    set({ successMessage: '下载已开始！' });
    setTimeout(() => set({ successMessage: '' }), 2000);
  },

  setSuccessMessage: (msg) => set({ successMessage: msg }),

  addAnnouncement: (ann) => {
    set((state) => ({
      announcements: [
        { ...ann, id: 'ann-' + Date.now() },
        ...state.announcements,
      ],
    }));
  },
}));
