import { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  Download,
  Upload,
  Grid3X3,
  List,
  ArrowUpDown,
  Eye,
  Edit,
  MoreHorizontal,
  BookCopy,
  Tag,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { categories, serviceItems } from '@/data/items';
import StatusBadge, { StandardBadge } from '@/components/StatusBadge';
import type { CategoryNode, ItemStatus, ItemLevel } from '@/types';
import { cn } from '@/lib/utils';

export default function ItemLibrary() {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['cat-001']);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<ItemStatus | ''>('');
  const [levelFilter, setLevelFilter] = useState<ItemLevel | ''>('');
  const [sortBy, setSortBy] = useState('updatedAt');

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const renderCategoryTree = (nodes: CategoryNode[], level = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedCategories.includes(node.id);
      const isSelected = selectedCategory === node.id;

      return (
        <div key={node.id}>
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg text-sm transition-colors',
              isSelected
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-700 hover:bg-slate-100'
            )}
            style={{ paddingLeft: `${12 + level * 16}px` }}
            onClick={() => {
              setSelectedCategory(node.id);
              if (hasChildren) {
                toggleCategory(node.id);
              }
            }}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              )
            ) : (
              <span className="w-4 h-4 flex-shrink-0" />
            )}
            <Folder
              className={cn(
                'w-4 h-4 flex-shrink-0',
                isSelected ? 'text-blue-500' : 'text-amber-500'
              )}
            />
            <span className="flex-1 truncate">{node.name}</span>
            {node.itemCount !== undefined && (
              <span className="text-xs text-slate-400">{node.itemCount}</span>
            )}
          </div>
          {hasChildren && isExpanded && (
            <div>{renderCategoryTree(node.children!, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  const filteredItems = serviceItems.filter((item) => {
    if (keyword) {
      const kw = keyword.toLowerCase();
      if (
        !item.name.toLowerCase().includes(kw) &&
        !item.code.toLowerCase().includes(kw)
      ) {
        return false;
      }
    }
    if (selectedCategory && item.categoryId !== selectedCategory) {
      const category = findCategoryById(categories, selectedCategory);
      if (category) {
        const childIds = getAllChildIds(category);
        if (!childIds.includes(item.categoryId)) {
          return false;
        }
      } else {
        return false;
      }
    }
    if (statusFilter && item.status !== statusFilter) {
      return false;
    }
    if (levelFilter && item.level !== levelFilter) {
      return false;
    }
    return true;
  });

  function findCategoryById(nodes: CategoryNode[], id: string): CategoryNode | null {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findCategoryById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  function getAllChildIds(node: CategoryNode): string[] {
    let ids: string[] = [node.id];
    if (node.children) {
      for (const child of node.children) {
        ids = [...ids, ...getAllChildIds(child)];
      }
    }
    return ids;
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-160px)]">
      <div className="w-64 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">事项分类</h3>
        </div>
        <div className="flex-1 overflow-auto p-2">{renderCategoryTree(categories)}</div>
        <div className="p-3 border-t border-slate-100">
          <button className="w-full flex items-center justify-center gap-2 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            新增分类
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索事项名称、编码..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ItemStatus | '')}
                className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">全部状态</option>
                <option value="draft">草稿</option>
                <option value="reviewing">审核中</option>
                <option value="returned">已退回</option>
                <option value="published">已发布</option>
                <option value="archived">已归档</option>
              </select>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value as ItemLevel | '')}
                className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">全部层级</option>
                <option value="national">国家级</option>
                <option value="provincial">省级</option>
                <option value="municipal">市级</option>
                <option value="county">县级</option>
              </select>
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
                <Filter className="w-4 h-4" />
                更多筛选
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-1.5 rounded-md transition-colors',
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-1.5 rounded-md transition-colors',
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Upload className="w-4 h-4" />
                导入
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4" />
                导出
              </button>
              <button
                onClick={() => navigate('/item-library/new')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                新建事项
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>共 {filteredItems.length} 条</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
                <ArrowUpDown className="w-4 h-4" />
                按更新时间
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {viewMode === 'list' ? (
              <table className="w-full">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      事项名称
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      事项编码
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      所属部门
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      标准来源
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      更新时间
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/item-library/${item.id}`)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600 font-mono">
                        {item.code}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {item.department}
                      </td>
                      <td className="px-5 py-4">
                        {item.standardSource && (
                          <StandardBadge source={item.standardSource} />
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {item.updatedAt}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/item-library/${item.id}`);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="查看"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/compilation/${item.id}`);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="编辑"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                            title="更多"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-5 grid grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-blue-200 cursor-pointer transition-all"
                    onClick={() => navigate(`/item-library/${item.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-500" />
                      </div>
                      <StatusBadge status={item.status} size="sm" />
                    </div>
                    <h4 className="font-medium text-slate-800 mb-1 line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">{item.code}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.standardSource && (
                        <StandardBadge source={item.standardSource} />
                      )}
                      <span className="text-xs text-slate-400">{item.department}</span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{item.updatedAt}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/item-library/${item.id}`);
                          }}
                          className="p-1 text-slate-400 hover:text-blue-600"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/compilation/${item.id}`);
                          }}
                          className="p-1 text-slate-400 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
