import { create } from 'zustand';
import type { ItemVersionInfo, VersionStatus, Announcement } from '@/types';
import { announcements } from '@/data/knowledge';

interface VersionItem {
  id: string;
  name: string;
  code: string;
  department: string;
  currentVersion: string;
  status: string;
  versions: ItemVersionInfo[];
}

interface VersionState {
  versionItems: VersionItem[];
  announcements: Announcement[];
  selectedVersion: ItemVersionInfo | null;
  showVersionModal: boolean;
  showCompareModal: boolean;
  compareVersions: [string, string] | null;
  successMessage: string;

  setVersionStatus: (itemId: string, versionId: string, status: VersionStatus) => void;
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

const initialVersionItems: VersionItem[] = [
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
      },
      {
        id: 'ver-002',
        version: 'v2.0',
        status: 'superseded',
        publishDate: '2025-02-28',
        createdBy: '李四',
        createdAt: '2025-02-25 10:00:00',
        changes: ['优化受理条件描述', '新增情形化要素', '补充申请材料说明'],
      },
      {
        id: 'ver-001',
        version: 'v1.0',
        status: 'superseded',
        publishDate: '2025-02-01',
        createdBy: '张三',
        createdAt: '2025-01-25 09:00:00',
        changes: ['初始版本发布'],
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
      },
      {
        id: 'ver-003',
        version: 'v1.2',
        status: 'published',
        publishDate: '2025-03-15',
        createdBy: '王五',
        createdAt: '2025-03-10 14:30:00',
        changes: ['修正法定依据引用'],
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
      },
    ],
  },
];

export const useVersionStore = create<VersionState>((set, get) => ({
  versionItems: initialVersionItems,
  announcements: announcements,
  selectedVersion: null,
  showVersionModal: false,
  showCompareModal: false,
  compareVersions: null,
  successMessage: '',

  setVersionStatus: (itemId, versionId, status) => {
    set((state) => ({
      versionItems: state.versionItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              versions: item.versions.map((v) =>
                v.id === versionId ? { ...v, status } : v
              ),
            }
          : item
      ),
    }));
  },

  publishVersion: (itemId, versionId) => {
    const { versionItems, addAnnouncement } = get();
    const item = versionItems.find((i) => i.id === itemId);
    const version = item?.versions.find((v) => v.id === versionId);

    if (!item || !version) return;

    set((state) => ({
      versionItems: state.versionItems.map((i) =>
        i.id === itemId
          ? {
              ...i,
              currentVersion: version.version,
              status: 'published',
              versions: i.versions.map((v) =>
                v.id === versionId
                  ? { ...v, status: 'published' as VersionStatus, publishDate: new Date().toISOString().split('T')[0] }
                  : v.status === 'published'
                  ? { ...v, status: 'superseded' as VersionStatus }
                  : v
              ),
            }
          : i
      ),
      successMessage: `版本 ${version.version} 已成功发布！`,
    }));

    addAnnouncement({
      title: `关于发布《${item.name}》${version.version}版本的公告`,
      type: 'release',
      version: version.version,
      content: `根据编制工作安排，经审核通过，现发布《${item.name}》${version.version}版本，主要变更内容：${version.changes.join('；')}。本版本自发布之日起施行。`,
      publishDate: new Date().toISOString().split('T')[0],
      publisher: '省政务服务管理局',
    });

    setTimeout(() => set({ successMessage: '' }), 3000);
  },

  rollbackVersion: (itemId, versionId) => {
    const { versionItems } = get();
    const item = versionItems.find((i) => i.id === itemId);
    const version = item?.versions.find((v) => v.id === versionId);

    if (!item || !version) return;

    set((state) => ({
      versionItems: state.versionItems.map((i) =>
        i.id === itemId
          ? {
              ...i,
              currentVersion: version.version,
              versions: i.versions.map((v) =>
                v.id === versionId
                  ? { ...v, status: 'published' as VersionStatus, publishDate: new Date().toISOString().split('T')[0] }
                  : v.status === 'published'
                  ? { ...v, status: 'superseded' as VersionStatus }
                  : v
              ),
            }
          : i
      ),
      successMessage: `已回退到版本 ${version.version}！`,
    }));

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
    const { versionItems } = get();
    const item = versionItems.find((i) => i.id === itemId);
    const version = item?.versions.find((v) => v.id === versionId);

    if (!item || !version) return;

    const content = `
事项名称：${item.name}
事项编码：${item.code}
所属部门：${item.department}
版本号：${version.version}
发布/创建日期：${version.publishDate || version.createdAt}
创建人：${version.createdBy}

变更内容：
${version.changes.map((c, i) => `${i + 1}. ${c}`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.name}_${version.version}.txt`;
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
