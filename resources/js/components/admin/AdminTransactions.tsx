import { CreditCard, Download, ArrowUpRight, Wallet } from 'lucide-react';
import React from 'react';
import { fmtIDR } from '@/components/cozqta/data';
import { Btn, Badge, SearchableSelect } from '@/components/cozqta/primitives';

function escapeExcelValue(value: unknown): string {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatTransactionDate(value: string | null | undefined): string {
    if (!value) {
        return '-';
    }

    return new Date(value).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function downloadTransactionsExcel(transactions: any[]): void {
    const paidTransactions = transactions.filter(
        (transaction) => transaction.status === 'Paid',
    );
    const totalRevenue = paidTransactions.reduce(
        (sum, transaction) =>
            sum + Number(transaction.amount || transaction.grand_total || 0),
        0,
    );
    const rows = transactions
        .map((transaction, index) => {
            const amount = Number(
                transaction.amount || transaction.grand_total || 0,
            );
            const status =
                transaction.status === 'Paid'
                    ? 'Berhasil'
                    : transaction.status === 'Pending'
                      ? 'Menunggu'
                      : 'Gagal/Batal';

            return `<tr>
        <td class="center">${index + 1}</td>
        <td><strong>TRX-${escapeExcelValue(transaction.id)}</strong><br><span class="muted">${escapeExcelValue(formatTransactionDate(transaction.created_at))}</span></td>
        <td><strong>${escapeExcelValue(transaction.booking?.tenant?.name || 'Unknown')}</strong><br><span class="muted">${escapeExcelValue(transaction.booking?.tenant?.email || '-')}</span></td>
        <td><strong>${escapeExcelValue(transaction.booking?.branch?.name || '-')}</strong><br><span class="muted">${escapeExcelValue(transaction.booking?.room_type?.type_name || '-')}</span></td>
        <td class="center">${escapeExcelValue(transaction.payment_method || 'Menunggu')}</td>
        <td class="amount" data-format="Rp #,##0">${amount}</td>
        <td class="status ${status === 'Berhasil' ? 'success' : status === 'Menunggu' ? 'warning' : 'danger'}">${status}</td>
      </tr>`;
        })
        .join('');
    const generatedAt = formatTransactionDate(new Date().toISOString());
    const workbook = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8"><style>
  body { font-family: Calibri, Arial, sans-serif; color: #172033; }
  .title { background: #123b5d; color: #ffffff; font-size: 18pt; font-weight: bold; padding: 16px; }
  .subtitle { color: #64748b; font-size: 10pt; padding: 8px 0 14px; }
  .summary-label { background: #e8f6ef; color: #166534; font-weight: bold; padding: 10px; }
  .summary-value { background: #e8f6ef; color: #15803d; font-weight: bold; padding: 10px; }
  table { border-collapse: collapse; width: 100%; }
  th { background: #123b5d; color: #ffffff; font-weight: bold; text-align: left; padding: 10px; border: 1px solid #d7e0e8; }
  td { padding: 9px 10px; border: 1px solid #d7e0e8; vertical-align: top; }
  tr:nth-child(even) td { background: #f7fafc; }
  .center { text-align: center; }
  .amount { text-align: right; font-weight: bold; mso-number-format: "Rp #,##0"; }
  .muted { color: #64748b; font-size: 9pt; }
  .status { font-weight: bold; text-align: center; }
  .success { color: #15803d; background: #dcfce7 !important; }
  .warning { color: #a16207; background: #fef3c7 !important; }
  .danger { color: #b91c1c; background: #fee2e2 !important; }
</style></head><body>
  <table><tr><td colspan="7" class="title">Laporan Transaksi Global</td></tr>
  <tr><td colspan="7" class="subtitle">Dibuat pada ${escapeExcelValue(generatedAt)} | Total ${transactions.length} transaksi</td></tr>
  <tr><td colspan="2" class="summary-label">Total Pendapatan (Status Lunas)</td><td colspan="5" class="summary-value" data-format="Rp #,##0">${totalRevenue}</td></tr></table>
  <br>
  <table><colgroup><col width="55"><col width="145"><col width="190"><col width="170"><col width="120"><col width="125"><col width="110"></colgroup>
    <thead><tr><th>No</th><th>ID Transaksi / Tanggal</th><th>Penyewa</th><th>Cabang &amp; Kamar</th><th>Metode Pembayaran</th><th>Nominal</th><th>Status</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="7" class="center">Belum ada transaksi.</td></tr>'}</tbody>
  </table>
</body></html>`;
    const blob = new Blob([workbook], {
        type: 'application/vnd.ms-excel;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laporan-transaksi-${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

export default function AdminTransactions({
    transactions,
}: {
    transactions: any[];
}) {
    const totalRevenue =
        transactions
            ?.filter((t) => t.status === 'Paid')
            .reduce((sum, t) => sum + Number(t.amount || t.grand_total), 0) ||
        0;

    return (
        <div className="animate-fade-in mx-auto w-full max-w-7xl space-y-6">
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-green-50 p-4 text-green-600">
                        <CreditCard size={28} />
                    </div>
                    <div>
                        <h2 className="text-xl leading-tight font-bold text-slate-900">
                            Laporan Transaksi Global
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Total Pendapatan (Status Lunas):{' '}
                            <span className="font-bold text-green-600">
                                {fmtIDR(totalRevenue)}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="w-40">
                        <SearchableSelect
                            value="this_month"
                            onChange={() => {}}
                            options={[
                                { label: 'Bulan Ini', value: 'this_month' },
                                { label: 'Bulan Lalu', value: 'last_month' },
                                { label: 'Tahun Ini', value: 'this_year' },
                                { label: 'Semua Waktu', value: 'all' },
                            ]}
                        />
                    </div>
                    <Btn
                        variant="outline"
                        onClick={() =>
                            downloadTransactionsExcel(transactions || [])
                        }
                        disabled={!transactions?.length}
                        title={
                            transactions?.length
                                ? 'Unduh laporan transaksi dalam format Excel'
                                : 'Belum ada transaksi untuk diekspor'
                        }
                    >
                        <Download size={16} className="mr-1.5" /> Export Excel
                    </Btn>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-100 bg-slate-50 font-medium text-slate-600">
                            <tr>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    No
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    ID Transaksi / Tgl
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Penyewa
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Cabang & Kamar
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Metode Pembayaran
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Nominal
                                </th>
                                <th className="px-6 py-4 whitespace-nowrap">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transactions?.length > 0 ? (
                                transactions.map((trx: any, index: number) => (
                                    <tr
                                        key={trx.id}
                                        className="transition-colors hover:bg-slate-50/50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1 font-bold text-slate-900">
                                                TRX-{trx.id}
                                                {trx.status === 'Paid' && (
                                                    <ArrowUpRight
                                                        size={14}
                                                        className="text-green-500"
                                                    />
                                                )}
                                            </div>
                                            <div className="mt-0.5 text-xs text-slate-500">
                                                {formatTransactionDate(
                                                    trx.created_at,
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">
                                                {trx.booking?.tenant?.name ||
                                                    'Unknown'}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {trx.booking?.tenant?.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-800">
                                                {trx.booking?.branch?.name ||
                                                    '-'}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {trx.booking?.room_type
                                                    ?.type_name || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-bold tracking-wider text-slate-700 uppercase">
                                                {trx.payment_method ||
                                                    'Menunggu'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold whitespace-nowrap text-slate-900">
                                            {fmtIDR(
                                                trx.amount || trx.grand_total,
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {trx.status === 'Paid' ? (
                                                <Badge variant="success">
                                                    Berhasil
                                                </Badge>
                                            ) : trx.status === 'Pending' ? (
                                                <Badge variant="warning">
                                                    Menunggu
                                                </Badge>
                                            ) : (
                                                <Badge variant="danger">
                                                    Gagal/Batal
                                                </Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-slate-500"
                                    >
                                        <Wallet
                                            size={40}
                                            className="mx-auto mb-3 text-slate-300"
                                        />
                                        Belum ada riwayat transaksi.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
