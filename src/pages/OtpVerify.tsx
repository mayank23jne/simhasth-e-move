import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import logo from "/public/icons/logo.png";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-fill demo OTP after 2 seconds
  useEffect(() => {
    const autoFillTimer = setTimeout(() => {
      setOtp("1234");
    }, 2000);

    return () => clearTimeout(autoFillTimer);
  }, []);

  const handleVerify = () => {
    if (otp.length === 4 && otp === "1234") {
      // Get role from URL params
      const searchParams = new URLSearchParams(location.search);
      const role = searchParams.get("role") || "user";
      
      localStorage.setItem("isAuthenticated", "true");
      navigate(`/permissions?role=${role}`);
    }
  };

  const handleResend = () => {
    setTimer(30);
    setOtp("");
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
          <p className="text-muted-foreground">Enter the code sent to your phone</p>
        </div>

        <div className="space-y-6">
          {/* OTP Input */}
          <div className="flex justify-center">
            <InputOTP
              maxLength={4}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="bg-muted" />
                <InputOTPSlot index={1} className="bg-muted" />
                <InputOTPSlot index={2} className="bg-muted" />
                <InputOTPSlot index={3} className="bg-muted" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Timer */}
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-4">
              {timer > 0 ? (
                <>Resend OTP in {timer}s</>
              ) : (
                <Button variant="link" onClick={handleResend} className="p-0 h-auto">
                  Resend OTP
                </Button>
              )}
            </p>
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            className="w-full"
            disabled={otp.length !== 4}
          >
            Verify OTP
          </Button>

          {/* Auto-fill Animation */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-xs">Auto-detecting SMS...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}