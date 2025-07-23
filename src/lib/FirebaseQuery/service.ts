import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";
import { auth as firebaseAuth } from "./index";
import { env } from "../env";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier | null;
    confirmationResult?: ConfirmationResult | null;
  }
}

/**
 * 1) Inicializa o limpia el widget reCAPTCHA invisible
 */
export function initRecaptcha(selectorId = "recaptcha-container") {
  if (window.recaptchaVerifier) {
    try { window.recaptchaVerifier.clear(); } catch {}
    window.recaptchaVerifier = null;
  }
  const verifier = new RecaptchaVerifier(firebaseAuth, selectorId, {
    size: "invisible",
  });
  window.recaptchaVerifier = verifier;
  return verifier;
}

/**
 * 2) Envía el SMS:
 *    a) renderiza y verifica el captcha
 *    b) llama a tu endpoint /api/recaptcha-assess (SMS‑Defense)
 *    c) si pasa, dispara signInWithPhoneNumber de Firebase
 */
export async function sendSigninSMS(
  phone: string
): Promise<ConfirmationResult> {
  // a) captcha invisible
  const verifier = initRecaptcha();
  await verifier.render();
  const token = await (verifier.verify?.() as Promise<string>);

  // b) SMS‑Defense: crea la assessment en tu backend
  const resp = await fetch("/api/recaptcha-assess", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      siteKey: env.recaptchaSiteKey,
      accountId: phone,
      phoneNumber: phone,
    }),
  });
  if (!resp.ok) {
    const { error } = await resp.json().catch(() => ({ error: "error desconocido" }));
    throw new Error(error);
  }

  // c) envía el SMS “real” con Firebase
  const confirmation = await signInWithPhoneNumber(
    firebaseAuth,
    phone,
    verifier
  );
  window.confirmationResult = confirmation;
  return confirmation;
}

/**
 * 3) Verifica el OTP contra el confirmationResult guardado en window
 */
export function confirmOTP(code: string) {
  if (!window.confirmationResult) {
    return Promise.reject(new Error("Debes enviar primero el SMS"));
  }
  return window.confirmationResult.confirm(code);
}
