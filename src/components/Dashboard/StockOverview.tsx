
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BarChart3, PieChart, TrendingUp } from "lucide-react";
import { items } from "@/utils/dummyData";
import { useEffect, useState } from "react";
import { Item } from "@/utils/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart as RechartPieChart, Cell } from "recharts";

const LOCAL_STORAGE_KEY = 'inventory-items';

const StockOverview = () => {
  const [stockItems, setStockItems] = useState<Item[]>([]);
  
  useEffect(() => {
    const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedItems) {
      try {
        setStockItems(JSON.parse(storedItems));
      } catch (error) {
        console.error('Erro ao carregar itens do localStorage:', error);
        setStockItems(items);
      }
    } else {
      setStockItems(items);
    }
  }, []);

  const totalItems = stockItems.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = stockItems.filter(item => item.quantity < item.minQuantity);
  const lowStockPercentage = stockItems.length > 0 ? (lowStockItems.length / stockItems.length) * 100 : 0;
  const totalValue = stockItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  
  // Dados para o gráfico de valor por categoria
  const categoryData = [
    { name: "Alimentos", value: stockItems.filter(item => item.name.includes("Arroz") || item.name.includes("Feijão")).reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) },
    
    { name: "Limpeza", value: stockItems.filter(item => item.name.includes("Detergente") || item.name.includes("Sabão")).reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) },
    { name: "Outros", value: stockItems.filter(item => !item.name.includes("Arroz") && !item.name.includes("Feijão") && !item.name.includes("Sabonete") && !item.name.includes("Detergente") && !item.name.includes("Sabão")).reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) }
  
  ];

  // Cores para o gráfico de pizza
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      {lowStockItems.length > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Alerta de Estoque Baixo</AlertTitle>
          <AlertDescription>
            {lowStockItems.length} {lowStockItems.length === 1 ? 'item está' : 'itens estão'} com estoque abaixo do mínimo.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Em {stockItems.length} tipos diferentes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Itens em Baixa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{lowStockItems.length}</div>
            <div className="w-full bg-muted h-2 mt-2 rounded-full overflow-hidden">
              <div 
                className="bg-warning h-full rounded-full" 
                style={{ width: `${lowStockPercentage}%` }} 
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {lowStockPercentage.toFixed(0)}% do estoque em baixa
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Valor do estoque atual
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Críticos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lowStockItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span className="text-sm">{item.name}</span>
                <span className="text-sm font-medium low-stock">{item.quantity} {item.unit}</span>
              </div>
            ))}
            {lowStockItems.length > 3 && (
              <p className="text-xs text-muted-foreground">
                +{lowStockItems.length - 3} itens críticos
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Distribuição de Valor por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                  <Legend />
                </RechartPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Itens mais valiosos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stockItems
                .sort((a, b) => (b.quantity * b.unitPrice) - (a.quantity * a.unitPrice))
                .slice(0, 5)
                .map((item, idx) => (
                  <div key={item.id} className="flex items-center">
                    <div className="mr-4 font-bold text-muted-foreground">{idx + 1}</div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} {item.unit} × R$ {item.unitPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="font-semibold">
                      R$ {(item.quantity * item.unitPrice).toFixed(2)}
                    </div>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockOverview;
