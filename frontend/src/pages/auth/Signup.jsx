import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth.store";
import { ROUTES } from "@/lib/constants";
function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    await signup(email, password, workspaceName);
    navigate(ROUTES.UPLOAD);
  };
  return <div className="space-y-8"><div className="text-center space-y-2"><h1 className="text-3xl font-semibold">Create Account</h1><p className="text-muted-foreground">Start turning meetings into action</p></div><form onSubmit={handleSubmit} className="space-y-4"><div className="space-y-2"><label className="text-sm font-medium">Email</label><Input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div><div className="space-y-2"><label className="text-sm font-medium">Password</label><Input type="password" placeholder="Must be 12+ characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={12} /></div><div className="space-y-2"><label className="text-sm font-medium">Confirm Password</label><Input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></div><div className="space-y-2"><label className="text-sm font-medium">Workspace Name</label><Input type="text" placeholder="Acme Engineering" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} required /></div><Button type="submit" className="w-full" loading={isLoading}>
          Create Workspace & Continue
        </Button></form><p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}<Link to={ROUTES.LOGIN} className="text-primary hover:underline">Sign In</Link></p></div>;
}
export {
  Signup as default
};
