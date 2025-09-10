import { useState } from "react";
import { Plus, CreditCard, Smartphone, Banknote, ArrowUpRight, ArrowDownLeft, Eye, EyeOff } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Wallet() {
  const [balance, setBalance] = useState(1250.50);
  const [showBalance, setShowBalance] = useState(true);
  const [addMoneyAmount, setAddMoneyAmount] = useState("");

  const transactions = [
    { id: 1, type: "debit", amount: 50, description: "E-Rickshaw Ride to Ramghat", date: "Today, 2:30 PM" },
    { id: 2, type: "credit", amount: 500, description: "Wallet Top-up", date: "Yesterday, 11:15 AM" },
    { id: 3, type: "debit", amount: 25, description: "Parking Fee - Mahakal Area", date: "2 days ago" },
    { id: 4, type: "credit", amount: 100, description: "Cashback Reward", date: "3 days ago" },
  ];

  const paymentMethods = [
    { id: "upi", icon: Smartphone, title: "UPI", description: "Pay using any UPI app" },
    { id: "card", icon: CreditCard, title: "Debit/Credit Card", description: "Visa, Mastercard, RuPay" },
    { id: "cash", icon: Banknote, title: "Cash", description: "Add cash at partner stores" },
  ];

  const handleAddMoney = (amount: string) => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      setBalance(prev => prev + numAmount);
      setAddMoneyAmount("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Wallet" />
      
      <div className="p-4 space-y-6">
        {/* Balance Card */}
        <Card className="bg-gradient-primary text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Wallet Balance</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBalance(!showBalance)}
                className="text-white hover:bg-white/20"
              >
                {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </Button>
            </div>
            <div className="text-3xl font-bold mb-4">
              ₹{showBalance ? balance.toFixed(2) : "****"}
            </div>
            <Button
              variant="secondary"
              className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
              onClick={() => document.getElementById("add-money")?.scrollIntoView()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Money
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <ArrowUpRight className="w-8 h-8 mx-auto mb-2 text-success" />
              <h3 className="font-medium">Send Money</h3>
              <p className="text-sm text-muted-foreground">To friends & family</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <ArrowDownLeft className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium">Request Money</h3>
              <p className="text-sm text-muted-foreground">From contacts</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Money Section */}
        <Card id="add-money">
          <CardHeader>
            <CardTitle>Add Money to Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={addMoneyAmount}
                onChange={(e) => setAddMoneyAmount(e.target.value)}
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex gap-2">
              {[100, 200, 500, 1000].map(amount => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAddMoneyAmount(amount.toString())}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <Label>Payment Method</Label>
              {paymentMethods.map(method => {
                const IconComponent = method.icon;
                return (
                  <Button
                    key={method.id}
                    variant="outline"
                    className="w-full justify-start h-auto p-4"
                    onClick={() => handleAddMoney(addMoneyAmount)}
                    disabled={!addMoneyAmount || parseFloat(addMoneyAmount) <= 0}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">{method.title}</div>
                      <div className="text-sm text-muted-foreground">{method.description}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === "credit" ? "bg-success/10" : "bg-destructive/10"
                  }`}>
                    {transaction.type === "credit" ? (
                      <ArrowDownLeft className="w-5 h-5 text-success" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.type === "credit" ? "text-success" : "text-destructive"
                }`}>
                  {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}