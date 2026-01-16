import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { ThemeEditor } from './pages/editor/GROW/ThemeEditor';
import { Store } from './pages/Store/Store';
import { NotFound } from './pages/NotFound';
import { Segments } from './pages/dashboard/products/Segments';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';

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
    path: '/loja/*',
    element: <Store />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export function Routes() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
