import {
  FileText,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Plus,
  Bell,
  TrendingUp,
  Award,
} from 'lucide-react';
import StatCard, { StatCardWithProgress } from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { serviceItems } from '@/data/items';
import { compilationProgress, announcements } from '@/data/knowledge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();

  const todoItems = serviceItems
    .filter((item) => item.status === 'reviewing' || item.status === 'draft')
    .slice(0, 5);

  const recentAnnouncements = announcements.slice(0, 3);

  const chartData = compilationProgress.slice(0, 6).map((item) => ({
    name: item.department.replace('省', '').replace('厅', '').replace('局', ''),
    已完成: item.completed,
    进行中: item.total - item.completed,
    完成率: item.completionRate,
  }));

  const pieData = [
    { name: '已发布', value: 156, color: '#10b981' },
    { name: '审核中', value: 32, color: '#f59e0b' },
    { name: '草稿', value: 48, color: '#64748b' },
    { name: '已退回', value: 12, color: '#ef4444' },
  ];

  const quickActions = [
    { label: '新建事项', icon: Plus, path: '/item-library', color: 'blue' },
    { label: '我的编制', icon: FileText, path: '/compilation', color: 'green' },
    { label: '待我审校', icon: ClipboardCheck, path: '/review', color: 'amber' },
    { label: '编制进度', icon: TrendingUp, path: '/supervision', color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">欢迎回来，管理员</h2>
          <p className="text-sm text-slate-500 mt-1">
            今天是 2025年3月23日 星期日，您有 5 项待办事项待处理
          </p>
        </div>
        <button
          onClick={() => navigate('/item-library')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          新建事项
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="事项总数"
          value={248}
          icon={FileText}
          color="blue"
          trend={{ value: 12, isUp: true }}
        />
        <StatCard
          title="已发布"
          value={156}
          icon={CheckCircle2}
          color="green"
          trend={{ value: 8, isUp: true }}
        />
        <StatCard
          title="审核中"
          value={32}
          icon={Clock}
          color="amber"
          description="待审校事项 12 项"
        />
        <StatCard
          title="逾期预警"
          value={3}
          icon={AlertTriangle}
          color="red"
          description="较上周增加 1 项"
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const colorClasses: Record<string, string> = {
            blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
            green: 'bg-green-50 text-green-600 hover:bg-green-100',
            amber: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
            purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
          };

          return (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className={`flex items-center gap-3 p-4 rounded-xl transition-all hover:shadow-md ${colorClasses[action.color]}`}
            >
              <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-medium">{action.label}</p>
                <p className="text-xs opacity-70">立即前往</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-slate-800">各部门编制进度</h3>
            <button
              onClick={() => navigate('/supervision')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              查看全部
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend />
                <Bar dataKey="已完成" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="进行中" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-slate-800">事项状态分布</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
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
                  height={36}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-slate-800">待办事项</h3>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                {todoItems.length}
              </span>
            </div>
            <button
              onClick={() => navigate('/review')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              全部待办
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {todoItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() =>
                  navigate(
                    item.status === 'draft'
                      ? `/compilation/${item.id}`
                      : `/review/${item.id}`
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      item.status === 'reviewing'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {item.status === 'reviewing' ? (
                      <ClipboardCheck className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.department} · {item.code}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={item.status} />
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-slate-800">最新公告</h3>
            </div>
            <button
              onClick={() => navigate('/announcement')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              更多
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => navigate('/announcement')}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      ann.type === 'release'
                        ? 'bg-green-500'
                        : ann.type === 'change'
                        ? 'bg-blue-500'
                        : 'bg-amber-500'
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 line-clamp-2">
                      {ann.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {ann.publisher} · {ann.publishDate}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-slate-800">部门完成率排名</h3>
          <button
            onClick={() => navigate('/supervision')}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            查看详情
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[...compilationProgress]
            .sort((a, b) => b.completionRate - a.completionRate)
            .slice(0, 4)
            .map((dept, index) => (
              <StatCardWithProgress
                key={dept.id}
                title={dept.department.replace('省', '')}
                value={dept.completed}
                total={dept.total}
                progress={dept.completionRate}
                color={index === 0 ? 'green' : index === 1 ? 'blue' : index === 2 ? 'amber' : 'blue'}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
