import { Box } from '../../components/Box';
import { styles } from './OrderHistory.styles';

type Order = {
  id: string;
  status: 'pending' | 'fulfilled';
}

const orders: Order[] = [
  { id: '12345', status: 'pending' },
  { id: '54321', status: 'fulfilled' },
]

const statusMap = {
  pending: 'Awaiting payment',
  fulfilled: 'Ready for pickup'
}

export const OrderHistory = () => (
  <Box px="16px">
    <header css={styles.header}>Order history</header>

    <Box display="flex" flexDirection="column" gap="8px" mt="16px">
      {orders.map((order) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          radius="8px"
          background="#f2f2f2"
          width="100%"
          py="8px"
          px="16px"
          key={order.id}
        >
          <h3 css={styles.title}>ID: {order.id}</h3>

          <div css={styles.status}>
            <img src={`/images/order-${order.status}.svg`} alt={order.status} css={styles.statusImage} />

            <span>
              {statusMap[order.status]}
            </span>
          </div>
        </Box>
      ))}
    </Box>
  </Box>
)
