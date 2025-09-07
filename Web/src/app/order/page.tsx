// src/app/order/page.tsx
import Order from '@/Components/Order';

interface OrderPageProps {
  searchParams: Promise<{ email?: string }>; // Update to Promise type
}

const OrderPage = async ({ searchParams }: OrderPageProps) => {
  const resolvedParams = await searchParams; // Await the promise
  const email = resolvedParams.email;

  return (
    <div>
      {email ? (
        <Order email={email} />
      ) : (
        <p>Email parameter is missing.</p>
      )}
    </div>
  );
};

export default OrderPage;
