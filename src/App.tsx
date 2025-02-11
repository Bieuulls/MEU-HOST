import { BrowserRouter as Router, Routes, Route, Outlet, Link } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Store } from './pages/store/Store';
import { ThemeEditor } from './pages/theme-editor/ThemeEditor';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/error/ErrorBoundary';
import { ErrorProvider } from './contexts/error/ErrorContext';
import { StorePreview } from './pages/store/preview/StorePreview';
import { Products } from './pages/dashboard/Products';
import { Orders } from './pages/dashboard/Orders';
import { Customers } from './pages/dashboard/Customers';
import { Dashboard } from './pages/dashboard/Dashboard';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/store/Header';
import { Footer } from './components/store/Footer';
import { Home } from './pages/store/Home';
import { Categories } from './components/store/Categories';
import { ProductDetail } from './pages/store/ProductDetail';

function LayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <ThemeProvider>
          <Router>
            <AuthProvider>
              <Routes>
                {/* Rotas do dashboard */}
                <Route path="/" element={<LayoutWrapper />}>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="products" element={<Products />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="store" element={<Store />} />
                </Route>

                {/* Rotas separadas do editor de tema */}
                <Route path="/theme-editor/:themeId" element={<ThemeEditor />} />
                <Route path="/theme-preview/:themeId" element={<StorePreview />} />
                <Route path="/store/preview/:themeId" element={<StorePreview />} />

                {/* Rotas da loja */}
                <Route path="/loja" element={
                  <CartProvider>
                    <div className="min-h-screen flex flex-col">
                      <Header 
                        cartCount={0}
                        onSearch={(query) => console.log('Search:', query)}
                      />
                      <main className="flex-grow">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/categorias" element={<Categories />} />
                          <Route path="/categoria/:categoryId" element={<Categories />} />
                          <Route path="/produto/:productId" element={<ProductDetail />} />
                        </Routes>
                      </main>
                      <Footer />
                    </div>
                  </CartProvider>
                } />

                {/* Rota de fallback para páginas não encontradas */}
                <Route path="*" element={
                  <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-2xl font-bold mb-4">Página não encontrada</h1>
                    <Link to="/" className="text-blue-500 hover:underline">
                      Voltar para o Dashboard
                    </Link>
                  </div>
                } />

                {/* Rota para o editor de tema */}
                <Route path="/admin/tema" element={<ThemeEditor />} />
              </Routes>
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </ErrorProvider>
    </ErrorBoundary>
  );
}