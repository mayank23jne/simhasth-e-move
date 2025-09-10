import { useState } from "react";
import { Gift, Clock, Users, Copy, Check } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  validUntil: string;
  category: "ride" | "wallet" | "referral";
  isUsed: boolean;
  minAmount?: number;
}

export default function Offers() {
  const [offers] = useState<Offer[]>([
    {
      id: "1",
      title: "Festival Special",
      description: "Get 50% off on your next 3 e-rickshaw rides during Simhastha",
      code: "SIMHA50",
      discount: "50% OFF",
      validUntil: "Valid till 31 Jan 2025",
      category: "ride",
      isUsed: false,
      minAmount: 30
    },
    {
      id: "2",
      title: "First Ride Free",
      description: "Welcome bonus! Your first ride is completely free",
      code: "WELCOME",
      discount: "100% OFF",
      validUntil: "Valid for 7 days",
      category: "ride",
      isUsed: false,
      minAmount: 0
    },
    {
      id: "3",
      title: "Wallet Cashback",
      description: "Add ₹500 to wallet and get ₹100 cashback instantly",
      code: "WALLET100",
      discount: "₹100 Cashback",
      validUntil: "Valid till 15 Feb 2025",
      category: "wallet",
      isUsed: false,
      minAmount: 500
    },
    {
      id: "4",
      title: "Refer & Earn",
      description: "Invite friends and both get ₹50 wallet credit",
      code: "REFER50",
      discount: "₹50 Each",
      validUntil: "No expiry",
      category: "referral",
      isUsed: false
    },
    {
      id: "5",
      title: "Weekend Special",
      description: "25% off on weekend rides to temples",
      code: "WEEKEND25",
      discount: "25% OFF",
      validUntil: "Valid till 28 Jan 2025",
      category: "ride",
      isUsed: true,
      minAmount: 25
    }
  ]);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "ride": return <Users className="w-5 h-5" />;
      case "wallet": return <Gift className="w-5 h-5" />;
      case "referral": return <Users className="w-5 h-5" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ride": return "bg-primary text-primary-foreground";
      case "wallet": return "bg-success text-success-foreground";
      case "referral": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Code Copied!",
      description: `Offer code ${code} copied to clipboard`,
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const activeOffers = offers.filter(offer => !offer.isUsed);
  const usedOffers = offers.filter(offer => offer.isUsed);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Offers" />
      
      <div className="p-4 space-y-6">
        {/* Active Offers */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Active Offers</h2>
          <div className="space-y-4">
            {activeOffers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Left Side - Offer Details */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-full ${getCategoryColor(offer.category)}`}>
                            {getCategoryIcon(offer.category)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{offer.title}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {offer.category.charAt(0).toUpperCase() + offer.category.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-primary">
                          {offer.discount}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {offer.description}
                      </p>
                      
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-3">
                        <Clock className="w-4 h-4" />
                        <span>{offer.validUntil}</span>
                      </div>

                      {offer.minAmount && (
                        <p className="text-xs text-muted-foreground mb-3">
                          Minimum order: ₹{offer.minAmount}
                        </p>
                      )}

                      {/* Code Section */}
                      <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                        <div>
                          <span className="text-xs text-muted-foreground">Code:</span>
                          <div className="font-mono font-semibold">{offer.code}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCode(offer.code)}
                          className="flex items-center space-x-2"
                        >
                          {copiedCode === offer.code ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          <span className="text-xs">
                            {copiedCode === offer.code ? "Copied" : "Copy"}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Used Offers */}
        {usedOffers.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Used Offers</h2>
            <div className="space-y-4">
              {usedOffers.map((offer) => (
                <Card key={offer.id} className="overflow-hidden opacity-60">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getCategoryColor(offer.category)}`}>
                          {getCategoryIcon(offer.category)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{offer.title}</h3>
                          <p className="text-sm text-muted-foreground">{offer.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Used
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Referral Section */}
        <Card className="bg-gradient-sunset text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-6 h-6" />
              <span>Invite Friends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Share Simhastha e-move with friends and both get ₹50 wallet credit!</p>
            <Button variant="secondary" className="w-full">
              Share App
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}