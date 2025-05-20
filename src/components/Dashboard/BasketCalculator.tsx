
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BasketModel, Item } from '@/utils/types';
import { basketModels, items } from '@/utils/dummyData';

const BasketCalculator = () => {
  const [selectedBasketId, setSelectedBasketId] = useState<string>(basketModels[0]?.id || '');

  const selectedBasket = basketModels.find(b => b.id === selectedBasketId);
  const possibleBaskets = calculatePossibleBaskets(selectedBasket);

  function calculatePossibleBaskets(basketModel: BasketModel | undefined): number {
    if (!basketModel) return 0;
    
    // Calculate how many complete baskets we can make based on current inventory
    const possibleCounts = basketModel.items.map(basketItem => {
      const item = items.find(i => i.id === basketItem.itemId);
      if (!item) return 0;
      
      return Math.floor(item.quantity / basketItem.quantity);
    });
    
    // The number of possible baskets is limited by the item with the lowest availability
    return Math.min(...possibleCounts);
  }

  const limitingItems = selectedBasket ? findLimitingItems(selectedBasket, possibleBaskets) : [];

  function findLimitingItems(basketModel: BasketModel, possibleBaskets: number): Item[] {
    const limitingItems: Item[] = [];
    
    basketModel.items.forEach(basketItem => {
      const item = items.find(i => i.id === basketItem.itemId);
      if (!item) return;
      
      const itemPossibleBaskets = Math.floor(item.quantity / basketItem.quantity);
      
      // If this item is limiting or close to limiting (within 10%)
      if (itemPossibleBaskets <= possibleBaskets * 1.1) {
        limitingItems.push(item);
      }
    });
    
    // Sort by the most limiting first
    return limitingItems.slice(0, 3);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculadora de Cestas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="basket-model" className="text-sm font-medium">
              Modelo de Cesta
            </label>
            <Select 
              value={selectedBasketId} 
              onValueChange={setSelectedBasketId}
            >
              <SelectTrigger id="basket-model">
                <SelectValue placeholder="Selecione um modelo" />
              </SelectTrigger>
              <SelectContent>
                {basketModels.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-6 bg-muted rounded-md flex items-center justify-center flex-col">
            <div className="text-3xl font-bold">{possibleBaskets}</div>
            <div className="text-sm text-muted-foreground">
              cestas possíveis de montar
            </div>
          </div>

          {limitingItems.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Itens limitantes:</h4>
              <div className="space-y-2">
                {limitingItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className={item.quantity < item.minQuantity ? "low-stock" : ""}>
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BasketCalculator;
