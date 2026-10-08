"use client";

import { useEffect, useState } from "react";
import { getBrowserClient, type UserRole } from "@/lib/supabase-browser";

export default function AuthCompletePage() {
  const [message, setMessage] = useState("Подтверждаем адрес электронной почты…");

  useEffect(() => {
    let active = true;
    async function finish() {
      try {
        const supabase = await getBrowserClient();
        const { data, error: authError } = await supabase.auth.getSession();
        if (authError) throw authError;
        const user = data.session?.user;
        if (!user) throw new Error("Ссылка недействительна или срок её действия истёк. Запросите новую ссылку на главной странице.");

        const { data: existing, error: profileError } = await supabase.from("user_profiles")
          .select("role").eq("user_id", user.id).maybeSingle();
        if (profileError) throw profileError;
        let role = existing?.role as UserRole | undefined;
        if (!role) {
          const requested = user.user_metadata?.gear_role ?? sessionStorage.getItem("gear-pending-role");
          const consentVersion = user.user_metadata?.gear_consent_version ?? sessionStorage.getItem("gear-pending-consent-version");
          const consentAt = user.user_metadata?.gear_consent_at ?? sessionStorage.getItem("gear-pending-consent-at");
          if ((requested !== "consumer" && requested !== "provider") || typeof consentVersion !== "string") {
            throw new Error("Не удалось завершить регистрацию. Повторите вход с главной страницы.");
          }
          const { error: createError } = await supabase.from("user_profiles").insert({
            user_id: user.id, role: requested, consent_version: consentVersion,
            consented_at: typeof consentAt === "string" && !Number.isNaN(Date.parse(consentAt)) ? consentAt : new Date().toISOString(),
          });
          if (createError) throw createError;
          role = requested;
        }
        sessionStorage.removeItem("gear-pending-role");
        sessionStorage.removeItem("gear-pending-consent-version");
        sessionStorage.removeItem("gear-pending-consent-at");
        if (active) window.location.replace(role === "provider" ? "/provider" : "/account");
      } catch (cause) {
        if (active) setMessage(cause instanceof Error ? cause.message : "Не удалось завершить вход.");
      }
    }
    void finish();
    return () => { active = false; };
  }, []);

  return <main className="account-page"><div className="account-card"><a className="logo" href="/">GEAR<span>.</span></a><h1>Вход в GEAR</h1><p role="status">{message}</p><a className="outline-button" href="/">На главную</a></div></main>;
}
