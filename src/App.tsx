import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedLayout from "./components/Layout/ProtectedLayout";
import ItemsList from "./components/Items/ItemsList";
import BasketModelsList from "./components/Baskets/BasketModelsList";
import FinancialSummary from "./components/Finance/FinancialSummary";
import { ThemeProvider } from 'next-themes';



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/items" element={<ItemsList />} />
              <Route path="/baskets" element={<BasketModelsList />} />
              <Route path="/models" element={<BasketModelsList />} />
              <Route path="/finance" element={<FinancialSummary />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
