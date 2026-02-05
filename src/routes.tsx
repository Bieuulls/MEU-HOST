import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { ThemeEditor } from './pages/editor/GROW/ThemeEditor';
import { Store } from './pages/store/Store';
import { NotFound } from './pages/NotFound';
import { Segments } from './pages/dashboard/products/Segments';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/store/Header';
import { Footer } from './components/store/Footer';
import { Home as StoreHome } from './pages/store/Home';
import { Categories } from './components/store/Categories';
import { ProductDetail } from './pages/store/ProductDetail';
import { ErrorBoundary } from './components/error/ErrorBoundary';
import { ErrorProvider } from './contexts/error/ErrorContext';
import { ThemeProvider } from './contexts/ThemeContext';

function StoreLayout() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header
          cartCount={0}
          onSearch={(query) => console.log('Search:', query)}
        />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/cadastro',
    element: <Register />,
  },
  {
    path: '/recuperar-senha',
    element: <ResetPassword />,
  },
  {
    path: '/editor/tema',
    element: <ThemeEditor />,
  },
  {
    path: '/dashboard/*',
    element: (
      <PrivateRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </PrivateRoute>
    ),
    children: [
      {
        path: 'produtos/segmentos',
        element: <Segments />,
      },
    ],
  },
  {
    path: '/store',
    element: <Store />,
  },
  {
    path: '/loja',
    element: <StoreLayout />,
    children: [
      {
        index: true,
        element: <StoreHome />,
      },
      {
        path: 'categorias',
        element: <Categories />,
      },
      {
        path: 'categoria/:categoryId',
        element: <Categories />,
      },
      {
        path: 'produto/:productId',
        element: <ProductDetail />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export function Routes() {
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <ThemeProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </ThemeProvider>
      </ErrorProvider>
    </ErrorBoundary>
  );
}
