import type { ReactNode } from "react";
import { legal } from "./legal-config";

export default function LegalDocument({title,children}:{title:string;children:ReactNode}) {
  return <main className="legal-page">
    <header className="profile-header"><div className="wrap"><a className="logo" href="/">GEAR<span>.</span></a><a href="/">← На главную</a></div></header>
    <article className="legal-document">
      <p className="overline">GEAR · Документы</p><h1>{title}</h1>
      <p className="legal-date">Проект от {legal.date} · Версия {legal.version}</p>
      <div className="legal-draft" role="note">Проект для предварительного ознакомления. Сведения о владельце и условия обработки данных будут утверждены до запуска регистрации. Текущая форма входа демонстрационная: почта и согласие из неё не отправляются и не сохраняются.</div>
      {children}
      <nav className="legal-document-nav" aria-label="Документы"><a href="/privacy">Политика обработки данных</a><a href="/consent">Согласие на обработку данных</a></nav>
    </article>
  </main>;
}

export function OperatorDetails() {
  return <dl className="operator-details"><div><dt>Владелец GEAR</dt><dd>Сведения будут опубликованы до запуска регистрации и обработки данных пользователей.</dd></div><div><dt>E-mail для вопросов о проекте</dt><dd><a href={`mailto:${legal.email}`}>{legal.email}</a></dd></div></dl>;
}
