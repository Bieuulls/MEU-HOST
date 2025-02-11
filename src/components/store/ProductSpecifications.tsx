interface ProductSpecificationsProps {
  specifications: Record<string, string>;
}

export function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
  if (!specifications || Object.keys(specifications).length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Especificações</h3>
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="divide-y divide-gray-200">
            {Object.entries(specifications).map(([key, value]) => (
              <tr key={key}>
                <td className="px-4 py-3 text-sm text-gray-500 bg-gray-50 w-1/3">
                  {key}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
