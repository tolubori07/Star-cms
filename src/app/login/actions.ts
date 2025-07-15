"use server";

import { createClient } from "@/utils/supabase/server";

export const login = async (data: { email: string; password: string }) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    return { error: error.message };
  }
  return { success: true };
};

export const logOutAction = async () => {
  const { auth } = await createClient();

  const { error } = await auth.signOut();
  if (error) throw error;

  return { errorMessage: null };
};
