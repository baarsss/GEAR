"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export async function getBrowserClient(): Promise<SupabaseClient> {
  if (client) return client;
  const response = await fetch("/api/public-config", { cache: "no-store" });
  if (!response.ok) throw new Error("Регистрация временно недоступна");
  const config = await response.json() as { url?: string; key?: string };
  if (!config.url || !config.key || !config.key.startsWith("sb_publishable_")) {
    throw new Error("Регистрация временно недоступна");
  }
  client = createClient(config.url, config.key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: "gear-auth" },
  });
  return client;
}

export type UserRole = "consumer" | "provider";
export type UserProfile = { user_id: string; role: UserRole; consent_version: string };

export async function loadOwnProfile(): Promise<UserProfile | null> {
  const supabase = await getBrowserClient();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const user = sessionData.session?.user;
  if (!user) return null;
  const { data, error } = await supabase.from("user_profiles")
    .select("user_id,role,consent_version").eq("user_id", user.id).maybeSingle();
  if (error) throw error;
  return data as UserProfile | null;
}
