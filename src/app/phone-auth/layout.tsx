"use client";
import { ReactNode } from "react";
import { FirebaseQueryProvider } from "@/lib/FirebaseQuery";

export default function PhoneAuthLayout({ children }: { children: ReactNode }) {
  return (
    <FirebaseQueryProvider>
      <div id="recaptcha-container" />
      {children}
    </FirebaseQueryProvider>
  );
}
