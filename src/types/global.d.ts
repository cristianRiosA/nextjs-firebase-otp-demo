import type {
  RecaptchaVerifier,
  ConfirmationResult
} from "firebase/auth";

declare global {
  interface Window {
    // tu verifier de Enterprise reCAPTCHA
    recaptchaVerifier?: RecaptchaVerifier | null;
    // el resultado de la confirmación de SMS
    confirmationResult?: ConfirmationResult | null;
    // opcionalmente widgetId si lo usas
    recaptchaWidgetId?: string | null;
  }
}

export {};