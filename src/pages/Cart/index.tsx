import { Box } from '../../components/Box';
import { Product } from '../../components/Product';
import data from '../../assets/products.json';
import { css } from '@emotion/react';

const styles = {
  header: css`
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 16px;
  `
}

export const Cart = () => {
  return (
    <Box
      width="100%"
      px="16px"
      pt="16px"
    >
      <header css={styles.header}>Order ID: 123456789</header>

      <Box display="flex" flexDirection="column" width="100%" gap="8px">
        {data.products.map((product, index) => (
          <Product product={product} quantity={9} size="dense" key={index} />
        ))}
      </Box>
    </Box>
  )
}
