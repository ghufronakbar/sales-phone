import { logout } from "@/actions/auth";

export default async function LogoutPage() {
  await logout();
  // redirect happens inside logout()
}
