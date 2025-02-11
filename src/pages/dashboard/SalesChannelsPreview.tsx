import { Monitor, Smartphone, Paintbrush, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';

export function SalesChannelsPreview() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Canais de Vendas</h1>
        <div className="flex gap-4">
          <a
            href="/editor/tema"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Paintbrush className="h-4 w-4" />
            Editar Tema
          </a>
          <a
            href="/loja"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <ExternalLink className="h-4 w-4" />
            Ver Loja
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Desktop Preview */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-3 border-b flex items-center gap-2">
            <Monitor className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-700">Visualização Desktop</span>
          </div>
          <div className="aspect-[16/9] bg-white border-b">
            <div className="w-full h-full bg-gray-50 flex items-center justify-center">
              <ImageWithFallback
                src="/preview/desktop.png"
                alt="Desktop preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Mobile Preview */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-3 border-b flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-700">Visualização Mobile</span>
          </div>
          <div className="aspect-[9/16] bg-white border-b p-4">
            <div className="w-full h-full bg-gray-50 flex items-center justify-center rounded-lg">
              <ImageWithFallback
                src="/preview/mobile.png"
                alt="Mobile preview"
                className="max-w-full max-h-full object-contain rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}