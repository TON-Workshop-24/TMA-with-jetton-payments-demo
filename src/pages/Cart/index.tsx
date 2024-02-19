import { Box } from '../../components/Box';
import { Product } from '../../components/Product';
import data from '../../assets/products.json';
import { css } from '@emotion/react';
import { Tabs } from '../../components/Tabs';
import { RadioGroup } from '../../components/RadioGroup';

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

      <Box mt="24px" mb="16px" width="100%">
        <Tabs
          activeTab="1"
          tabs={[
            { id: '1', name: 'Pickup' },
            { id: '2', name: 'Delivery' },
          ]}
        />
      </Box>

      <RadioGroup
        name="address"
        options={[
          { id: 'address1', name: 'Praça Marquês de Pombal 12 A, 1250-162 Lisboa' },
          { id: 'address2', name: 'Momma Reenstiernas Palats, Wollmar Yxkullsgatan 23, 118 50 Stockholm' }
        ]}
      />
    </Box>
  )
}
