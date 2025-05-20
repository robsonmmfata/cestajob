import { useState, useEffect } from 'react';
import { Package, AlertCircle, Plus, Search, Edit, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { items as initialItems } from '@/utils/dummyData';
import { Item } from '@/utils/types';
import { toast } from 'sonner';

const LOCAL_STORAGE_KEY = 'inventory-items';

const ItemsList = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState<Partial<Item>>({
    name: '',
    quantity: 0,
    minQuantity: 0,
    unit: 'un',
    unitPrice: 0
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);

  // Carregar itens do localStorage ao iniciar
  useEffect(() => {
    const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedItems) {
      try {
        setItems(JSON.parse(storedItems));
      } catch (error) {
        console.error('Erro ao carregar itens do localStorage:', error);
        setItems(initialItems);
      }
    } else {
      setItems(initialItems);
    }
  }, []);

  // Salvar itens no localStorage sempre que houver mudanças
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetNewItem = () => {
    setNewItem({
      name: '',
      quantity: 0,
      minQuantity: 0,
      unit: 'un',
      unitPrice: 0
    });
  };

  const handleAddItem = () => {
    if (!newItem.name || newItem.quantity === undefined || newItem.minQuantity === undefined || !newItem.unit || newItem.unitPrice === undefined) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    const newItemComplete: Item = {
      ...newItem as Omit<Item, 'id' | 'lastPurchaseDate'>,
      id: Date.now().toString(),
      lastPurchaseDate: new Date().toISOString().split('T')[0]
    };

    const updatedItems = [...items, newItemComplete];
    setItems(updatedItems);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedItems));
    
    resetNewItem();
    setIsAddDialogOpen(false);
    toast.success(`${newItemComplete.name} adicionado ao estoque`);
  };

  const handleEditClick = (item: Item) => {
    setNewItem({...item});
    setCurrentItemId(item.id);
    setIsEditDialogOpen(true);
  };

  const handleEditItem = () => {
    if (!newItem.name || newItem.quantity === undefined || newItem.minQuantity === undefined || !newItem.unit || newItem.unitPrice === undefined) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    const updatedItems = items.map(item => 
      item.id === currentItemId ? {...item, ...newItem} : item
    );
    
    setItems(updatedItems);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedItems));
    
    resetNewItem();
    setCurrentItemId(null);
    setIsEditDialogOpen(false);
    toast.success("Item atualizado com sucesso");
  };

  const handleDeleteClick = (id: string) => {
    setCurrentItemId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteItem = () => {
    const updatedItems = items.filter(item => item.id !== currentItemId);
    setItems(updatedItems);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedItems));
    
    setCurrentItemId(null);
    setIsDeleteDialogOpen(false);
    toast.success("Item removido com sucesso");
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setItems(updatedItems);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedItems));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Controle de Itens</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Item</Label>
                <Input 
                  id="name" 
                  value={newItem.name} 
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    min="0"
                    value={newItem.quantity} 
                    onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="minQuantity">Quantidade Mínima</Label>
                  <Input 
                    id="minQuantity" 
                    type="number" 
                    min="0"
                    value={newItem.minQuantity} 
                    onChange={(e) => setNewItem({...newItem, minQuantity: Number(e.target.value)})} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="unit">Unidade</Label>
                  <Input 
                    id="unit" 
                    value={newItem.unit} 
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unitPrice">Preço Unitário (R$)</Label>
                  <Input 
                    id="unitPrice" 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={newItem.unitPrice} 
                    onChange={(e) => setNewItem({...newItem, unitPrice: Number(e.target.value)})} 
                  />
                </div>
              </div>
              <Button onClick={handleAddItem} className="w-full">Adicionar Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar item..." 
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map(item => (
          <Card key={item.id} className="fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{item.name}</span>
                {item.quantity < item.minQuantity && (
                  <AlertCircle size={18} className="text-warning" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Quantidade:</span>
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-6 w-6 rounded-r-none"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span 
                      className={`px-3 py-1 border-y ${
                        item.quantity < item.minQuantity 
                          ? "low-stock" 
                          : item.quantity === 0 
                          ? "out-of-stock"
                          : ""
                      }`}
                    >
                      {item.quantity}
                    </span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-6 w-6 rounded-l-none"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Unidade:</span>
                  <span>{item.unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mínimo:</span>
                  <span>{item.minQuantity} {item.unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Preço Unitário:</span>
                  <span>R$ {item.unitPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Valor Total:</span>
                  <span className="font-semibold">R$ {(item.quantity * item.unitPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-end space-x-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditClick(item)}
                  >
                    <Edit size={16} className="mr-1" /> Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteClick(item.id)}
                  >
                    <Trash size={16} className="mr-1" /> Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full flex justify-center items-center p-8 bg-muted rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <Package size={24} className="text-muted-foreground" />
              <p className="text-muted-foreground">Nenhum item encontrado</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nome do Item</Label>
              <Input 
                id="edit-name" 
                value={newItem.name} 
                onChange={(e) => setNewItem({...newItem, name: e.target.value})} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-quantity">Quantidade</Label>
                <Input 
                  id="edit-quantity" 
                  type="number" 
                  min="0"
                  value={newItem.quantity} 
                  onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-minQuantity">Quantidade Mínima</Label>
                <Input 
                  id="edit-minQuantity" 
                  type="number" 
                  min="0"
                  value={newItem.minQuantity} 
                  onChange={(e) => setNewItem({...newItem, minQuantity: Number(e.target.value)})} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-unit">Unidade</Label>
                <Input 
                  id="edit-unit" 
                  value={newItem.unit} 
                  onChange={(e) => setNewItem({...newItem, unit: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-unitPrice">Preço Unitário (R$)</Label>
                <Input 
                  id="edit-unitPrice" 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={newItem.unitPrice} 
                  onChange={(e) => setNewItem({...newItem, unitPrice: Number(e.target.value)})} 
                />
              </div>
            </div>
            <Button onClick={handleEditItem} className="w-full">Salvar Alterações</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteItem}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemsList;
