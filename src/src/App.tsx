import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';
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
// ... resto das importações existentes ... 