import { supabase } from "./supabase";

export async function signInWithEmail(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) {
    console.error("Error sending magic link:", error.message);
    throw error;
  }
}

export async function signInWithGoogle() {
  supabase.auth.signInWithOAuth({
    provider: "google",
  });

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    console.error("Error signing in with Google OAuth:", error.message);
    throw error;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error.message);
  }
}

export async function fetchUserData(uid: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", uid)
    .single();

  if (error) {
    console.error("Error fetching user data:", error);
    return;
  }

  return data;
}

export async function getUserFromSession() {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  return user;
}
