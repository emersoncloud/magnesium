"use client";

import { Button } from "./ui/Button";
import { loginWithGoogle } from "@/lib/auth-client";

interface LoginButtonProps {
  children?: React.ReactNode;
}

export function LoginButton({ children, ...props }: LoginButtonProps) {
  return (
    <Button variant="secondary" onClick={loginWithGoogle} {...props}>
      {children || "Sign In"}
    </Button>
  );
}
