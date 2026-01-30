import React from 'react';
import { Link } from 'react-router-dom';
import { Store, ArrowRight, ShoppingBag, BarChart2, Globe } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold">Store Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                Log in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Start free trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-30"
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2274&q=80"
            alt="Background"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Be the next<br />one to watch
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Dream big, build fast, and grow far on our platform. Start your journey today with our powerful e-commerce solution.
          </p>
          <div className="mt-10 flex items-center space-x-6">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Start free trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <span className="text-sm text-gray-300">
              Get 3 days free, then 3 months for $1/month
            </span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-green-50 p-3">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-6 text-lg font-medium text-gray-900">Powerful E-commerce</h2>
              <p className="mt-2 text-base text-gray-500">
                Everything you need to start, manage, and grow your online business.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-green-50 p-3">
                <BarChart2 className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-6 text-lg font-medium text-gray-900">Advanced Analytics</h2>
              <p className="mt-2 text-base text-gray-500">
                Get detailed insights and analytics to optimize your business performance.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-green-50 p-3">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-6 text-lg font-medium text-gray-900">Global Reach</h2>
              <p className="mt-2 text-base text-gray-500">
                Sell to customers worldwide with our international commerce tools.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Store className="h-6 w-6 text-gray-400" />
              <span className="ml-2 text-gray-500">© 2024 Store Admin. All rights reserved.</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
