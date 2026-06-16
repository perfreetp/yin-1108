export type ItemStatus = 'draft' | 'reviewing' | 'returned' | 'published' | 'archived';
export type ItemLevel = 'national' | 'provincial' | 'municipal' | 'county';
export type MaterialType = 'original' | 'copy' | 'both';
export type MaterialNecessity = 'required' | 'optional' | 'conditional';
export type MaterialForm = 'paper' | 'electronic' | 'both';
export type MaterialSource = 'applicant' | 'department' | 'shared' | 'other';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type ReviewType = 'review' | 'sign';
export type VersionStatus = 'draft' | 'published' | 'superseded';

export interface ServiceItem {
  id: string;
  code: string;
  name: string;
  category: string;
  categoryId: string;
  department: string;
  departmentId: string;
  level: ItemLevel;
  status: ItemStatus;
  templateId?: string;
  templateName?: string;
  parentId?: string;
  parentName?: string;
  standardSource?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  currentVersion?: string;
  progress: number;
}

export interface ServiceItemDetail extends ServiceItem {
  basicInfo: {
    serviceType: string;
    serviceObject: string;
    serviceMode: string[];
    legalBasis: string[];
    handlingBasis: string;
    consultationPhone: string;
    complaintPhone: string;
    handlingLocation: string;
    handlingTime: string;
  };
  conditions: AcceptanceCondition[];
  materials: MaterialItem[];
  process: ProcessStep[];
  timeLimit: {
    legalDays: number;
    promiseDays: number;
    remark: string;
  };
  fee: {
    charge: boolean;
    standard: string;
    basis: string;
    items: FeeItem[];
  };
  scenarios: Scenario[];
  reviewRecords: ReviewRecord[];
  versions: ItemVersionInfo[];
}

export interface AcceptanceCondition {
  id: string;
  content: string;
  sort: number;
  required: boolean;
  relatedProcessSteps: string[];
}

export interface MaterialItem {
  id: string;
  name: string;
  type: MaterialType;
  count: number;
  necessity: MaterialNecessity;
  form: MaterialForm;
  source: MaterialSource;
  sourceDept?: string;
  remark: string;
  isBlankForm: boolean;
  isSample: boolean;
  blankFormUrl?: string;
  sampleUrl?: string;
  sort: number;
  relatedScenarios: string[];
}

export interface ProcessStep {
  id: string;
  step: number;
  name: string;
  handler: string;
  handlerDept: string;
  duration: number;
  description: string;
  conditions: string[];
  relatedConditions: string[];
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  conditions: string[];
  materials: string[];
  process: string[];
}

export interface FeeItem {
  id: string;
  name: string;
  standard: string;
  basis: string;
}

export interface ItemVersionInfo {
  id: string;
  version: string;
  status: VersionStatus;
  publishDate?: string;
  createdBy: string;
  createdAt: string;
  changes: string[];
}

export interface ItemVersion extends ItemVersionInfo {
  itemId: string;
  snapshot: ServiceItemDetail;
}

export interface ReviewRecord {
  id: string;
  itemId: string;
  versionId: string;
  type: ReviewType;
  status: ReviewStatus;
  reviewer: string;
  reviewerDept: string;
  opinion: string;
  createdAt: string;
  attachments?: string[];
}

export interface ReviewFlowNode {
  id: string;
  nodeName: string;
  nodeType: 'start' | 'review' | 'sign' | 'end';
  assigneeDept: string;
  assignee?: string;
  status: 'pending' | 'processing' | 'completed' | 'skipped';
  order: number;
  opinion?: string;
  handledAt?: string;
  handler?: string;
}

export interface ItemTemplate {
  id: string;
  name: string;
  code: string;
  category: string;
  level: ItemLevel;
  source: string;
  description: string;
  fieldCount: number;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  isStandard: boolean;
}

export interface CompilationProgress {
  id: string;
  department: string;
  departmentId: string;
  total: number;
  completed: number;
  drafting: number;
  reviewing: number;
  returned: number;
  overdue: number;
  deadline: string;
  completionRate: number;
}

export interface ValidationRule {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  enabled: boolean;
  field?: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: string;
  type: 'rule' | 'case' | 'specification' | 'faq';
  content: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface CategoryNode {
  id: string;
  name: string;
  code: string;
  children?: CategoryNode[];
  itemCount?: number;
}

export interface UserInfo {
  id: string;
  name: string;
  department: string;
  departmentId: string;
  level: ItemLevel;
  role: string;
  avatar?: string;
  permissions: string[];
}

export interface Announcement {
  id: string;
  title: string;
  type: 'release' | 'change' | 'notice';
  version?: string;
  content: string;
  publishDate: string;
  publisher: string;
  attachments?: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export interface ValidationIssue {
  id: string;
  field: string;
  fieldName: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  ruleCode?: string;
  suggestion?: string;
}
