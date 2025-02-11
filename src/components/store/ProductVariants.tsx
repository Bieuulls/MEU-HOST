import { useState } from 'react';
import { ProductVariant } from '../../types/database';

interface ProductVariantsProps {
  variants: ProductVariant[];
  onVariantSelect: (variant: ProductVariant) => void;
}

export function ProductVariants({ 
  variants, 
  onVariantSelect,
}: ProductVariantsProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  if (!variants || variants.length === 0) {
    return null;
  }

  // Obtém todos os tipos de atributos únicos
  const attributeTypes = Array.from(
    new Set(
      variants.flatMap(variant => 
        Object.keys(variant.attributes)
      )
    )
  );

  // Obtém todos os valores únicos para cada tipo de atributo
  const attributeValues: Record<string, string[]> = {};
  attributeTypes.forEach(type => {
    attributeValues[type] = Array.from(
      new Set(
        variants
          .map(variant => variant.attributes[type])
          .filter(Boolean)
      )
    );
  });

  // Encontra a variante que corresponde aos atributos selecionados
  const findMatchingVariant = () => {
    return variants.find(variant => {
      return Object.entries(selectedAttributes).every(
        ([key, value]) => variant.attributes[key] === value
      );
    });
  };

  // Atualiza os atributos selecionados e notifica o componente pai
  const handleAttributeSelect = (type: string, value: string) => {
    const newAttributes = {
      ...selectedAttributes,
      [type]: value
    };
    setSelectedAttributes(newAttributes);

    // Verifica se todos os atributos necessários foram selecionados
    const allAttributesSelected = attributeTypes.every(
      type => newAttributes[type]
    );

    if (allAttributesSelected) {
      const matchingVariant = findMatchingVariant();
      if (matchingVariant) {
        onVariantSelect(matchingVariant);
      }
    }
  };

  return (
    <div className="mt-6">
      {attributeTypes.map(type => (
        <div key={type} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {type}
          </label>
          <div className="flex flex-wrap gap-2">
            {attributeValues[type].map(value => {
              const isSelected = selectedAttributes[type] === value;
              
              return (
                <button
                  key={value}
                  onClick={() => handleAttributeSelect(type, value)}
                  className={`
                    px-3 py-1 rounded-md text-sm font-medium
                    ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }
                    transition-colors duration-200
                  `}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
