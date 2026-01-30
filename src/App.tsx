import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { SignUp } from './pages/auth/SignUp';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Orders } from './pages/Orders';
import { Products } from './pages/Products';
import { AddProduct } from './pages/Products/AddProduct';
import { Dashboard } from './pages/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Home } from './pages/Home';
import { Customers } from './pages/Customers';
import { Content } from './pages/Content';
import { Analytics } from './pages/Analytics';
import { Marketing } from './pages/Marketing';
import { OnlineStore } from './pages/OnlineStore';
import { ThemeEditor } from './pages/OnlineStore/components/EditorThemeSite/ThemeEditor';
import { Settings } from './pages/Settings';
import { Store } from './pages/Store';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TenantProvider>
          <ThemeProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/store" element={<Store />} />

              <Route path="/dashboard" element={<PrivateRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/add" element={<AddProduct />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="content" element={<Content />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="marketing" element={<Marketing />} />
                  <Route path="online-store" element={<OnlineStore />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="theme-editor" element={<ThemeEditor />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </ThemeProvider>
        </TenantProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;