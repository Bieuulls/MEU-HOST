-- Adiciona novas colunas à tabela products
ALTER TABLE products
ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS discount numeric(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating numeric(3,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS reviews_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS specifications jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS variants jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Cria índices para melhorar a performance das consultas
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_discount ON products(discount) WHERE discount > 0;
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);

-- Cria uma função para calcular a média das avaliações
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET rating = (
    SELECT AVG(rating)
    FROM product_reviews
    WHERE product_id = NEW.product_id
  ),
  reviews_count = (
    SELECT COUNT(*)
    FROM product_reviews
    WHERE product_id = NEW.product_id
  )
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Cria uma trigger para atualizar a média das avaliações
DROP TRIGGER IF EXISTS update_product_rating_trigger ON product_reviews;
CREATE TRIGGER update_product_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON product_reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();
