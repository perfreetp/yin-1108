import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import Dashboard from '@/pages/Dashboard';
import ItemLibrary from '@/pages/ItemLibrary';
import ItemDetail from '@/pages/ItemLibrary/ItemDetail';
import Compilation from '@/pages/Compilation';
import CompilationForm from '@/pages/Compilation/CompilationForm';
import Review from '@/pages/Review';
import ReviewDetail from '@/pages/Review/ReviewDetail';
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
          <Route path="/item-library/:id" element={<ItemDetail />} />
          <Route path="/item-library/templates" element={<div className="p-6">模板管理</div>} />
          <Route path="/compilation" element={<Compilation />} />
          <Route path="/compilation/new" element={<CompilationForm />} />
          <Route path="/compilation/:id" element={<CompilationForm />} />
          <Route path="/review" element={<Review />} />
          <Route path="/review/:id" element={<ReviewDetail />} />
          <Route path="/review/:id/:action" element={<ReviewDetail />} />
          <Route path="/version" element={<Version />} />
          <Route path="/announcement" element={<Version />} />
          <Route path="/announcement/new" element={<Version />} />
          <Route path="/announcement/:id" element={<Version />} />
          <Route path="/supervision" element={<Supervision />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/settings" element={<div className="p-6">系统设置</div>} />
        </Route>
      </Routes>
    </Router>
  );
}
