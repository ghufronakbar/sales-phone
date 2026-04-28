import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { getWorkers } from "@/actions/worker";
import { WorkerListClient } from "./client";
import { Button } from "@/components/ui/button";
import { Plus, HardHat } from "lucide-react";
import Link from "next/link";

export default async function WorkerListPage() {
  const result = await getWorkers();
  const workers = result.data ?? [];

  return (
    <>
      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-sm font-semibold">Worker</h1>
      </header>

      <div className="p-4 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Daftar Worker</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Kelola data pekerja/sales yang membantu penjualan unit.
            </p>
          </div>
          <Button asChild>
            <Link href="/worker/create">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Worker
            </Link>
          </Button>
        </div>

        {workers.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <HardHat className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Belum ada data worker.
            </p>
          </div>
        ) : (
          <WorkerListClient workers={workers} />
        )}
      </div>
    </>
  );
}
