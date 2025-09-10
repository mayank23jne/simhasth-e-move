import { useState } from "react";
import { MessageCircle, Phone, Mail, ChevronRight, ChevronDown } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
}

export default function Support() {
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: "1",
      question: "How to book an e-rickshaw?",
      answer: "Open the app, enter your pickup and destination locations, select e-rickshaw option, and confirm your booking. You'll be matched with the nearest available driver.",
      isOpen: false
    },
    {
      id: "2", 
      question: "What payment methods are accepted?",
      answer: "We accept UPI, debit/credit cards, net banking, and cash payments. You can also use your Simhastha e-move wallet for faster transactions.",
      isOpen: false
    },
    {
      id: "3",
      question: "How to add money to wallet?",
      answer: "Go to Wallet section in the app, enter the amount you want to add, select your payment method (UPI/Card), and complete the transaction securely.",
      isOpen: false
    },
    {
      id: "4",
      question: "What if my ride is cancelled?",
      answer: "If a ride is cancelled by the driver or due to technical issues, you won't be charged. Any deducted amount will be refunded to your wallet within 24 hours.",
      isOpen: false
    },
    {
      id: "5",
      question: "How to track my e-rickshaw?",
      answer: "Once your booking is confirmed, you can track your assigned e-rickshaw in real-time on the map. You'll see the driver's location and estimated arrival time.",
      isOpen: false
    },
    {
      id: "6",
      question: "Is the app available offline?",
      answer: "Yes! The app works with limited connectivity. You can access offline maps, view saved locations, and see your ride history even without internet.",
      isOpen: false
    }
  ]);

  const [chatMessage, setChatMessage] = useState("");

  const toggleFAQ = (id: string) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id ? { ...faq, isOpen: !faq.isOpen } : { ...faq, isOpen: false }
    ));
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Handle chat message
      console.log("Sending message:", chatMessage);
      setChatMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Support & Help" />
      
      <div className="p-4 space-y-6">
        {/* Quick Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Need Immediate Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <Phone className="w-5 h-5 mr-3 text-primary" />
              <div className="text-left">
                <div className="font-medium">Emergency Helpline</div>
                <div className="text-sm text-muted-foreground">24/7 Support: +91 1800-123-4567</div>
              </div>
            </Button>
            
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <Mail className="w-5 h-5 mr-3 text-primary" />
              <div className="text-left">
                <div className="font-medium">Email Support</div>
                <div className="text-sm text-muted-foreground">support@simhastha-emove.com</div>
              </div>
            </Button>

            <Button className="w-full justify-start h-auto p-4 bg-success hover:bg-success/90">
              <MessageCircle className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium text-success-foreground">Live Chat Support</div>
                <div className="text-sm text-success-foreground/80">Average response time: 2 minutes</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {faqs.map((faq) => (
              <Collapsible key={faq.id} open={faq.isOpen} onOpenChange={() => toggleFAQ(faq.id)}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto text-left border border-border rounded-lg hover:bg-muted"
                  >
                    <span className="font-medium">{faq.question}</span>
                    {faq.isOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="+91 98765 43210" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Brief description of your issue" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Describe your issue in detail..."
                rows={4}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
            </div>
            
            <Button onClick={handleSendMessage} className="w-full">
              Send Message
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center text-sm text-muted-foreground space-y-1">
              <p>Simhastha e-move v1.0.0</p>
              <p>Made with ❤️ for devotees</p>
              <p>© 2024 Simhastha Kumbh Mela</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}