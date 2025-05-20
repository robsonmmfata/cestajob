
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, FileText } from "lucide-react";
import { FinancialTransaction } from "@/utils/types";

// Mock de dados de transações
const mockTransactions: FinancialTransaction[] = [
  {
    id: "t1",
    date: "2023-05-10",
    itemId: "item1",
    quantity: 5,
    totalPrice: 125.50,
    description: "Compra de Arroz"
  },
  {
    id: "t2",
    date: "2023-05-08",
    itemId: "item2",
    quantity: 10,
    totalPrice: 45.90,
    description: "Compra de Feijão"
  },
  {
    id: "t3",
    date: "2023-05-05",
    itemId: "item3",
    quantity: 3,
    totalPrice: 18.75,
    description: "Compra de Sabonete"
  },
  {
    id: "t4",
    date: "2023-05-03",
    itemId: "item4",
    quantity: 2,
    totalPrice: 12.80,
    description: "Compra de Detergente"
  },
  {
    id: "t5",
    date: "2023-05-01",
    itemId: "item5",
    quantity: 8,
    totalPrice: 32.00,
    description: "Compra de Sabão em pó"
  }
];

const TransactionHistory = () => {
  const [transactions] = useState<FinancialTransaction[]>(mockTransactions);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleGenerateReport = () => {
    // Função para gerar relatório de transações (simulado)
    alert("Relatório gerado com sucesso! Esta funcionalidade seria integrada a uma exportação real de PDF ou Excel.");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Histórico de Transações</CardTitle>
        <Button variant="outline" size="sm" onClick={handleGenerateReport}>
          <FileText className="mr-2 h-4 w-4" />
          Gerar Relatório
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map(transaction => (
            <div key={transaction.id} className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <ArrowDown className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">R$ {transaction.totalPrice.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{transaction.quantity} unidades</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
