import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import Dashboard from '@/pages/Dashboard';
import ItemLibrary from '@/pages/ItemLibrary';
import Compilation from '@/pages/Compilation';
import Review from '@/pages/Review';
import Version from '@/pages/Version';
import Supervision from '@/pages/Supervision';
import Knowledge from '@/pages/Knowledge';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/item-library" element={<ItemLibrary />} />
          <Route path="/item-library/:id" element={<div className="p-6">事项详情页</div>} />
          <Route path="/item-library/templates" element={<div className="p-6">模板管理</div>} />
          <Route path="/compilation" element={<Compilation />} />
          <Route path="/compilation/:id" element={<div className="p-6">事项编制页</div>} />
          <Route path="/review" element={<Review />} />
          <Route path="/review/:id" element={<div className="p-6">审校详情页</div>} />
          <Route path="/version" element={<Version />} />
          <Route path="/announcement" element={<Version />} />
          <Route path="/supervision" element={<Supervision />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/settings" element={<div className="p-6">系统设置</div>} />
        </Route>
      </Routes>
    </Router>
  );
}
