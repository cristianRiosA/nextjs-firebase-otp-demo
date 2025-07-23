"use client";

import React, { createContext, ReactNode, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { sendSigninSMS, confirmOTP } from "./service";
import { env } from "../env";

const firebaseConfig = {
  apiKey: env.firebaseApiKey,
  authDomain: env.firebaseDomain,
  projectId: env.firebaseProject,
};

const app = initializeApp(firebaseConfig);
// ✅ Exportamos auth para que el service.ts lo pueda importar
export const auth = getAuth(app);

export interface FirebaseQueryContextType {
  sendSigninSMS: (phone: string) => Promise<void>;
  confirmOTP: (code: string) => Promise<void>;
}

const FirebaseQueryContext = createContext<FirebaseQueryContextType | null>(null);

export function FirebaseQueryProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseQueryContext.Provider
      value={{
        sendSigninSMS: async (phone) => {
          await sendSigninSMS(phone);
        },
        confirmOTP: async (code) => {
          await confirmOTP(code);
        },
      }}
    >
      {children}
    </FirebaseQueryContext.Provider>
  );
}

export function useFirebaseQuery() {
  const ctx = useContext(FirebaseQueryContext);
  if (!ctx) {
    throw new Error("useFirebaseQuery debe usarse dentro de FirebaseQueryProvider");
  }
  return ctx;
}
