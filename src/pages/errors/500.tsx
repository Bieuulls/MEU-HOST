import { useNavigate } from 'react-router-dom';

export function ServerError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-9xl font-bold text-gray-900 mb-4">500</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! Ocorreu um erro no servidor.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Tentar novamente
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ir para Home
          </button>
        </div>
      </div>
    </div>
  );
}
