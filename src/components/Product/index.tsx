import { styles } from './Product.styles';
import { useCallback } from 'react';
import { Box } from '../Box';

export type ProductEntity = {
  id: number;
  shortName: string;
  description: string;
  price: number;
  image: string;
}

type Props = {
  /**
   * Product entity
   * */
  product: ProductEntity;
  /**
   * Invokes when the product is added to cart
   * */
  onAdd?: (id: number) => void;
  /**
   * Invokes when the product is removed from cart
   * */
  onRemove?: (id: number) => void;
  /**
   * If product is in cart, then the quantity exists.
   * Min - 1, max - 9
   * */
  quantity?: number;
  /**
   * Product appearance variations.
   * Dense - oneline, default - full size
   * */
  size?: 'dense' | 'default';
}

export const Product = ({ product, quantity, onAdd, onRemove, size = 'default' }: Props) => {
  const handleAdd = useCallback(() => {
    if (onAdd) {
      onAdd(product.id);
    }
  }, [onAdd])

  const handleRemove = useCallback(() => {
    if (onRemove) {
      onRemove(product.id);
    }
  }, [onRemove])

  if (size === 'dense') {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        background="#f2f2f2"
        px="16px"
        py="8px"
        radius="8px"
      >
        <Box display="flex" alignItems="center" gap="8px" width="40%">
          <h3 css={styles.title}>{product.shortName}</h3>

          <span css={styles.price}>${product.price}</span>
        </Box>

        <Box display="flex" gap="4px">
          <button css={styles.quantityButton} disabled={quantity === 9}>+</button>

          <div css={styles.quantity(size)}>{quantity}</div>

          <button css={styles.quantityButton}>-</button>
        </Box>


        {quantity && <span css={styles.price}>${quantity * product.price}</span>}
      </Box>
    )
  }

  return (
    <div css={styles.container}>
      <div css={styles.product}>
        <img src={product.image} alt={product.shortName} css={styles.image} />

        <div css={styles.content}>
          <h3 css={styles.title}>{product.shortName}</h3>

          <p css={styles.description}>{product.description}</p>

          <p>
            Price{' '}
            <span css={styles.price}>${product.price}</span>
          </p>
        </div>
      </div>

      {!quantity && (
        <button css={styles.button} onClick={handleAdd}>Add to cart</button>
      )}

      {quantity && (
        <div css={styles.buttonGroup}>
          <button css={styles.quantityButton} disabled={quantity === 9} onClick={handleAdd}>+</button>

          <div css={styles.quantity()}>
            {quantity}
          </div>

          <button css={styles.quantityButton} onClick={handleRemove}>-</button>
        </div>
      )}
    </div>
  )
}
