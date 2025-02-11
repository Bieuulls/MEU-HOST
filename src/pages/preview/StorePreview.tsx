export function StorePreview() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Nome da Loja</h1>
          <p className="mt-2 text-gray-600">Descrição da loja vai aqui</p>
        </div>
      </header>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Produtos em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product Card */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-square bg-gray-100"></div>
              <div className="p-4">
                <h3 className="font-medium">Nome do Produto</h3>
                <p className="mt-1 text-gray-600">R$ 99,90</p>
              </div>
            </div>
            {/* Repeat product cards */}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Category Card */}
            <div className="bg-blue-600 text-white rounded-lg p-6 text-center">
              <h3 className="font-medium">Categoria 1</h3>
            </div>
            {/* Repeat category cards */}
          </div>
        </div>
      </section>
    </div>
  );
}
