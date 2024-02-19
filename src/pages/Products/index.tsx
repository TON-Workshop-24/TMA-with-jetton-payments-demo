import data from '../../assets/products.json';
import { Box } from '../../components/Box';
import { Product } from '../../components/Product';

export const Products = () => {
  return (
    <Box display="flex" flexDirection="column" gap="24px" width="100%" p="16px">
      {data.products.map((product, index) => (
        <Product product={product} key={index} />
      ))}
    </Box>
  )
}
