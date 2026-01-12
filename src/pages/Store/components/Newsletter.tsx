import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

export const Newsletter: React.FC = () => {
  const { theme } = useTheme();
  const { newsletter: settings } = theme;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (!settings.enabled) return null;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <section
      className={`py-16 relative overflow-hidden`}
      style={{
        background: settings.background.type === 'gradient'
          ? `linear-gradient(to ${settings.background.gradient.direction}, ${settings.background.gradient.from}, ${settings.background.gradient.to})`
          : settings.background.color
      }}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="container mx-auto px-4 relative">
        <div
          className={`
            ${settings.layout.type === 'boxed' ? 'max-w-2xl' : 'max-w-4xl'}
            mx-auto text-center
            ${settings.layout.type === 'boxed' ? 'bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-lg border border-gray-100' : ''}
          `}
        >
          <h2
            className={`
              text-${settings.title.fontSize}
              font-${settings.title.fontWeight}
              mb-${settings.title.marginBottom}
              relative inline-block
            `}
            style={{ color: settings.title.color }}
          >
            {settings.title.text}
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-blue-600 rounded-full"></span>
          </h2>
          <p
            className={`
              text-${settings.subtitle.fontSize}
              font-${settings.subtitle.fontWeight}
              mb-${settings.subtitle.marginBottom}
              max-w-xl mx-auto
            `}
            style={{ color: settings.subtitle.color }}
          >
            {settings.subtitle.text}
          </p>
          <form onSubmit={handleSubmit} className="mt-8 relative">
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="flex-1 relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={settings.input.placeholder}
                  disabled={status === 'loading'}
                  className={`
                    w-full px-4 py-3 pr-12
                    rounded-lg
                    border-2 border-gray-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-all duration-300 ease-in-out
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${status === 'error' ? 'border-red-300 bg-red-50' : ''}
                    ${status === 'success' ? 'border-green-300 bg-green-50' : ''}
                  `}
                  style={{
                    backgroundColor: settings.input.backgroundColor,
                    color: settings.input.textColor
                  }}
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-transform duration-300 group-hover:scale-110">
                  {status === 'loading' ? (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : status === 'success' ? (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className={`
                  px-6 py-3
                  rounded-lg
                  font-semibold
                  transform transition-all duration-300 ease-in-out
                  hover:scale-[1.02] hover:shadow-lg
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  relative overflow-hidden
                  bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                  text-white shadow-md
                `}
              >
                <span className={`inline-flex items-center transition-opacity duration-300 ${status === 'loading' ? 'opacity-0' : 'opacity-100'}`}>
                  {settings.button.text}
                </span>
                {status === 'loading' && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
            {message && (
              <div className={`mt-3 text-sm transition-all duration-300 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};