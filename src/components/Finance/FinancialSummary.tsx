import { useState } from 'react';
import { DollarSign, Plus, Calendar, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { financialTransactions as initialTransactions, items } from '../../utils/dummyData';
import { FinancialTransaction } from '../../utils/types';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const FinancialSummary = () => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(initialTransactions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Partial<FinancialTransaction>>({
    date: new Date().toISOString().split('T')[0],
    itemId: '',
    quantity: 0,
    totalPrice: 0,
    description: ''
  });

  // State to track if editing and the transaction being edited
  const [isEditing, setIsEditing] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);

  const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.totalPrice, 0);

  // Calculate total spent today
  const today = new Date().toISOString().split('T')[0];
  const totalSpentToday = transactions
    .filter(transaction => transaction.date === today)
    .reduce((sum, transaction) => sum + transaction.totalPrice, 0);

  const handleAddTransaction = () => {
    if (!newTransaction.date || !newTransaction.itemId || !newTransaction.quantity || !newTransaction.totalPrice) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (isEditing && editingTransactionId) {
      // Update existing transaction
      setTransactions(transactions.map(t => 
        t.id === editingTransactionId ? { ...t, ...newTransaction, id: editingTransactionId } as FinancialTransaction : t
      ));
      toast.success("Transação atualizada com sucesso");
    } else {
      // Add new transaction
      const newTransactionComplete: FinancialTransaction = {
        ...newTransaction as Omit<FinancialTransaction, 'id'>,
        id: Date.now().toString()
      };
      setTransactions([...transactions, newTransactionComplete]);
      toast.success("Transação registrada com sucesso");
    }

    setNewTransaction({
      date: new Date().toISOString().split('T')[0],
      itemId: '',
      quantity: 0,
      totalPrice: 0,
      description: ''
    });
    setIsDialogOpen(false);
    setIsEditing(false);
    setEditingTransactionId(null);
  };

  // Prepare data for chart
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const chartData = transactions.reduce((acc: {name: string, total: number}[], transaction) => {
    const date = new Date(transaction.date);
    const monthName = monthNames[date.getMonth()];
    const existingMonth = acc.find(m => m.name === monthName);

    if (existingMonth) {
      existingMonth.total += transaction.totalPrice;
    } else {
      acc.push({ name: monthName, total: transaction.totalPrice });
    }

    return acc;
  }, []);

  // Sort by month order
  chartData.sort((a, b) =>
    monthNames.indexOf(a.name) - monthNames.indexOf(b.name)
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Controle Financeiro</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nova Entrada
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nova Entrada</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="item">Item</Label>
                <Select
                  value={newTransaction.itemId}
                  onValueChange={(value) => {
                    const item = items.find(i => i.id === value);
                    setNewTransaction({
                      ...newTransaction,
                      itemId: value,
                      totalPrice: item && newTransaction.quantity ? item.unitPrice * newTransaction.quantity : 0
                    });
                  }}
                >
                  <SelectTrigger id="item">
                    <SelectValue placeholder="Selecione um item" />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} - R$ {item.unitPrice.toFixed(2)} / {item.unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={newTransaction.quantity || ''}
                    onChange={(e) => {
                      const quantity = Number(e.target.value);
                      const item = items.find(i => i.id === newTransaction.itemId);
                      setNewTransaction({
                        ...newTransaction,
                        quantity,
                        totalPrice: item && quantity ? item.unitPrice * quantity : 0
                      });
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="totalPrice">Valor Total (R$)</Label>
                  <Input
                    id="totalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newTransaction.totalPrice || ''}
                    onChange={(e) => setNewTransaction({...newTransaction, totalPrice: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                />
              </div>

              <Button onClick={handleAddTransaction} className="w-full">
                Registrar Entrada
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 size={20} />
              Gastos Mensais
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Total']} />
                <Legend />
                <Line type="monotone" dataKey="total" name="Valor (R$)" stroke="#2c7a7b" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign size={20} />
              Resumo Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-md">
                <div className="text-sm text-muted-foreground">Total Gasto</div>
                <div className="text-2xl font-bold">R$ {totalSpent.toFixed(2)}</div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Últimas Transações</h4>
                <div className="space-y-3">
                  {transactions.slice(-3).reverse().map(transaction => {
                    const item = items.find(i => i.id === transaction.itemId);
                    return (
                      <div key={transaction.id} className="flex justify-between items-center text-sm border-b pb-2">
                        <div>
                          <div>{item?.name || "Item desconhecido"}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar size={12} />
                            {transaction.date}
                          </div>
                        </div>
                        <div className="font-medium">
                          R$ {transaction.totalPrice.toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign size={20} />
              Resumo Diário Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-md">
              <div className="text-sm text-muted-foreground">Total Gasto Hoje</div>
              <div className="text-2xl font-bold">R$ {totalSpentToday.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2">Data</th>
                  <th className="pb-2">Item</th>
                  <th className="pb-2">Quantidade</th>
                  <th className="pb-2">Valor Total</th>
                  <th className="pb-2">Descrição</th>
                </tr>
              </thead>
              <tbody>
      {transactions.map(transaction => {
        const item = items.find(i => i.id === transaction.itemId);
        return (
          <tr key={transaction.id} className="border-b">
            <td className="py-3">{transaction.date}</td>
            <td className="py-3">{item?.name || "Item desconhecido"}</td>
            <td className="py-3">{transaction.quantity} {item?.unit || "un"}</td>
            <td className="py-3">R$ {transaction.totalPrice.toFixed(2)}</td>
            <td className="py-3">{transaction.description}</td>
            <td className="py-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsEditing(true);
                  setEditingTransactionId(transaction.id);
                  setNewTransaction({
                    date: transaction.date,
                    itemId: transaction.itemId,
                    quantity: transaction.quantity,
                    totalPrice: transaction.totalPrice,
                    description: transaction.description
                  });
                  setIsDialogOpen(true);
                }}
              >
                Editar
              </Button>
            </td>
            <td className="py-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  if (confirm('Tem certeza que deseja deletar esta transação?')) {
                    setTransactions(transactions.filter(t => t.id !== transaction.id));
                    toast.success('Transação deletada com sucesso');
                  }
                }}
              >
                Deletar
              </Button>
            </td>
          </tr>
        );
      })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
    </div>
  );
};

export default FinancialSummary;
