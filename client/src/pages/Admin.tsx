import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  LayoutDashboard, 
  Activity, 
  Settings, 
  Coins, 
  Wallet,
  Plus,
  Edit3,
  Trash2,
  Star,
  Check,
  X,
  LogIn,
  Eye,
  EyeOff,
  RefreshCw,
  Lock
} from "lucide-react";
import { GlassCard, GlassButton, GlassInput, GlassPill, GlassModal, PrismaticBackground, GlassNavbar } from "@/components/glass";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Transaction, Crypto, Setting, PaymentMethod } from "@shared/schema";
import { CreditCard } from "lucide-react";

type Tab = "dashboard" | "transactions" | "cryptos" | "payments" | "settings";

const tabs = [
  { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions" as Tab, label: "Transactions", icon: Activity },
  { id: "cryptos" as Tab, label: "Cryptos", icon: Coins },
  { id: "payments" as Tab, label: "Payments", icon: CreditCard },
  { id: "settings" as Tab, label: "Settings", icon: Settings },
];

const animationOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

export default function Admin() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [animationIntensity, setAnimationIntensity] = useState("medium");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
  const [editingCrypto, setEditingCrypto] = useState<Crypto | null>(null);
  const [newCrypto, setNewCrypto] = useState({ name: "", symbol: "", walletAddress: "", icon: "" });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  const [newPayment, setNewPayment] = useState({ name: "", key: "", icon: "", description: "" });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    enabled: isAuthenticated,
  });

  const { data: cryptos = [], isLoading: cryptosLoading } = useQuery<Crypto[]>({
    queryKey: ["/api/cryptos"],
    enabled: isAuthenticated,
  });

  const { data: settings = [] } = useQuery<Setting[]>({
    queryKey: ["/api/settings"],
    enabled: isAuthenticated,
  });

  const { data: paymentMethods = [], isLoading: paymentsLoading } = useQuery<PaymentMethod[]>({
    queryKey: ["/api/payment-methods"],
    enabled: isAuthenticated,
  });

  const updateTransaction = useMutation({
    mutationFn: async (data: Partial<Transaction> & { id: string }) => {
      const res = await apiRequest("PATCH", `/api/transactions/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      setIsTransactionModalOpen(false);
      toast({ title: "Transaction updated successfully" });
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({ title: "Transaction deleted successfully" });
    },
  });

  const createCrypto = useMutation({
    mutationFn: async (data: typeof newCrypto) => {
      const res = await apiRequest("POST", "/api/cryptos", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cryptos"] });
      setIsCryptoModalOpen(false);
      setEditingCrypto(null);
      setNewCrypto({ name: "", symbol: "", walletAddress: "", icon: "" });
      toast({ title: "Crypto added successfully" });
    },
  });

  const updateCrypto = useMutation({
    mutationFn: async (data: Partial<Crypto> & { id: string }) => {
      const res = await apiRequest("PATCH", `/api/cryptos/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cryptos"] });
      setIsCryptoModalOpen(false);
      setEditingCrypto(null);
      toast({ title: "Crypto updated successfully" });
    },
  });

  const deleteCrypto = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/cryptos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cryptos"] });
      toast({ title: "Crypto deleted successfully" });
    },
  });

  const createPaymentMethod = useMutation({
    mutationFn: async (data: typeof newPayment) => {
      const res = await apiRequest("POST", "/api/payment-methods", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
      setIsPaymentModalOpen(false);
      setEditingPayment(null);
      setNewPayment({ name: "", key: "", icon: "", description: "" });
      toast({ title: "Payment method added successfully" });
    },
  });

  const updatePaymentMethod = useMutation({
    mutationFn: async (data: Partial<PaymentMethod> & { id: string }) => {
      const res = await apiRequest("PATCH", `/api/payment-methods/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
      setIsPaymentModalOpen(false);
      setEditingPayment(null);
      setNewPayment({ name: "", key: "", icon: "", description: "" });
      toast({ title: "Payment method updated successfully" });
    },
  });

  const deletePaymentMethod = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/payment-methods/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
      toast({ title: "Payment method deleted successfully" });
    },
  });

  const updateSetting = useMutation({
    mutationFn: async (data: { key: string; value: string }) => {
      const res = await apiRequest("POST", "/api/settings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "Setting updated successfully" });
    },
  });

  const handleLogin = () => {
    const adminPassword = atob("VTBoUFEwdEpSbGxGVGtOUFJFVTJOQT09");
    if (password === adminPassword || password === "admin123") {
      setIsAuthenticated(true);
    } else {
      toast({ title: "Invalid password", variant: "destructive" });
    }
  };

  const getSetting = (key: string, defaultValue: string = ""): string => {
    const setting = settings.find((s) => s.key === key);
    return setting?.value || defaultValue;
  };

  const totalVolume = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  const completedCount = transactions.filter((t) => t.status === "completed").length;
  const pendingCount = transactions.filter((t) => t.status === "pending").length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <PrismaticBackground intensity="low" enableParallax={false} />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="p-8 w-full max-w-md" hover={false}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
              <p className="text-white/50">Enter your password to continue</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <div className="relative mb-6">
                <GlassInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="input-admin-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-white/40 hover:text-white/70 transition-colors"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <GlassButton
                type="submit"
                variant="primary"
                className="w-full"
                shimmer
                data-testid="button-login"
              >
                <LogIn className="w-4 h-4" />
                Login
              </GlassButton>
            </form>

            <p className="text-center text-white/30 text-xs mt-6">
              Hint: admin123
            </p>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PrismaticBackground intensity={animationIntensity as "low" | "medium" | "high"} enableParallax />
      <GlassNavbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
                <p className="text-white/50">Manage your exchange platform</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-white/50">Animation:</span>
                <GlassPill
                  options={animationOptions}
                  value={animationIntensity}
                  onChange={setAnimationIntensity}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {tabs.map((tab) => (
                <GlassButton
                  key={tab.id}
                  variant={activeTab === tab.id ? "primary" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  data-testid={`button-tab-${tab.id}`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </GlassButton>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <GlassCard className="p-6" hover={false}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="text-white/50 text-sm">Total Volume</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        ${totalVolume.toLocaleString()}
                      </div>
                    </GlassCard>

                    <GlassCard className="p-6" hover={false}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                          <Activity className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-white/50 text-sm">Transactions</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {transactions.length}
                      </div>
                    </GlassCard>

                    <GlassCard className="p-6" hover={false}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-400" />
                        </div>
                        <span className="text-white/50 text-sm">Completed</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {completedCount}
                      </div>
                    </GlassCard>

                    <GlassCard className="p-6" hover={false}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                          <RefreshCw className="w-5 h-5 text-amber-400" />
                        </div>
                        <span className="text-white/50 text-sm">Pending</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {pendingCount}
                      </div>
                    </GlassCard>
                  </div>

                  <GlassCard className="p-6" hover={false}>
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
                    {transactionsLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : transactions.length === 0 ? (
                      <div className="text-center py-8 text-white/50">
                        No transactions yet
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {transactions.slice(0, 5).map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center justify-between p-4 rounded-xl bg-white/5"
                          >
                            <div>
                              <div className="text-white font-medium">
                                ${t.amount?.toLocaleString()} → {t.cryptoAmount?.toFixed(6)} {t.cryptoType}
                              </div>
                              <div className="text-white/40 text-sm">{t.email}</div>
                            </div>
                            <div className={cn(
                              "status-badge",
                              t.status === "completed" && "status-completed",
                              t.status === "pending" && "status-pending",
                              t.status === "processing" && "status-processing",
                              t.status === "failed" && "status-failed"
                            )}>
                              {t.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              )}

              {activeTab === "transactions" && (
                <motion.div
                  key="transactions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard className="p-6" hover={false}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-white">All Transactions</h3>
                    </div>

                    {transactionsLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : transactions.length === 0 ? (
                      <div className="text-center py-12 text-white/50">
                        <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        No transactions found
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {transactions.map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <span className="text-white font-medium">
                                  ${t.amount?.toLocaleString()}
                                </span>
                                <span className="text-white/30">→</span>
                                <span className="text-white/70">
                                  {t.cryptoAmount?.toFixed(6)} {t.cryptoType}
                                </span>
                                {t.isFeatured && (
                                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-white/40 text-sm">{t.email}</span>
                                <span className="text-white/20">•</span>
                                <span className="text-white/40 text-sm capitalize">{t.paymentMethod}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "status-badge",
                                t.status === "completed" && "status-completed",
                                t.status === "pending" && "status-pending",
                                t.status === "processing" && "status-processing",
                                t.status === "failed" && "status-failed"
                              )}>
                                {t.status}
                              </div>

                              <GlassButton
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingTransaction(t);
                                  setIsTransactionModalOpen(true);
                                }}
                                data-testid={`button-edit-transaction-${t.id}`}
                              >
                                <Edit3 className="w-4 h-4" />
                              </GlassButton>

                              <GlassButton
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm("Delete this transaction?")) {
                                    deleteTransaction.mutate(t.id);
                                  }
                                }}
                                data-testid={`button-delete-transaction-${t.id}`}
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </GlassButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              )}

              {activeTab === "cryptos" && (
                <motion.div
                  key="cryptos"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard className="p-6" hover={false}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-white">Cryptocurrencies</h3>
                      <GlassButton
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setEditingCrypto(null);
                          setNewCrypto({ name: "", symbol: "", walletAddress: "", icon: "" });
                          setIsCryptoModalOpen(true);
                        }}
                        data-testid="button-add-crypto"
                      >
                        <Plus className="w-4 h-4" />
                        Add Crypto
                      </GlassButton>
                    </div>

                    {cryptosLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : cryptos.length === 0 ? (
                      <div className="text-center py-12 text-white/50">
                        <Coins className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        No cryptocurrencies configured
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cryptos.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center overflow-hidden">
                                {c.icon ? (
                                  <img src={c.icon} alt={c.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="font-bold text-white text-sm">{c.symbol.slice(0, 2)}</span>
                                )}
                              </div>
                              <div>
                                <div className="text-white font-medium">{c.name}</div>
                                <div className="text-white/40 text-sm">{c.symbol}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "px-2 py-1 rounded-full text-xs",
                                c.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/50"
                              )}>
                                {c.isActive ? "Active" : "Inactive"}
                              </div>
                              <GlassButton
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingCrypto(c);
                                  setNewCrypto({
                                    name: c.name,
                                    symbol: c.symbol,
                                    walletAddress: c.walletAddress || "",
                                    icon: c.icon || ""
                                  });
                                  setIsCryptoModalOpen(true);
                                }}
                                data-testid={`button-edit-crypto-${c.id}`}
                              >
                                <Edit3 className="w-4 h-4" />
                              </GlassButton>
                              <GlassButton
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm("Delete this crypto?")) {
                                    deleteCrypto.mutate(c.id);
                                  }
                                }}
                                data-testid={`button-delete-crypto-${c.id}`}
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </GlassButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              )}

              {activeTab === "payments" && (
                <motion.div
                  key="payments"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard className="p-6" hover={false}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-white">Payment Methods</h3>
                      <GlassButton
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setEditingPayment(null);
                          setNewPayment({ name: "", key: "", icon: "", description: "" });
                          setIsPaymentModalOpen(true);
                        }}
                        data-testid="button-add-payment"
                      >
                        <Plus className="w-4 h-4" />
                        Add Payment
                      </GlassButton>
                    </div>

                    {paymentsLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-20 rounded-lg bg-white/5 animate-pulse" />
                        ))}
                      </div>
                    ) : paymentMethods.length === 0 ? (
                      <div className="text-center py-12">
                        <CreditCard className="w-12 h-12 text-white/20 mx-auto mb-3" />
                        <p className="text-white/50">No payment methods yet</p>
                        <p className="text-white/30 text-sm mt-1">Add your first payment method above</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {paymentMethods.map((pm) => (
                          <div
                            key={pm.id}
                            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                          >
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {pm.icon ? (
                                <img src={pm.icon} alt={pm.name} className="w-full h-full object-cover" />
                              ) : (
                                <CreditCard className="w-6 h-6 text-white/50" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{pm.name}</span>
                                <span className="text-white/40 text-xs">({pm.key})</span>
                              </div>
                              {pm.description && (
                                <p className="text-white/50 text-sm">{pm.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <GlassButton
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingPayment(pm);
                                  setNewPayment({
                                    name: pm.name,
                                    key: pm.key,
                                    icon: pm.icon || "",
                                    description: pm.description || ""
                                  });
                                  setIsPaymentModalOpen(true);
                                }}
                                data-testid={`button-edit-payment-${pm.id}`}
                              >
                                <Edit3 className="w-4 h-4" />
                              </GlassButton>
                              <GlassButton
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm("Delete this payment method?")) {
                                    deletePaymentMethod.mutate(pm.id);
                                  }
                                }}
                                data-testid={`button-delete-payment-${pm.id}`}
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </GlassButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <GlassCard className="p-6" hover={false}>
                    <h3 className="text-lg font-semibold text-white mb-6">General Settings</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-2">
                          Site Name
                        </label>
                        <GlassInput
                          type="text"
                          placeholder="Prismatic"
                          defaultValue={getSetting("siteName", "Prismatic")}
                          onBlur={(e) => updateSetting.mutate({ key: "siteName", value: e.target.value })}
                          data-testid="input-site-name"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-2">
                          Discord Link
                        </label>
                        <GlassInput
                          type="text"
                          placeholder="https://discord.gg/..."
                          defaultValue={getSetting("discordLink", "")}
                          onBlur={(e) => updateSetting.mutate({ key: "discordLink", value: e.target.value })}
                          data-testid="input-discord-link"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-2">
                          Minimum Exchange Amount ($)
                        </label>
                        <GlassInput
                          type="number"
                          placeholder="10"
                          defaultValue={getSetting("minAmount", "10")}
                          onBlur={(e) => updateSetting.mutate({ key: "minAmount", value: e.target.value })}
                          data-testid="input-min-amount"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-2">
                          Service Fee (%)
                        </label>
                        <GlassInput
                          type="number"
                          placeholder="2.5"
                          defaultValue={getSetting("serviceFee", "2.5")}
                          onBlur={(e) => updateSetting.mutate({ key: "serviceFee", value: e.target.value })}
                          data-testid="input-service-fee"
                        />
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6" hover={false}>
                    <h3 className="text-lg font-semibold text-white mb-6">Animation Settings</h3>
                    
                    <div>
                      <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-3">
                        Background Animation Intensity
                      </label>
                      <GlassPill
                        options={animationOptions}
                        value={animationIntensity}
                        onChange={setAnimationIntensity}
                      />
                      <p className="text-white/40 text-sm mt-2">
                        Controls the intensity of background gradient animations
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <GlassModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        title="Edit Transaction"
        size="md"
      >
        {editingTransaction && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-2">
                Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setEditingTransaction({ ...editingTransaction, status: s.value })}
                    className={cn(
                      "p-3 rounded-lg border transition-all",
                      editingTransaction.status === s.value
                        ? "bg-emerald-500/20 border-emerald-500/50 text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                    )}
                    data-testid={`button-status-${s.value}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={editingTransaction.isFeatured || false}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500"
              />
              <label htmlFor="featured" className="text-white/70 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                Featured Transaction
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <GlassButton
                variant="ghost"
                className="flex-1"
                onClick={() => setIsTransactionModalOpen(false)}
              >
                Cancel
              </GlassButton>
              <GlassButton
                variant="primary"
                className="flex-1"
                onClick={() => {
                  updateTransaction.mutate({
                    id: editingTransaction.id,
                    status: editingTransaction.status,
                    isFeatured: editingTransaction.isFeatured,
                  });
                }}
                disabled={updateTransaction.isPending}
                data-testid="button-save-transaction"
              >
                {updateTransaction.isPending ? "Saving..." : "Save Changes"}
              </GlassButton>
            </div>
          </div>
        )}
      </GlassModal>

      <GlassModal
        isOpen={isCryptoModalOpen}
        onClose={() => {
          setIsCryptoModalOpen(false);
          setEditingCrypto(null);
          setNewCrypto({ name: "", symbol: "", walletAddress: "", icon: "" });
        }}
        title={editingCrypto ? "Edit Cryptocurrency" : "Add Cryptocurrency"}
        size="md"
      >
        <div className="space-y-4">
          <GlassInput
            label="Name"
            placeholder="Bitcoin"
            value={newCrypto.name}
            onChange={(e) => setNewCrypto({ ...newCrypto, name: e.target.value })}
            data-testid="input-crypto-name"
          />
          <GlassInput
            label="Symbol"
            placeholder="BTC"
            value={newCrypto.symbol}
            onChange={(e) => setNewCrypto({ ...newCrypto, symbol: e.target.value.toUpperCase() })}
            data-testid="input-crypto-symbol"
          />
          <GlassInput
            label="Icon URL"
            placeholder="https://example.com/bitcoin-icon.png"
            value={newCrypto.icon}
            onChange={(e) => setNewCrypto({ ...newCrypto, icon: e.target.value })}
            data-testid="input-crypto-icon"
          />
          {newCrypto.icon && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10">
                <img src={newCrypto.icon} alt="Icon preview" className="w-full h-full object-cover" />
              </div>
              <span className="text-white/50 text-sm">Icon preview</span>
            </div>
          )}
          <GlassInput
            label="Wallet Address (for receiving)"
            placeholder="Enter wallet address"
            value={newCrypto.walletAddress}
            onChange={(e) => setNewCrypto({ ...newCrypto, walletAddress: e.target.value })}
            data-testid="input-crypto-wallet"
          />

          <div className="flex gap-3 pt-4">
            <GlassButton
              variant="ghost"
              className="flex-1"
              onClick={() => {
                setIsCryptoModalOpen(false);
                setEditingCrypto(null);
                setNewCrypto({ name: "", symbol: "", walletAddress: "", icon: "" });
              }}
            >
              Cancel
            </GlassButton>
            <GlassButton
              variant="primary"
              className="flex-1"
              onClick={() => {
                if (editingCrypto) {
                  updateCrypto.mutate({
                    id: editingCrypto.id,
                    name: newCrypto.name,
                    symbol: newCrypto.symbol,
                    walletAddress: newCrypto.walletAddress || null,
                    icon: newCrypto.icon || null,
                  });
                } else {
                  createCrypto.mutate(newCrypto);
                }
              }}
              disabled={(editingCrypto ? updateCrypto.isPending : createCrypto.isPending) || !newCrypto.name || !newCrypto.symbol}
              data-testid="button-save-crypto"
            >
              {editingCrypto 
                ? (updateCrypto.isPending ? "Saving..." : "Save Changes")
                : (createCrypto.isPending ? "Adding..." : "Add Crypto")
              }
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      <GlassModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setEditingPayment(null);
          setNewPayment({ name: "", key: "", icon: "", description: "" });
        }}
        title={editingPayment ? "Edit Payment Method" : "Add Payment Method"}
        size="md"
      >
        <div className="space-y-4">
          <GlassInput
            label="Name"
            placeholder="PayPal"
            value={newPayment.name}
            onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
            data-testid="input-payment-name"
          />
          <GlassInput
            label="Key"
            placeholder="paypal"
            value={newPayment.key}
            onChange={(e) => setNewPayment({ ...newPayment, key: e.target.value.toLowerCase() })}
            data-testid="input-payment-key"
          />
          <GlassInput
            label="Description (optional)"
            placeholder="Fast & secure"
            value={newPayment.description}
            onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
            data-testid="input-payment-description"
          />
          <GlassInput
            label="Icon URL"
            placeholder="https://example.com/paypal-icon.png"
            value={newPayment.icon}
            onChange={(e) => setNewPayment({ ...newPayment, icon: e.target.value })}
            data-testid="input-payment-icon"
          />
          {newPayment.icon && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10">
                <img src={newPayment.icon} alt="Icon preview" className="w-full h-full object-cover" />
              </div>
              <span className="text-white/50 text-sm">Icon preview</span>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <GlassButton
              variant="ghost"
              className="flex-1"
              onClick={() => {
                setIsPaymentModalOpen(false);
                setEditingPayment(null);
                setNewPayment({ name: "", key: "", icon: "", description: "" });
              }}
            >
              Cancel
            </GlassButton>
            <GlassButton
              variant="primary"
              className="flex-1"
              onClick={() => {
                if (editingPayment) {
                  updatePaymentMethod.mutate({
                    id: editingPayment.id,
                    name: newPayment.name,
                    key: newPayment.key,
                    icon: newPayment.icon || null,
                    description: newPayment.description || null,
                  });
                } else {
                  createPaymentMethod.mutate(newPayment);
                }
              }}
              disabled={(editingPayment ? updatePaymentMethod.isPending : createPaymentMethod.isPending) || !newPayment.name || !newPayment.key}
              data-testid="button-save-payment"
            >
              {editingPayment 
                ? (updatePaymentMethod.isPending ? "Saving..." : "Save Changes")
                : (createPaymentMethod.isPending ? "Adding..." : "Add Payment")
              }
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
