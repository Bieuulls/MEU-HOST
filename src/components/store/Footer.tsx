import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const navigation = {
  shop: [
    { name: 'Produtos', href: '/produtos' },
    { name: 'Categorias', href: '/categorias' },
    { name: 'Ofertas', href: '/ofertas' },
    { name: 'Novidades', href: '/novidades' },
  ],
  support: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Envio', href: '/envio' },
    { name: 'Devolução', href: '/devolucao' },
    { name: 'Contato', href: '/contato' },
  ],
  company: [
    { name: 'Sobre', href: '/sobre' },
    { name: 'Blog', href: '/blog' },
    { name: 'Trabalhe Conosco', href: '/carreiras' },
    { name: 'Imprensa', href: '/imprensa' },
  ],
  social: [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Contato
            </h3>
            <ul role="list" className="mt-4 space-y-4">
              <li>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="ml-3 text-base text-gray-500">
                    (11) 1234-5678
                  </span>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="ml-3 text-base text-gray-500">
                    contato@seusite.com
                  </span>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="ml-3 text-base text-gray-500">
                    São Paulo, SP
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Loja
            </h3>
            <ul role="list" className="mt-4 space-y-4">
              {navigation.shop.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Suporte
            </h3>
            <ul role="list" className="mt-4 space-y-4">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Newsletter
            </h3>
            <p className="mt-4 text-base text-gray-500">
              Receba nossas novidades e ofertas exclusivas.
            </p>
            <form className="mt-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="min-w-0 flex-1 appearance-none rounded-md border border-gray-300 bg-white py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="ml-3 flex-shrink-0 rounded-md border border-transparent bg-blue-600 py-2 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Inscrever
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex space-x-6">
              {navigation.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
            <p className="text-base text-gray-400">
              &copy; {new Date().getFullYear()} Sua Loja. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
