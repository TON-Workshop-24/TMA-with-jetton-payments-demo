import { Box } from '../../components/Box';
import { Product } from '../../components/Product';
import { css } from '@emotion/react';
import { Tabs } from '../../components/Tabs';
import { RadioGroup } from '../../components/RadioGroup';
import { useCart } from '../../app/CartContext';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { Routes } from '../../constant';
import { useBackButton, useMainButton } from '../../hooks';

const styles = {
  header: css`
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 16px;
  `
}

export const Checkout = () => {
  const navigate = useNavigate();

  const { cart } = useCart();

  const handleClick = useCallback(() => {
    navigate(Routes.ORDER_HISTORY)
  }, [navigate])

  useBackButton();
  useMainButton({ text: 'Connect Ton Wallet', onClick: handleClick });

  return (
    <Box
      width="100%"
      px="16px"
      pt="16px"
    >
      <header css={styles.header}>Order ID: 123456789</header>

      <Box display="flex" flexDirection="column" width="100%" gap="8px">
        {Object.values(cart).map((product, index) => (
          <Product product={product} size="dense" key={index} />
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
