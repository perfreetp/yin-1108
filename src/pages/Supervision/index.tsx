import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Filter,
  Download,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';
import { compilationProgress } from '@/data/knowledge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { cn } from '@/lib/utils';

export default function Supervision() {
  const [activeTab, setActiveTab] = useState<'department' | 'category' | 'level'>('department');
  const [sortBy, setSortBy] = useState<'completionRate' | 'overdue' | 'total'>('completionRate');

  const progressData = [...compilationProgress].sort((a, b) => {
    if (sortBy === 'completionRate') return b.completionRate - a.completionRate;
    if (sortBy === 'overdue') return b.overdue - a.overdue;
    return b.total - a.total;
  });

  const barChartData = progressData.slice(0, 8).map((item) => ({
    name: item.department.replace('省', '').replace('厅', '').replace('局', ''),
    已完成: item.completed,
    进行中: item.drafting + item.reviewing,
    已退回: item.returned,
  }));

  const trendData = [
    { date: '3/17', 完成率: 52, 事项数: 130 },
    { date: '3/18', 完成率: 58, 事项数: 145 },
    { date: '3/19', 完成率: 62, 事项数: 155 },
    { date: '3/20', 完成率: 65, 事项数: 162 },
    { date: '3/21', 完成率: 68, 事项数: 170 },
    { date: '3/22', 完成率: 71, 事项数: 178 },
    { date: '3/23', 完成率: 74, 事项数: 185 },
  ];

  const categoryData = [
    { name: '行政许可', value: 128, color: '#3b82f6' },
    { name: '行政确认', value: 86, color: '#10b981' },
    { name: '行政给付', value: 52, color: '#f59e0b' },
    { name: '行政奖励', value: 34, color: '#8b5cf6' },
    { name: '行政裁决', value: 18, color: '#ef4444' },
    { name: '其他权力', value: 96, color: '#64748b' },
  ];

  const levelData = [
    { name: '省级', 完成率: 78, 总数: 248, 已完成: 193 },
    { name: '市级', 完成率: 65, 总数: 856, 已完成: 556 },
    { name: '县级', 完成率: 52, 总数: 2340, 已完成: 1217 },
  ];

  const stats = [
    { label: '总体完成率', value: '62.9%', icon: TrendingUp, color: 'green', trend: 5.2 },
    { label: '逾期事项', value: 1, icon: AlertTriangle, color: 'red', trend: -25 },
    { label: '待审校', value: 32, icon: Clock, color: 'amber', trend: 12 },
    { label: '本月新增', value: 28, icon: CheckCircle2, color: 'blue', trend: 18 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800">编制进度总览</h2>
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
            {[
              { key: 'department', label: '按部门' },
              { key: 'category', label: '按分类' },
              { key: 'level', label: '按层级' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-md transition-colors',
                  activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow-sm font-medium'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            筛选
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            导出报表
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses: Record<string, string> = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            amber: 'bg-amber-50 text-amber-600',
            red: 'bg-red-50 text-red-600',
          };

          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
                </div>
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    colorClasses[stat.color]
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs">
                <TrendingUp
                  className={cn(
                    'w-3.5 h-3.5',
                    stat.trend > 0 ? 'text-green-500' : 'text-red-500'
                  )}
                />
                <span
                  className={cn(
                    'font-medium',
                    stat.trend > 0 ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {stat.trend > 0 ? '+' : ''}
                  {stat.trend}%
                </span>
                <span className="text-slate-400">较上周</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-slate-800">各部门完成率排名</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortBy('completionRate')}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 text-xs rounded-md',
                  sortBy === 'completionRate'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-slate-500 hover:bg-slate-100'
                )}
              >
                <ArrowUpDown className="w-3 h-3" />
                完成率
              </button>
              <button
                onClick={() => setSortBy('overdue')}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 text-xs rounded-md',
                  sortBy === 'overdue'
                    ? 'bg-red-100 text-red-600'
                    : 'text-slate-500 hover:bg-slate-100'
                )}
              >
                逾期数
              </button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} layout="vertical" barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="#94a3b8" width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend />
                <Bar dataKey="已完成" fill="#10b981" radius={[0, 4, 4, 0]} stackId="a" />
                <Bar dataKey="进行中" fill="#f59e0b" stackId="a" />
                <Bar dataKey="已退回" fill="#ef4444" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-5">事项分类分布</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={60}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-5">编制进度趋势</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="完成率"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRate)"
                name="完成率(%)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="事项数"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCount)"
                name="事项数"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">部门详情列表</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                排名
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                部门名称
              </th>
              <th className="text-center px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                总事项数
              </th>
              <th className="text-center px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                已完成
              </th>
              <th className="text-center px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                草稿
              </th>
              <th className="text-center px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                审核中
              </th>
              <th className="text-center px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                已退回
              </th>
              <th className="text-center px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                逾期
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                完成率
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                截止日期
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {progressData.map((dept, index) => (
              <tr key={dept.id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                      index === 0
                        ? 'bg-amber-100 text-amber-600'
                        : index === 1
                        ? 'bg-slate-100 text-slate-600'
                        : index === 2
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-slate-50 text-slate-500'
                    )}
                  >
                    {index + 1}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-sm font-medium text-slate-800">{dept.department}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-center text-sm text-slate-600">{dept.total}</td>
                <td className="px-5 py-4 text-center text-sm text-green-600 font-medium">
                  {dept.completed}
                </td>
                <td className="px-5 py-4 text-center text-sm text-slate-600">{dept.drafting}</td>
                <td className="px-5 py-4 text-center text-sm text-amber-600">{dept.reviewing}</td>
                <td className="px-5 py-4 text-center text-sm text-red-600">{dept.returned}</td>
                <td className="px-5 py-4 text-center">
                  {dept.overdue > 0 ? (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                      {dept.overdue}
                    </span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          dept.completionRate >= 80
                            ? 'bg-green-500'
                            : dept.completionRate >= 60
                            ? 'bg-blue-500'
                            : dept.completionRate >= 40
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        )}
                        style={{ width: `${dept.completionRate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-700 w-12">
                      {dept.completionRate.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-500">{dept.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
