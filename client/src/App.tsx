import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Exchange from "@/pages/Exchange";
import Swap from "@/pages/Swap";
import Admin from "@/pages/Admin";
import Verify from "@/pages/Verify";
import BuyCryptoWithPaypal from "@/pages/BuyCryptoWithPaypal";
import CardToCrypto from "@/pages/CardToCrypto";
import CryptoSwapPage from "@/pages/CryptoSwapPage";
import NoKycCrypto from "@/pages/NoKycCrypto";
import SupportedCoins from "@/pages/SupportedCoins";
import Fees from "@/pages/Fees";
import Faq from "@/pages/Faq";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/exchange" component={Exchange} />
      <Route path="/swap" component={Swap} />
      <Route path="/admin" component={Admin} />
      <Route path="/verify" component={Verify} />
      <Route path="/buy-crypto-with-paypal" component={BuyCryptoWithPaypal} />
      <Route path="/card-to-crypto" component={CardToCrypto} />
      <Route path="/crypto-swap" component={CryptoSwapPage} />
      <Route path="/no-kyc-crypto" component={NoKycCrypto} />
      <Route path="/supported-coins" component={SupportedCoins} />
      <Route path="/fees" component={Fees} />
      <Route path="/faq" component={Faq} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
