"use client";

import { useId, useState, type FormEvent } from "react";
import { legal } from "./legal-config";

const consentCopy = {
  ru: { label: "Даю согласие на обработку моих персональных данных", terms: "на условиях согласия", policy: "Политика обработки персональных данных", note: "Документы открываются в новой вкладке. Для продолжения отметьте согласие." },
  be: { label: "Даю згоду на апрацоўку маіх персанальных даных", terms: "на ўмовах згоды", policy: "Палітыка апрацоўкі персанальных даных", note: "Дакументы адкрываюцца ў новай укладцы. Каб працягнуць, адзначце згоду." },
  en: { label: "I consent to the processing of my personal data", terms: "under the consent terms", policy: "Personal data processing policy", note: "Documents open in a new tab. Select the consent checkbox to continue." },
};

export default function AuthForm({ language, labels }: {
  language: keyof typeof consentCopy;
  labels: { email: string; continue: string; emailDemo: string };
}) {
  const id = useId();
  const [consented, setConsented] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const text = consentCopy[language];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consented || !event.currentTarget.reportValidity()) return;
    // Preview only: no email or legally operative consent is sent or persisted.
    // Real registration must validate and record consent/version on the server.
    setSubmitted(true);
  }

  return <form className="login-form" onSubmit={submit}>
    <label htmlFor={`${id}-email`}>{labels.email}<input id={`${id}-email`} name="email" type="email" autoComplete="email" required placeholder="name@example.com" onChange={() => setSubmitted(false)} /></label>
    <div className="consent-field">
      <input id={`${id}-consent`} name="personalDataConsent" type="checkbox" value={legal.version} required checked={consented} aria-describedby={`${id}-hint`} onChange={event => { setConsented(event.target.checked); setSubmitted(false); }} />
      <div><label htmlFor={`${id}-consent`}>{text.label}</label>{" "}<a href="/consent" target="_blank" rel="noopener noreferrer">{text.terms}</a>.</div>
    </div>
    <a className="privacy-form-link" href="/privacy" target="_blank" rel="noopener noreferrer">{text.policy}</a>
    <p className="consent-hint" id={`${id}-hint`}>{text.note}</p>
    <button className="black-button" type="submit" disabled={!consented}>{labels.continue}</button>
    {submitted && <p className="dialog-note" role="status">{labels.emailDemo}</p>}
  </form>;
}
