"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/db/prisma";

export const signup = async (formData: FormData) => {
  const supabase = await createClient();

  const userData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error, data } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        name: userData.name,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }
  const userID = data.user?.id;
  if (!userID) throw new Error("Error signing up");

  await prisma.user.create({
    data: {
      id: userID,
      email: userData.email,
      name: userData.name,
    },
  });
  return { success: true };
};
