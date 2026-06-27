import { redirect } from "next/navigation";
import { getUserOrCreate } from "@/utils/supabase/server";
import LoginForm from "./LoginForm";

export default async function Page() {
  const user = await getUserOrCreate();

  if (user) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
