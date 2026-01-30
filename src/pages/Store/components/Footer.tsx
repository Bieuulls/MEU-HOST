import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

interface FooterSection {
  title: {
    text: string;
    fontSize: string;
    fontWeight: string;
    color: string;
  };
  type: string;
  links: FooterLink[];
  iconColor?: string;
  linkStyle?: {
    color: string;
    fontSize: string;
  };
}

interface FooterLink {
  platform: string;
  url: string;
  text: string;
}

export const Footer: React.FC = () => {
  const { theme } = useTheme();
  const settings = theme?.footer || {};
  const newsletterSettings = theme?.newsletter || {};

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setStatus('error');
      setMessage('Por favor, insira um email válido');
      return;
    }

    setStatus('loading');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('success');
      setMessage('Obrigado por se inscrever!');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('Ocorreu um erro. Tente novamente.');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return (
          <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'success':
        return (
          <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        );
    }
  };

  const socialIcons: Record<string, React.ReactNode> = {
    facebook: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
      </svg>
    ),
    instagram: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
    twitter: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
      </svg>
    ),
    linkedin: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    )
  };

  const defaultPadding = { top: 8, bottom: 8 };
  const padding = settings?.layout?.padding || defaultPadding;

  return (
    <footer
      className={`py-${padding.top} pb-${padding.bottom} bg-gradient-to-b from-gray-50 to-white`}
      style={{
        borderTop: settings?.style?.borderTop ? `1px solid ${settings?.style?.borderColor || '#e5e7eb'}` : 'none'
      }}
    >
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 ${settings?.layout?.columns ? `md:grid-cols-${settings?.layout?.columns}` : 'md:grid-cols-4'} gap-8 lg:gap-12`}>
          {settings?.sections?.map((section: FooterSection, index: number) => (
            <div key={index} className="space-y-4">
              <h3
                className={`text-${section?.title?.fontSize || 'lg'} font-${section?.title?.fontWeight || 'semibold'} relative inline-block pb-2`}
                style={{ color: section?.title?.color || '#111827' }}
              >
                {section?.title?.text}
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-blue-600 rounded-full"></span>
              </h3>

              {section.type === 'social' && section.links?.length > 0 && (
                <div className="flex gap-4">
                  {section.links.map((link: FooterLink, i: number) => {
                    const icon = socialIcons[link.platform];
                    return icon ? (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 transition-colors"
                        style={{ color: section.iconColor || '#4B5563' }}
                      >
                        {icon}
                      </a>
                    ) : null;
                  })}
                </div>
              )}

              {section.type === 'links' && section.links?.length > 0 && (
                <ul className="space-y-2">
                  {section.links.map((link: FooterLink, i: number) => (
                    <li key={i}>
                      <a
                        href={link.url}
                        className="hover:text-blue-600 transition-colors inline-block"
                        style={{
                          color: section.linkStyle?.color || '#4B5563',
                          fontSize: section.linkStyle?.fontSize || '0.875rem'
                        }}
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              {section.type === 'badges' && (
                <div className="flex gap-6 items-center">
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-600 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <span className="text-sm text-gray-600">Secure Shopping</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-600 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <span className="text-sm text-gray-600">SSL Security</span>
                  </div>
                </div>
              )}

              {section.type === 'newsletter' && (
                <div className="w-full max-w-md mx-auto">
                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={newsletterSettings.input?.placeholder || 'Seu melhor email'}
                        className={`
                          w-full px-4 py-3 rounded-md
                          border focus:outline-none focus:ring-2 focus:ring-blue-500
                          transition-colors duration-200
                          ${status === 'error' ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}
                        `}
                        style={{
                          backgroundColor: newsletterSettings.input?.backgroundColor || '#FFFFFF',
                          color: newsletterSettings.input?.textColor || '#1F2937',
                          borderColor: status === 'error' ? '#FCA5A5' : (newsletterSettings.input?.borderColor || '#E5E7EB')
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className={`
                        w-full px-6 py-3 rounded-md
                        flex items-center justify-center gap-2
                        transition-all duration-200 bg-blue-600
                        ${status === 'loading' ? 'opacity-80' : 'hover:opacity-90'}
                      `}
                    >
                      {getStatusIcon()}
                      <span>{status === 'loading' ? 'Enviando...' : (newsletterSettings.button?.text || 'Inscrever-se')}</span>
                    </button>

                    {message && (
                      <p
                        className={`text-sm mt-2 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}
                        role="alert"
                      >
                        {message}
                      </p>
                    )}
                  </form>
                </div>
              )}

              {section.type === 'payment' && (
                <div className="flex gap-3 flex-wrap items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  <img
                    src="/assets/payment/visa.svg"
                    alt="Visa"
                    className="h-6"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <img
                    src="/assets/payment/mastercard.svg"
                    alt="Mastercard"
                    className="h-6"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <img
                    src="/assets/payment/amex.svg"
                    alt="American Express"
                    className="h-6"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <img
                    src="/assets/payment/boleto.svg"
                    alt="Boleto"
                    className="h-6"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {settings?.copyright && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p
              className="text-sm text-center"
              style={{ color: settings.copyright.color || '#6B7280' }}
            >
              {settings.copyright.text}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
};