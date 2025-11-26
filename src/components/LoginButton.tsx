"use client";

import { Button } from "./ui/Button";
import { loginWithGoogle } from "@/lib/auth-client";

interface LoginButtonProps {
  children?: React.ReactNode;
}

export function LoginButton({ children, ...props }: LoginButtonProps) {
  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await loginWithGoogle();
  };

  return (
    <Button
      variant="secondary"
      onClick={handleLogin}
      {...props}
    >
      {children || "Sign In"}
    </Button>
  );
}
