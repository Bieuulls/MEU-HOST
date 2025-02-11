import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
// ... resto das importações existentes ... 