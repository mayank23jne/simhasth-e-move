import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "/public/icons/logo.png";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  // Get role from URL params
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get("role") || "user";

  // Auto-fill credentials after 1 second
  useEffect(() => {
    const autoFillTimer = setTimeout(() => {
      setPhone("9999999999");
      setPassword(role === "contributor" ? "contrib123" : "user123");
    }, 1000);

    return () => clearTimeout(autoFillTimer);
  }, [role]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Dummy credential validation with auto-fill
    const validCredentials = {
      user: { phone: "9999999999", password: "user123" },
      contributor: { phone: "9999999999", password: "contrib123" }
    };
    
    const roleCredentials = validCredentials[role as keyof typeof validCredentials];
    
    if (phone === roleCredentials?.phone && password === roleCredentials?.password) {
      localStorage.setItem("userRole", role);
      localStorage.setItem("isAuthenticated", "true");
      navigate(`/success?role=${role}`);
    } else {
      setError(`Invalid credentials. Use ${roleCredentials?.phone}/${roleCredentials?.password}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          {/* Hackathon Image */}
          <img 
            src="/icons/Hackathon.png" 
            alt="Hackathon Logo" 
            className="mx-auto h-32 w-32 mb-2 object-contain"
          />
          
          <img src={logo} alt="Logo" className="mx-auto h-24 w-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground">Simhastha E-move</h1>
          <p className="text-muted-foreground">
            {role === "contributor" ? "Login as Contributor" : "Sign in to continue your journey"}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-2">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="9999999999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Sign In
          </Button>

          <div className="text-center space-y-2">
            <Link to="/forgot-password" className="text-primary text-sm hover:underline">
              Forgot Password?
            </Link>
            <p className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link to={`/signup?role=${role}`} className="text-primary hover:underline">
                Sign Up
              </Link>
            </p>
            <Button 
              variant="link" 
              onClick={() => navigate("/")}
              className="text-sm"
            >
              Back to Home
            </Button>
          </div>
          
          {/* Demo Credentials */}
          <div className="text-center text-sm text-muted-foreground bg-muted/50 p-3 rounded">
            <p><strong>Demo Credentials:</strong></p>
            <p>
              {role === "contributor" ? "9999999999 / contrib123" : "9999999999 / user123"}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}