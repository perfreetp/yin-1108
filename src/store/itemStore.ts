import { create } from 'zustand';
import type {
  ServiceItem,
  ServiceItemDetail,
  ItemStatus,
  ItemLevel,
  ValidationResult,
  ValidationIssue,
  ReviewRecord,
} from '@/types';
import { serviceItems, itemDetailsMap, getItemDetail } from '@/data/items';

interface ItemState {
  items: ServiceItem[];
  itemDetails: Record<string, ServiceItemDetail>;
  currentItem: ServiceItemDetail | null;
  loading: boolean;
  filters: {
    keyword?: string;
    categoryId?: string;
    department?: string;
    status?: ItemStatus;
    level?: ItemLevel;
  };
  validationResult: ValidationResult | null;

  setItems: (items: ServiceItem[]) => void;
  setCurrentItem: (item: ServiceItemDetail | null) => void;
  setFilters: (filters: Partial<ItemState['filters']>) => void;
  fetchItems: () => void;
  fetchItemDetail: (id: string) => void;
  updateItemStatus: (id: string, status: ItemStatus) => void;
  saveItem: (item: Partial<ServiceItemDetail>) => void;
  createItem: (item: Partial<ServiceItemDetail>) => ServiceItemDetail;
  addReviewRecord: (itemId: string, record: ReviewRecord) => void;
  updateItemVersion: (
    id: string,
    newVersion: string,
    newStatus: ItemStatus,
    publishDate?: string
  ) => void;
  validateItem: (item: ServiceItemDetail) => void;
  getFilteredItems: () => ServiceItem[];
  getItemById: (id: string) => ServiceItemDetail | undefined;
}

export const useItemStore = create<ItemState>((set, get) => ({
  items: serviceItems,
  itemDetails: { ...itemDetailsMap },
  currentItem: null,
  loading: false,
  filters: {},
  validationResult: null,

  setItems: (items) => set({ items }),
  setCurrentItem: (item) => set({ currentItem: item }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  fetchItems: () => {
    set({ loading: true });
    setTimeout(() => {
      set((state) => ({
        items: Object.values(state.itemDetails).map(
          ({
            id,
            code,
            name,
            category,
            categoryId,
            department,
            departmentId,
            level,
            status,
            templateId,
            templateName,
            standardSource,
            createdAt,
            updatedAt,
            createdBy,
            updatedBy,
            currentVersion,
            progress,
            parentId,
            parentName,
          }) => ({
            id,
            code,
            name,
            category,
            categoryId,
            department,
            departmentId,
            level,
            status,
            templateId,
            templateName,
            standardSource,
            createdAt,
            updatedAt,
            createdBy,
            updatedBy,
            currentVersion,
            progress,
            parentId,
            parentName,
          })
        ),
        loading: false,
      }));
    }, 300);
  },

  fetchItemDetail: (id) => {
    set({ loading: true });
    setTimeout(() => {
      set((state) => {
        const cached = state.itemDetails[id];
        if (cached) {
          return { currentItem: cached, loading: false };
        }
        const fresh = getItemDetail(id);
        return {
          currentItem: fresh,
          itemDetails: { ...state.itemDetails, [id]: fresh },
          loading: false,
        };
      });
    }, 200);
  },

  updateItemStatus: (id, status) => {
    const now = new Date().toLocaleString();
    set((state) => {
      const newDetails = { ...state.itemDetails };
      if (newDetails[id]) {
        newDetails[id] = { ...newDetails[id], status, updatedAt: now };
      }
      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, status, updatedAt: now } : item
      );
      return {
        items: newItems,
        itemDetails: newDetails,
        currentItem:
          state.currentItem?.id === id
            ? { ...state.currentItem, status, updatedAt: now }
            : state.currentItem,
      };
    });
  },

  saveItem: (item) => {
    set((state) => {
      if (!state.currentItem && !item.id) return state;
      const id = item.id || state.currentItem!.id;
      const updatedAt = new Date().toLocaleString();

      const updated = {
        ...(state.currentItem || state.itemDetails[id] || getItemDetail(id)),
        ...item,
        id,
        updatedAt,
      };

      const newDetails = { ...state.itemDetails, [id]: updated };
      const newItems = state.items.map((i) => {
        if (i.id !== id) return i;
        return {
          ...i,
          ...item,
          id,
          updatedAt,
          name: updated.name,
          code: updated.code,
          department: updated.department,
          category: updated.category,
          categoryId: updated.categoryId,
          status: updated.status,
          currentVersion: updated.currentVersion,
        };
      });

      return {
        currentItem: updated,
        itemDetails: newDetails,
        items: newItems,
      };
    });
  },

  createItem: (item) => {
    const id = 'item-' + String(Date.now()).slice(-6);
    const now = new Date().toLocaleString();
    const base: ServiceItemDetail = {
      id,
      code: item.code || ('XK-ZZ-' + String(Math.floor(Math.random() * 9000) + 1000)),
      name: item.name || '新建事项',
      category: item.category || '市场监管类',
      categoryId: item.categoryId || 'cat-001-01',
      department: item.department || '省政务服务管理局',
      departmentId: item.departmentId || 'dept-zz',
      level: (item.level as ItemLevel) || 'provincial',
      status: 'draft',
      templateId: item.templateId,
      templateName: item.templateName,
      standardSource: item.standardSource || '国家标准',
      createdAt: now,
      updatedAt: now,
      createdBy: item.createdBy || '当前用户',
      updatedBy: '当前用户',
      currentVersion: item.currentVersion || 'v0.1',
      progress: 10,
      basicInfo: item.basicInfo || {
        serviceType: '行政许可',
        serviceObject: '公民、法人或其他组织',
        serviceMode: ['网上办理', '窗口办理'],
        legalBasis: [],
        handlingBasis: '',
        consultationPhone: '020-12345',
        complaintPhone: '020-12345',
        handlingLocation: '政务服务中心',
        handlingTime: '工作日',
      },
      conditions: item.conditions || [],
      materials: item.materials || [],
      process: item.process || [],
      timeLimit: item.timeLimit || {
        legalDays: 20,
        promiseDays: 10,
        remark: '',
      },
      fee: item.fee || { charge: false, standard: '不收费', basis: '', items: [] },
      scenarios: item.scenarios || [],
      reviewRecords: item.reviewRecords || [],
      versions: item.versions || [
        {
          id: id + '-ver-1',
          version: 'v0.1',
          status: 'draft',
          createdBy: '当前用户',
          createdAt: now,
          changes: ['新建事项草稿'],
        },
      ],
      ...item,
    };

    set((state) => {
      const newDetails = { ...state.itemDetails, [id]: base };
      const newItems: ServiceItem[] = [
        {
          id: base.id,
          code: base.code,
          name: base.name,
          category: base.category,
          categoryId: base.categoryId,
          department: base.department,
          departmentId: base.departmentId,
          level: base.level,
          status: base.status,
          templateId: base.templateId,
          templateName: base.templateName,
          standardSource: base.standardSource,
          createdAt: base.createdAt,
          updatedAt: base.updatedAt,
          createdBy: base.createdBy,
          updatedBy: base.updatedBy,
          currentVersion: base.currentVersion,
          progress: base.progress,
        },
        ...state.items,
      ];
      return {
        items: newItems,
        itemDetails: newDetails,
        currentItem: base,
      };
    });
    return base;
  },

  addReviewRecord: (itemId, record) => {
    set((state) => {
      const details = { ...state.itemDetails };
      if (details[itemId]) {
        details[itemId] = {
          ...details[itemId],
          reviewRecords: [...(details[itemId].reviewRecords || []), record],
          updatedAt: new Date().toLocaleString(),
        };
      }
      return {
        itemDetails: details,
        currentItem:
          state.currentItem?.id === itemId
            ? {
                ...state.currentItem,
                reviewRecords: [...(state.currentItem.reviewRecords || []), record],
                updatedAt: new Date().toLocaleString(),
              }
            : state.currentItem,
      };
    });
  },

  updateItemVersion: (id, newVersion, newStatus, publishDate) => {
    const now = new Date().toLocaleString();
    const publish = publishDate || new Date().toISOString().split('T')[0];
    set((state) => {
      const details = { ...state.itemDetails };
      if (details[id]) {
        const updatedVersions = (details[id].versions || []).map((v) =>
          v.status === 'published' && newStatus !== 'archived'
            ? { ...v, status: 'superseded' as const }
            : v
        );
        const targetIdx = updatedVersions.findIndex(
          (v) => v.version === newVersion
        );
        if (targetIdx >= 0) {
          updatedVersions[targetIdx] = {
            ...updatedVersions[targetIdx],
            status: newStatus === 'published' ? 'published' : (updatedVersions[targetIdx].status as any),
            publishDate:
              newStatus === 'published' ? publish : updatedVersions[targetIdx].publishDate,
          };
        }
        details[id] = {
          ...details[id],
          currentVersion: newVersion,
          status: newStatus,
          updatedAt: now,
          versions: updatedVersions,
        };
      }

      const items = state.items.map((i) =>
        i.id === id
          ? { ...i, currentVersion: newVersion, status: newStatus, updatedAt: now }
          : i
      );

      return {
        itemDetails: details,
        items,
        currentItem:
          state.currentItem?.id === id
            ? details[id] || state.currentItem
            : state.currentItem,
      };
    });
  },

  validateItem: (item) => {
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];

    if (!item.name || item.name.trim().length === 0) {
      errors.push({
        id: 'err-name-1',
        field: 'name',
        fieldName: '事项名称',
        message: '事项名称不能为空',
        severity: 'error',
      });
    } else if (item.name.length > 30) {
      warnings.push({
        id: 'warn-name-1',
        field: 'name',
        fieldName: '事项名称',
        message: '事项名称建议控制在30字以内',
        severity: 'warning',
      });
    }

    if (!item.code || item.code.trim().length === 0) {
      errors.push({
        id: 'err-code-1',
        field: 'code',
        fieldName: '事项编码',
        message: '事项编码不能为空',
        severity: 'error',
      });
    }

    if (!item.basicInfo?.legalBasis || item.basicInfo.legalBasis.length === 0) {
      errors.push({
        id: 'err-legal-1',
        field: 'basicInfo.legalBasis',
        fieldName: '法定依据',
        message: '至少需要填写一条法定依据',
        severity: 'error',
        ruleCode: 'VAL-004',
      });
    }

    if (item.timeLimit?.promiseDays && item.timeLimit?.legalDays) {
      if (item.timeLimit.promiseDays > item.timeLimit.legalDays) {
        errors.push({
          id: 'err-time-1',
          field: 'timeLimit.promiseDays',
          fieldName: '承诺时限',
          message: '承诺时限不得超过法定时限',
          severity: 'error',
          ruleCode: 'VAL-001',
          suggestion: `请将承诺时限调整为${item.timeLimit.legalDays}个工作日以内`,
        });
      }
    }

    if (item.fee?.charge) {
      if (!item.fee.standard || item.fee.standard.trim().length === 0) {
        errors.push({
          id: 'err-fee-1',
          field: 'fee.standard',
          fieldName: '收费标准',
          message: '收费事项必须填写收费标准',
          severity: 'error',
          ruleCode: 'VAL-008',
        });
      }
      if (!item.fee.basis || item.fee.basis.trim().length === 0) {
        errors.push({
          id: 'err-fee-2',
          field: 'fee.basis',
          fieldName: '收费依据',
          message: '收费事项必须填写收费依据',
          severity: 'error',
          ruleCode: 'VAL-008',
        });
      }
    }

    if (item.materials && item.materials.length > 0) {
      const noNecessity = item.materials.filter((m) => !m.necessity);
      if (noNecessity.length > 0) {
        errors.push({
          id: 'err-mat-1',
          field: 'materials.necessity',
          fieldName: '材料必要性',
          message: `有${noNecessity.length}项材料未标注必要性`,
          severity: 'error',
          ruleCode: 'VAL-003',
        });
      }
    }

    if (item.process && item.process.length > 0) {
      const totalDuration = item.process.reduce(
        (sum, step) => sum + step.duration,
        0
      );
      if (item.timeLimit?.promiseDays && totalDuration > item.timeLimit.promiseDays) {
        warnings.push({
          id: 'warn-proc-1',
          field: 'process.duration',
          fieldName: '流程时限',
          message: `各流程步骤时限之和(${totalDuration}天)超过承诺时限(${item.timeLimit.promiseDays}天)`,
          severity: 'warning',
          ruleCode: 'VAL-006',
        });
      }
    }

    if (item.scenarios && item.scenarios.length > 0) {
      item.scenarios.forEach((scenario, idx) => {
        if (scenario.materials.length === 0) {
          warnings.push({
            id: `warn-scenario-${idx}`,
            field: `scenarios[${idx}].materials`,
            fieldName: `情形"${scenario.name}"材料`,
            message: '情形未关联申请材料',
            severity: 'warning',
            ruleCode: 'VAL-009',
          });
        }
      });
    }

    set({
      validationResult: {
        valid: errors.length === 0,
        errors,
        warnings,
      },
    });
  },

  getFilteredItems: () => {
    const { items, filters } = get();
    return items.filter((item) => {
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        if (
          !item.name.toLowerCase().includes(keyword) &&
          !item.code.toLowerCase().includes(keyword)
        ) {
          return false;
        }
      }
      if (filters.categoryId && item.categoryId !== filters.categoryId) {
        return false;
      }
      if (filters.department && item.department !== filters.department) {
        return false;
      }
      if (filters.status && item.status !== filters.status) {
        return false;
      }
      if (filters.level && item.level !== filters.level) {
        return false;
      }
      return true;
    });
  },

  getItemById: (id) => {
    return get().itemDetails[id];
  },
}));
