
import { Item, BasketModel, FinancialTransaction, BasketInventory } from './types';

export const items: Item[] = [
  {
    id: "1",
    name: "Arroz",
    quantity: 50,
    minQuantity: 20,
    unit: "kg",
    unitPrice: 5.50,
    lastPurchaseDate: "2023-04-15"
  },
  {
    id: "2",
    name: "Feijão",
    quantity: 30,
    minQuantity: 15,
    unit: "kg",
    unitPrice: 7.25,
    lastPurchaseDate: "2023-04-20"
  },
  {
    id: "3",
    name: "Açúcar",
    quantity: 25,
    minQuantity: 10,
    unit: "kg",
    unitPrice: 4.75,
    lastPurchaseDate: "2023-04-10"
  },
  {
    id: "4",
    name: "Café",
    quantity: 8,
    minQuantity: 10,
    unit: "kg",
    unitPrice: 25.00,
    lastPurchaseDate: "2023-03-30"
  },
  {
    id: "5",
    name: "Óleo",
    quantity: 40,
    minQuantity: 20,
    unit: "un",
    unitPrice: 9.90,
    lastPurchaseDate: "2023-04-18"
  },
  {
    id: "6",
    name: "Sal",
    quantity: 30,
    minQuantity: 15,
    unit: "kg",
    unitPrice: 3.50,
    lastPurchaseDate: "2023-03-25"
  },
  {
    id: "7",
    name: "Macarrão",
    quantity: 45,
    minQuantity: 25,
    unit: "un",
    unitPrice: 4.20,
    lastPurchaseDate: "2023-04-12"
  },
  {
    id: "8",
    name: "Farinha de Trigo",
    quantity: 35,
    minQuantity: 20,
    unit: "kg",
    unitPrice: 6.80,
    lastPurchaseDate: "2023-04-05"
  }
];

export const basketModels: BasketModel[] = [
  {
    id: "1",
    name: "Cesta Premium",
    items: [
      { itemId: "1", quantity: 5 },
      { itemId: "2", quantity: 3 },
      { itemId: "3", quantity: 4 },
      { itemId: "4", quantity: 2 },
      { itemId: "5", quantity: 3 },
      { itemId: "6", quantity: 1 },
      { itemId: "7", quantity: 4 },
      { itemId: "8", quantity: 2 }
    ]
  },
  {
    id: "2",
    name: "Cesta Gold",
    items: [
      { itemId: "1", quantity: 4 },
      { itemId: "2", quantity: 2 },
      { itemId: "3", quantity: 3 },
      { itemId: "4", quantity: 1 },
      { itemId: "5", quantity: 2 },
      { itemId: "6", quantity: 1 },
      { itemId: "7", quantity: 3 },
      { itemId: "8", quantity: 2 }
    ]
  },
  {
    id: "3",
    name: "Cesta Prata",
    items: [
      { itemId: "1", quantity: 3 },
      { itemId: "2", quantity: 2 },
      { itemId: "3", quantity: 2 },
      { itemId: "4", quantity: 1 },
      { itemId: "5", quantity: 2 },
      { itemId: "6", quantity: 1 },
      { itemId: "7", quantity: 2 },
      { itemId: "8", quantity: 1 }
    ]
  },
  {
    id: "4",
    name: "Cesta Bronze",
    items: [
      { itemId: "1", quantity: 2 },
      { itemId: "2", quantity: 1 },
      { itemId: "3", quantity: 1 },
      { itemId: "5", quantity: 1 },
      { itemId: "7", quantity: 2 }
    ]
  }
];

export const financialTransactions: FinancialTransaction[] = [
  {
    id: "1",
    date: "2023-04-15",
    itemId: "1",
    quantity: 100,
    totalPrice: 550,
    description: "Compra mensal de arroz"
  },
  {
    id: "2",
    date: "2023-04-20",
    itemId: "2",
    quantity: 50,
    totalPrice: 362.50,
    description: "Compra mensal de feijão"
  },
  {
    id: "3",
    date: "2023-04-10",
    itemId: "3",
    quantity: 40,
    totalPrice: 190,
    description: "Compra mensal de açúcar"
  },
  {
    id: "4",
    date: "2023-03-30",
    itemId: "4",
    quantity: 20,
    totalPrice: 500,
    description: "Compra mensal de café"
  }
];

export const basketInventory: BasketInventory[] = [
  {
    id: "1",
    basketModelId: "1",
    quantity: 5
  },
  {
    id: "2",
    basketModelId: "2",
    quantity: 8
  },
  {
    id: "3",
    basketModelId: "3",
    quantity: 12
  },
  {
    id: "4",
    basketModelId: "4",
    quantity: 15
  }
];
