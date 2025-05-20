import { useState } from 'react';
import { Book, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { basketModels as initialBasketModels, items } from '../../utils/dummyData';
import { BasketModel, BasketItem } from '../../utils/types';
import { toast } from 'sonner';

const BasketModelsList = () => {
  const [basketModels, setBasketModels] = useState<BasketModel[]>(initialBasketModels);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newModel, setNewModel] = useState<Partial<BasketModel>>({
    name: '',
    items: []
  });
  const [newItem, setNewItem] = useState<{itemId: string, quantity: number}>({
    itemId: '',
    quantity: 1
  });

  const handleAddItemToModel = () => {
    if (!newItem.itemId || !newItem.quantity || newItem.quantity <= 0) {
      toast.error("Selecione um item e a quantidade");
      return;
    }

    // Check if item is already in the model
    const existingItemIndex = newModel.items?.findIndex(item => item.itemId === newItem.itemId);
    
    if (existingItemIndex !== undefined && existingItemIndex >= 0 && newModel.items) {
      // Update existing item quantity
      const updatedItems = [...newModel.items];
      updatedItems[existingItemIndex].quantity += newItem.quantity;
      setNewModel({...newModel, items: updatedItems});
    } else {
      // Add new item
      setNewModel({
        ...newModel,
        items: [...(newModel.items || []), newItem]
      });
    }
    
    setNewItem({
      itemId: '',
      quantity: 1
    });
  };

  const handleRemoveItemFromModel = (itemId: string) => {
    if (!newModel.items) return;
    
    setNewModel({
      ...newModel,
      items: newModel.items.filter(item => item.itemId !== itemId)
    });
  };

  const handleSaveModel = () => {
    if (!newModel.name || !newModel.items || newModel.items.length === 0) {
      toast.error("Preencha o nome e adicione pelo menos um item");
      return;
    }

    const newModelComplete: BasketModel = {
      ...newModel as Omit<BasketModel, 'id'>,
      id: Date.now().toString()
    };

    setBasketModels([...basketModels, newModelComplete]);
    setNewModel({
      name: '',
      items: []
    });
    setIsDialogOpen(false);
    toast.success(`Modelo ${newModelComplete.name} criado com sucesso`);
  };

  const calculateModelCost = (model: BasketModel): number => {
    return model.items.reduce((total, basketItem) => {
      const item = items.find(i => i.id === basketItem.itemId);
      if (!item) return total;
      return total + (item.unitPrice * basketItem.quantity);
    }, 0);
  };

  const getItemName = (itemId: string): string => {
    const item = items.find(i => i.id === itemId);
    return item ? item.name : "Item desconhecido";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Modelos de Cestas</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Modelo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo Modelo de Cesta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Modelo</Label>
                <Input 
                  id="name" 
                  value={newModel.name} 
                  onChange={(e) => setNewModel({...newModel, name: e.target.value})} 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Adicionar Itens</Label>
                <div className="flex gap-2">
                  <Select 
                    value={newItem.itemId} 
                    onValueChange={(value) => setNewItem({...newItem, itemId: value})}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecione um item" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map(item => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} ({item.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input 
                    type="number" 
                    min="1"
                    className="w-20"
                    value={newItem.quantity} 
                    onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})} 
                  />
                  
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={handleAddItemToModel}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {newModel.items && newModel.items.length > 0 && (
                <div className="border rounded-md p-3">
                  <h4 className="text-sm font-medium mb-2">Itens do Modelo:</h4>
                  <div className="space-y-2">
                    {newModel.items.map(item => (
                      <div key={item.itemId} className="flex justify-between items-center text-sm">
                        <span>{getItemName(item.itemId)}</span>
                        <div className="flex items-center gap-2">
                          <span>{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => handleRemoveItemFromModel(item.itemId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleSaveModel} 
                className="w-full"
              >
                Salvar Modelo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {basketModels.map(model => (
          <Card key={model.id} className="fade-in">
            <CardHeader>
              <CardTitle>{model.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  {model.items.map(basketItem => {
                    const item = items.find(i => i.id === basketItem.itemId);
                    return (
                      <div key={`${model.id}-${basketItem.itemId}`} className="flex justify-between text-sm">
                        <span>{item ? item.name : "Item desconhecido"}</span>
                        <span>
                          {basketItem.quantity} {item?.unit || "un"}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium">Custo por Cesta:</span>
                    <span className="font-bold">
                      R$ {calculateModelCost(model).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {basketModels.length === 0 && (
          <div className="col-span-full flex justify-center items-center p-8 bg-muted rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <Book size={24} className="text-muted-foreground" />
              <p className="text-muted-foreground">Nenhum modelo de cesta encontrado</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasketModelsList;
