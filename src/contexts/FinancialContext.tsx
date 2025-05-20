import React, { createContext, useContext, useState, ReactNode } from 'react';
   import 'bootstrap/dist/css/bootstrap.min.css';
export interface FinancialTransaction {
  id: string;
  date: string;
  itemId: string;
  quantity: number;
  totalPrice: number;
  description?: string;
}

interface FinancialContextType {
  transactions: FinancialTransaction[];
  addTransaction: (transaction: Omit<FinancialTransaction, 'id'>) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);

  const addTransaction = (transaction: Omit<FinancialTransaction, 'id'>) => {
    const newTransaction: FinancialTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  return (
    <FinancialContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = (): FinancialContextType => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
