"use client";

import { Button } from "@/components/ui/button";
import { UNIT_PAYMENT_TYPE_CONFIG } from "@/constants/unit";
import type { PaymentType } from "@prisma/client";
import { Printer } from "lucide-react";
import Image from "next/image";
import styles from "./receipt-print-button.module.css";

interface StoreInformation {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeLogo: string | null;
  footNoteReceipt: string | null;
}

interface ReceiptUnitData {
  id: number;
  name: string;
  imei: string | null;
  soldAt: string | null;
  soldPrice: number | null;
  dpAmount: number | null;
  paymentType: PaymentType | null;
  customer: { name: string; phone: string | null };
  worker: { name: string } | null;
  workerFee: number | null;
}

interface Props {
  unit: ReceiptUnitData;
  storeInformation: StoreInformation;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDateTime(value: string | null): string {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function UnitReceiptPrintButton({ unit, storeInformation }: Props) {
  const soldPrice = unit.soldPrice ?? 0;
  const dpAmount = unit.dpAmount ?? 0;
  const remaining = Math.max(soldPrice - dpAmount, 0);
  const paymentTypeLabel = unit.paymentType
    ? UNIT_PAYMENT_TYPE_CONFIG[unit.paymentType].label
    : "-";
  const footNote = storeInformation.footNoteReceipt?.trim();

  return (
    <div className={styles.root}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={styles.noPrint}
        onClick={() => window.print()}
      >
        <Printer className="mr-2 h-4 w-4" />
        Cetak Receipt
      </Button>

      <div id="unit-receipt-print-area" className={styles.printArea} aria-hidden>
        <article className={styles.receipt}>
          <div className={styles.center}>
            {storeInformation.storeLogo && (
              <Image
                src={storeInformation.storeLogo}
                alt="Logo toko"
                className={styles.logo}
                width={220}
                height={140}
              />
            )}
            <h3 className={styles.storeName}>{storeInformation.storeName}</h3>
            <p className={styles.textMuted}>{storeInformation.storeAddress}</p>
            <p className={styles.textMuted}>Telp: {storeInformation.storePhone}</p>
          </div>

          <div className={styles.divider} />

          <div className={styles.row}>
            <span className={styles.rowLabel}>No Receipt</span>
            <span className={styles.rowValue}>#{unit.id}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Tanggal</span>
            <span className={styles.rowValue}>{formatDateTime(unit.soldAt)}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Pelanggan</span>
            <span className={styles.rowValue}>{unit.customer.name}</span>
          </div>
          {unit.customer.phone && (
            <div className={styles.row}>
              <span className={styles.rowLabel}>No HP</span>
              <span className={styles.rowValue}>{unit.customer.phone}</span>
            </div>
          )}

          <div className={styles.divider} />

          <p className={styles.itemName}>{unit.name}</p>
          {unit.imei && <p className={styles.textMuted}>IMEI: {unit.imei}</p>}

          <div className={styles.divider} />

          <div className={styles.row}>
            <span className={styles.rowLabel}>Metode Bayar</span>
            <span className={styles.rowValue}>{paymentTypeLabel}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Total</span>
            <span className={styles.rowValue}>{formatCurrency(soldPrice)}</span>
          </div>
          {dpAmount > 0 && (
            <>
              <div className={styles.row}>
                <span className={styles.rowLabel}>DP</span>
                <span className={styles.rowValue}>{formatCurrency(dpAmount)}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>Sisa</span>
                <span className={styles.rowValue}>{formatCurrency(remaining)}</span>
              </div>
            </>
          )}
          {/* {unit.worker && (
            <div className={styles.row}>
              <span className={styles.rowLabel}>Worker</span>
              <span className={styles.rowValue}>{unit.worker.name}</span>
            </div>
          )}
          {unit.workerFee !== null && (
            <div className={styles.row}>
              <span className={styles.rowLabel}>Fee Worker</span>
              <span className={styles.rowValue}>{formatCurrency(unit.workerFee)}</span>
            </div>
          )} */}

          <div className={styles.divider} />

          <p className={styles.footer}>
            {footNote || "Terima kasih sudah berbelanja."}
          </p>
        </article>
      </div>
    </div>
  );
}
