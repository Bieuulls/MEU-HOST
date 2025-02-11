import { Routes, Route } from 'react-router-dom';
import { DashboardHome } from './dashboard/DashboardHome';
import { ProductList } from './dashboard/products/ProductList';
import { ProductForm } from './dashboard/products/ProductForm';
import { SalesChannelsPreview } from './dashboard/SalesChannelsPreview';
import { NotFound } from './NotFound';

export function Dashboard() {
  return (
    <Routes>
      <Route path="inicio" element={<DashboardHome />} />
      <Route path="produtos" element={<ProductList />} />
      <Route path="produtos/novo" element={<ProductForm />} />
      <Route path="produtos/:id" element={<ProductForm />} />
      <Route path="canais-vendas/*" element={<SalesChannelsPreview />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}