
import StockOverview from '@/components/Dashboard/StockOverview';
import BasketCalculator from '@/components/Dashboard/BasketCalculator';
import TransactionHistory from '@/components/Dashboard/TransactionHistory';

const Index = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <StockOverview />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BasketCalculator />
        <TransactionHistory />
      </div>
    </div>
  );
};

export default Index;
