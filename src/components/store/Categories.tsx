import { Link } from 'react-router-dom';
import { Smartphone, Laptop, Headphones } from 'lucide-react';

const categories = [
  {
    id: 'electronics',
    name: 'Eletrônicos',
    icon: Smartphone,
    description: 'Smartphones, tablets e gadgets',
    subcategories: ['Smartphones', 'Tablets', 'Acessórios']
  },
  {
    id: 'computers',
    name: 'Computadores',
    icon: Laptop,
    description: 'Notebooks, desktops e periféricos',
    subcategories: ['Notebooks', 'Desktops', 'Monitores']
  },
  {
    id: 'accessories',
    name: 'Acessórios',
    icon: Headphones,
    description: 'Fones, cases e mais',
    subcategories: ['Fones de Ouvido', 'Cases', 'Carregadores']
  }
];

export function Categories() {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Categorias
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Encontre os melhores produtos em cada categoria
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={`/categoria/${category.id}`}
                className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <Icon className="h-8 w-8 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-gray-500">{category.description}</p>
                  
                  <ul className="mt-4 space-y-2">
                    {category.subcategories.map((sub) => (
                      <li key={sub} className="text-sm text-gray-600 hover:text-blue-600">
                        • {sub}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
