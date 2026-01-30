import { RouteObject } from 'react-router-dom';
import { DashboardLayout, Dashboard, Orders, Products, Customers, Content, Analytics, Marketing, OnlineStore } from '../pages';

const dashboardRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: <DashboardLayout><Dashboard /></DashboardLayout>,
  },
  {
    path: 'orders',
    element: <DashboardLayout><Orders /></DashboardLayout>,
  },
  {
    path: 'products',
    element: <DashboardLayout><Products /></DashboardLayout>,
  },
  {
    path: 'customers',
    element: <DashboardLayout><Customers /></DashboardLayout>,
  },
  {
    path: 'content',
    element: <DashboardLayout><Content /></DashboardLayout>,
  },
  {
    path: 'analytics',
    element: <DashboardLayout><Analytics /></DashboardLayout>,
  },
  {
    path: 'marketing',
    element: <DashboardLayout><Marketing /></DashboardLayout>,
  },
  {
    path: 'online-store',
    element: <DashboardLayout><OnlineStore /></DashboardLayout>,
  },
];
