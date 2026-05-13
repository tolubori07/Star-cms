import { prisma } from "@/db/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  // Create a server's supabase client with newly configured cookie,
  // which could be used to maintain user's session
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet, _headers) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have proxy refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

export const getUser = async () => {
  const { auth } = await createClient();
  const userObject = await auth.getUser();

  if (userObject.error) {
    //console.error(userObject.error);
    return null;
  }

  return userObject.data.user;
};

export async function getUserOrCreate() {
  const supabaseUser = await getUser();

  if (!supabaseUser) return null;

  const dbUser = await prisma.user.upsert({
    where: { email: supabaseUser.email },
    update: {}, // no update
    create: {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: supabaseUser.user_metadata?.name ?? null,
    },
  });
  return dbUser;
}
