"use client";

import React, { useState } from "react";
import { useFirebaseQuery } from "@/lib/FirebaseQuery";

export default function PhoneAuthPage() {
  const { sendSigninSMS, confirmOTP } = useFirebaseQuery();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const handleSend = async () => {
    setMsg("");
    try {
      await sendSigninSMS(phone);
      setMsg("✅ Código enviado (prueba: 123456)");
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setMsg("❌ Error enviando SMS: " + errorMsg);
    }
  };

  const handleVerify = async () => {
    setMsg("");
    try {
      await confirmOTP(code);
      setMsg("🎉 OTP verificado correctamente");
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setMsg("❌ Error validando OTP: " + errorMsg);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 400, margin: "auto" }}>
      <h1>Demo OTP Firebase + reCAPTCHA</h1>

      <input
        type="tel"
        placeholder="+57 300 0000000"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ width: "100%", marginBottom: 8, padding: 8 }}
      />
      <button
        onClick={handleSend}
        style={{ width: "100%", padding: 8 }}
        disabled={!phone}
      >
        Enviar OTP
      </button>

      <input
        type="text"
        placeholder="Código OTP"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ width: "100%", margin: "16px 0 8px", padding: 8 }}
      />
      <button
        onClick={handleVerify}
        style={{ width: "100%", padding: 8 }}
        disabled={!code}
      >
        Verificar OTP
      </button>

      {msg && <p style={{ marginTop: 16 }}>{msg}</p>}
    </div>
  );
}
