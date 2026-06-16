import { create } from 'zustand';
import type { ValidationRule, KnowledgeItem } from '@/types';
import { validationRules as initialRules, knowledgeItems as initialItems } from '@/data/knowledge';

interface KnowledgeState {
  rules: ValidationRule[];
  knowledgeItems: KnowledgeItem[];
  selectedKnowledge: KnowledgeItem | null;
  showKnowledgeModal: boolean;
  successMessage: string;

  toggleRule: (ruleId: string) => void;
  enableAllRules: () => void;
  disableAllRules: () => void;
  openKnowledgeModal: (item: KnowledgeItem) => void;
  closeKnowledgeModal: () => void;
  setSuccessMessage: (msg: string) => void;
}

export const useKnowledgeStore = create<KnowledgeState>((set, get) => ({
  rules: initialRules,
  knowledgeItems: initialItems,
  selectedKnowledge: null,
  showKnowledgeModal: false,
  successMessage: '',

  toggleRule: (ruleId) => {
    set((state) => ({
      rules: state.rules.map((rule) =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      ),
      successMessage: '',
    }));
  },

  enableAllRules: () => {
    set((state) => ({
      rules: state.rules.map((rule) => ({ ...rule, enabled: true })),
      successMessage: `已启用全部 ${get().rules.length} 条规则！`,
    }));
    setTimeout(() => set({ successMessage: '' }), 3000);
  },

  disableAllRules: () => {
    set((state) => ({
      rules: state.rules.map((rule) => ({ ...rule, enabled: false })),
      successMessage: '已停用全部规则',
    }));
    setTimeout(() => set({ successMessage: '' }), 3000);
  },

  openKnowledgeModal: (item) => {
    set({ selectedKnowledge: item, showKnowledgeModal: true });
  },

  closeKnowledgeModal: () => {
    set({ showKnowledgeModal: false, selectedKnowledge: null });
  },

  setSuccessMessage: (msg) => set({ successMessage: msg }),
}));
