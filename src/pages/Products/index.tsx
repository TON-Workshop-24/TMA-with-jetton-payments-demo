import data from '../../assets/products.json';
import { Box } from '../../components/Box';
import { Product } from '../../components/Product';
import { useCart } from '../../app/CartContext';
import { useMainButton } from '../../hooks';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../../constant';

export const Products = () => {
  const navigate = useNavigate();

  const { cart, addProduct, removeProduct } = useCart();

  const handleClick = useCallback(() => {
    if (Object.keys(cart).length === 0) {
      return;
    }

    navigate(Routes.CHECKOUT);
  }, [cart, navigate])

  useMainButton({ text: 'View order', onClick: handleClick });

  return (
    <Box display="flex" flexDirection="column" gap="24px" width="100%" p="16px">
      {data.products.map((product, index) => (
        <Product
          product={product.id in cart ? cart[product.id] : { ...product, quantity: 0 }}
          onAdd={addProduct}
          onRemove={removeProduct}
          key={index}
        />
      ))}
    </Box>
  )
}
