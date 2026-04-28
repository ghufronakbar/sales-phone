import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { getUsers } from "@/actions/user";
import { UserListClient } from "./client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { UserCircle } from "lucide-react";

export default async function UserListPage() {
  const result = await getUsers();
  const users = result.data ?? [];

  return (
    <>
      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-sm font-semibold">User</h1>
      </header>

      <div className="p-4 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Daftar User</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Kelola akses staf dan karyawan ke dalam sistem.
            </p>
          </div>
          <Button asChild>
            <Link href="/user/create">
              <Plus className="mr-2 h-4 w-4" />
              Tambah User
            </Link>
          </Button>
        </div>

        {users.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <UserCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Belum ada data user selain akun default.
            </p>
          </div>
        ) : (
          <UserListClient users={users} />
        )}
      </div>
    </>
  );
}
