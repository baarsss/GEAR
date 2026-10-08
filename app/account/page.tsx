"use client";

import { useEffect, useState } from "react";
import { getBrowserClient, loadOwnProfile, type UserProfile } from "@/lib/supabase-browser";

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const supabase = await getBrowserClient();
        const { data } = await supabase.auth.getSession();
        const ownProfile = await loadOwnProfile();
        if (active) { setEmail(data.session?.user.email ?? ""); setProfile(ownProfile); }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "Не удалось загрузить профиль.");
      } finally { if (active) setLoading(false); }
    }
    void load();
    return () => { active = false; };
  }, []);

  async function signOut() {
    const supabase = await getBrowserClient();
    await supabase.auth.signOut();
    window.location.replace("/");
  }

  return <main className="account-page"><div className="account-card"><a className="logo" href="/">GEAR<span>.</span></a>
    <h1>Мой профиль</h1>
    {loading ? <p>Загружаем профиль…</p> : error ? <p className="form-error" role="alert">{error}</p> : !profile ? <><p>Вы ещё не вошли. Выберите роль и подтвердите e-mail по ссылке из письма.</p><a className="black-button" href="/">Перейти к входу</a></> : <>
      <p><b>E-mail:</b> {email}</p><p><b>Роль:</b> {profile.role === "provider" ? "Исполнитель" : "Пользователь услуг"}</p>
      <p className="account-muted">Регистрация тестовая. Чат, отзывы и сохранённые избранные появятся на следующих этапах.</p>
      {profile.role === "provider" && <a className="black-button" href="/provider">Мои объявления</a>}
      <button className="outline-button" onClick={signOut}>Выйти</button>
    </>}
    <a className="account-back" href="/">← Вернуться в каталог</a>
  </div></main>;
}
