import { getUser } from "@/utils/supabase/server";
import NavBarClient from "./NavBarClient";

const NavBarServer = async () => {
  const user = await getUser();

  return <NavBarClient user={user} />;
};

export default NavBarServer;

