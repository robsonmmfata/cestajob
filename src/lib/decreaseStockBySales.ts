import { FinancialTransaction } from '../contexts/FinancialContext';
import { Item } from '../utils/types';
   import 'bootstrap/dist/css/bootstrap.min.css';
export function decreaseStockBySales(items: Item[], transactions: FinancialTransaction[]): Item[] {
  const updatedItems = items.map(item => {
    // Calculate total quantity sold for this item
    const totalSold = transactions
      .filter(tx => tx.itemId === item.id)
      .reduce((sum, tx) => sum + tx.quantity, 0);

    // Decrease item quantity by total sold, not below zero
    const newQuantity = Math.max(0, item.quantity - totalSold);

    return {
      ...item,
      quantity: newQuantity
    };
  });

  return updatedItems;
}
