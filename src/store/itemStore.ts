import { create } from 'zustand';
import type { ServiceItem, ServiceItemDetail, ItemStatus, ItemLevel, ValidationResult, ValidationIssue } from '@/types';
import { serviceItems, mockItemDetail, getItemDetail } from '@/data/items';

interface ItemState {
  items: ServiceItem[];
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
  validateItem: (item: ServiceItemDetail) => void;
  getFilteredItems: () => ServiceItem[];
}

export const useItemStore = create<ItemState>((set, get) => ({
  items: serviceItems,
  currentItem: null,
  loading: false,
  filters: {},
  validationResult: null,

  setItems: (items) => set({ items }),
  setCurrentItem: (item) => set({ currentItem: item }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),

  fetchItems: () => {
    set({ loading: true });
    setTimeout(() => {
      set({ items: serviceItems, loading: false });
    }, 300);
  },

  fetchItemDetail: (id) => {
    set({ loading: true });
    setTimeout(() => {
      const item = getItemDetail(id);
      set({ currentItem: item, loading: false });
    }, 300);
  },

  updateItemStatus: (id, status) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, status, updatedAt: new Date().toLocaleString() } : item
      ),
    }));
  },

  saveItem: (item) => {
    set((state) => {
      if (!state.currentItem) return state;
      const updated = { ...state.currentItem, ...item, updatedAt: new Date().toLocaleString() };
      return {
        currentItem: updated,
        items: state.items.map((i) =>
          i.id === updated.id ? { ...i, ...item, updatedAt: new Date().toLocaleString() } : i
        ),
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
      const totalDuration = item.process.reduce((sum, step) => sum + step.duration, 0);
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
}));
