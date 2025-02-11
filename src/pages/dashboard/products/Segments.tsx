import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { LoadingScreen } from '../../../components/feedback/Loading';

interface Segment {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export function Segments() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSegments();
  }, []);

  async function fetchSegments() {
    try {
      const { data, error } = await supabase
        .from('segments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSegments(data || []);
    } catch (error) {
      console.error('Error fetching segments:', error);
      setError('Erro ao carregar segmentos');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Tem certeza que deseja excluir este segmento?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('segments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSegments(segments.filter(segment => segment.id !== id));
    } catch (error) {
      console.error('Error deleting segment:', error);
      setError('Erro ao excluir segmento');
    }
  }

  if (loading) return <LoadingScreen />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Segmentos</h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Segmento
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {segments.map((segment) => (
            <li key={segment.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {segment.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {segment.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex space-x-2">
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600"
                      onClick={() => {/* TODO: Implementar edição */}}
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600"
                      onClick={() => handleDelete(segment.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Criado em {new Date(segment.created_at).toLocaleDateString()}
                </div>
              </div>
            </li>
          ))}
          {segments.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              Nenhum segmento encontrado
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
