"use client";

import { AuthProvider } from "@/providers";

const AuthComponent = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthComponent;
