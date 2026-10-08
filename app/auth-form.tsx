"use client";

import { useId, useState, type FormEvent } from "react";
import { legal } from "./legal-config";
import { getBrowserClient, type UserRole } from "@/lib/supabase-browser";

const consentCopy = {
  ru: { label: "Даю согласие на обработку моих персональных данных", terms: "на условиях согласия", policy: "Политика обработки персональных данных", note: "Для тестового входа подтвердите e-mail по ссылке в письме.", consumer: "Ищу услуги", provider: "Предоставляю услуги", sent: "Проверьте почту: мы отправили ссылку для входа. Откройте её в этом браузере.", send: "Получить ссылку для входа", limit: "Пока встроенная почта Supabase отправляет письма только участникам проекта. Для открытой регистрации потребуется отдельный почтовый сервис." },
  be: { label: "Даю згоду на апрацоўку маіх персанальных даных", terms: "на ўмовах згоды", policy: "Палітыка апрацоўкі персанальных даных", note: "Для тэставага ўваходу пацвердзіце e-mail праз спасылку ў лісце.", consumer: "Шукаю паслугі", provider: "Аказваю паслугі", sent: "Праверце пошту: мы адправілі спасылку для ўваходу. Адкрыйце яе ў гэтым браўзеры.", send: "Атрымаць спасылку для ўваходу", limit: "Пакуль убудаваная пошта Supabase адпраўляе лісты толькі ўдзельнікам праекта. Для адкрытай рэгістрацыі патрэбны асобны паштовы сэрвіс." },
  en: { label: "I consent to the processing of my personal data", terms: "under the consent terms", policy: "Personal data processing policy", note: "For the test sign-in, confirm your email using the link in the message.", consumer: "Find services", provider: "Offer services", sent: "Check your inbox for the sign-in link. Open it in this browser.", send: "Send sign-in link", limit: "Supabase's built-in mail currently sends only to project members. Public registration will need a separate email provider." },
};

export default function AuthForm({ language, labels, initialRole = "consumer" }: {
  language: keyof typeof consentCopy;
  labels: { email: string };
  initialRole?: UserRole;
}) {
  const id = useId();
  const [role, setRole] = useState<UserRole>(initialRole);
  const [consented, setConsented] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const text = consentCopy[language];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consented || !event.currentTarget.reportValidity()) return;
    const email = new FormData(event.currentTarget).get("email")?.toString().trim();
    if (!email) return;
    setBusy(true);
    setError("");
    try {
      const supabase = await getBrowserClient();
      const consentedAt = new Date().toISOString();
      sessionStorage.setItem("gear-pending-role", role);
      sessionStorage.setItem("gear-pending-consent-version", legal.version);
      sessionStorage.setItem("gear-pending-consent-at", consentedAt);
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/complete`,
          data: { gear_role: role, gear_consent_version: legal.version, gear_consent_at: consentedAt },
        },
      });
      if (authError) throw authError;
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось отправить письмо. Попробуйте позже.");
    } finally {
      setBusy(false);
    }
  }

  return <form className="login-form" onSubmit={submit}>
    <fieldset className="role-choice"><legend>{language === "en" ? "What do you want to do?" : language === "be" ? "Што вы хочаце рабіць?" : "Что вы хотите делать?"}</legend>
      <label className={role === "consumer" ? "selected" : ""}><input type="radio" name="role" value="consumer" checked={role === "consumer"} onChange={() => { setRole("consumer"); setSubmitted(false); }} />{text.consumer}</label>
      <label className={role === "provider" ? "selected" : ""}><input type="radio" name="role" value="provider" checked={role === "provider"} onChange={() => { setRole("provider"); setSubmitted(false); }} />{text.provider}</label>
    </fieldset>
    <label htmlFor={`${id}-email`}>{labels.email}<input id={`${id}-email`} name="email" type="email" autoComplete="email" required placeholder="name@example.com" onChange={() => { setSubmitted(false); setError(""); }} /></label>
    <div className="consent-field">
      <input id={`${id}-consent`} name="personalDataConsent" type="checkbox" value={legal.version} required checked={consented} aria-describedby={`${id}-hint`} onChange={event => { setConsented(event.target.checked); setSubmitted(false); }} />
      <div><label htmlFor={`${id}-consent`}>{text.label}</label>{" "}<a href="/consent" target="_blank" rel="noopener noreferrer">{text.terms}</a>.</div>
    </div>
    <a className="privacy-form-link" href="/privacy" target="_blank" rel="noopener noreferrer">{text.policy}</a>
    <p className="consent-hint" id={`${id}-hint`}>{text.note}</p>
    <button className="black-button" type="submit" disabled={!consented || busy}>{busy ? "…" : text.send}</button>
    {submitted && <p className="dialog-note" role="status">{text.sent}</p>}
    {error && <p className="form-error" role="alert">{error}</p>}
    <p className="auth-test-note">{text.limit}</p>
  </form>;
}
