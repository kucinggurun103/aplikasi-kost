import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Search, Plus, Upload, X, Edit2, Calendar } from 'lucide-react';
import { Btn, Badge, SearchableSelect } from '@/components/cozqta/primitives';
import { fmtIDR } from '@/components/cozqta/data';

import Swal from 'sweetalert2';

export default function AdminBookings({ bookings, branches, roomTypes, users }: { bookings: any[], branches: any[], roomTypes: any[], users: any[] }) {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  
  // Modals state
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  const [isManualPayOpen, setIsManualPayOpen] = useState(false);
  const [payBookingId, setPayBookingId] = useState<number | null>(null);
  const [payPaymentId, setPayPaymentId] = useState<number | null>(null);
  const [chkDp, setChkDp] = useState(false);
  const [chkDeposit, setChkDeposit] = useState(false);
  const [chkCf, setChkCf] = useState(false);
  
  // Invoices Modal
  const [isInvoicesModalOpen, setIsInvoicesModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<any>(null);

  // Image Preview Modal
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Manual Booking Branch Filter
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');

  const { data: bookingData, setData: setBookingData, post: postBooking, processing: bookingProcessing, errors: bookingErrors, reset: resetBooking } = useForm({
    tenant_id: '',
    room_type_id: '',
    check_in_date: '',
    rent_type: 'Monthly',
    duration_month: '1',
    duration_days: '1',
    custom_price: '',
    payment_proof: null as File | null
  });

  // Calculate checkout date based on form state
  const getCheckoutDate = () => {
    if (!bookingData.check_in_date) return '-';
    const checkIn = new Date(bookingData.check_in_date || Date.now());
    if (bookingData.rent_type === 'Monthly') {
      checkIn.setMonth(checkIn.getMonth() + parseInt(bookingData.duration_month || '1'));
    } else {
      checkIn.setDate(checkIn.getDate() + parseInt(bookingData.duration_days || '1'));
    }
    return checkIn.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Manual Pay Form
  const { data: payData, setData: setPayData, post: postPay, processing: payProcessing, errors: payErrors, reset: resetPay } = useForm({
    payment_proof: null as File | null,
    payment_id: '' as string | number,
  });

  const updateStatus = async (bookingId: number, status: string) => {
    const result = await Swal.fire({
      title: 'Konfirmasi',
      text: `Ubah status booking menjadi ${status}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Ubah Status',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      router.put(`/admin/transactions/bookings/${bookingId}/status`, { status }, {
        preserveScroll: true,
        onSuccess: () => {
          Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Status booking berhasil diubah.',
            timer: 2000,
            showConfirmButton: false
          });
        }
      });
    }
  };



  const submitManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    postBooking('/admin/transactions/bookings/manual', {
      preserveScroll: true,
      onSuccess: () => {
        setIsManualBookingOpen(false);
        resetBooking();
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Booking manual berhasil dibuat.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const submitManualPay = (e: React.FormEvent) => {
    e.preventDefault();
    postPay(`/admin/transactions/bookings/${payBookingId}/manual-pay`, {
      preserveScroll: true,
      onSuccess: () => {
        setIsManualPayOpen(false);
        resetPay();
        setPayBookingId(null);
        setPayPaymentId(null);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Pembayaran manual berhasil diproses.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const openInvoicesModal = (booking: any) => {
    setCurrentBooking(booking);
    setIsInvoicesModalOpen(true);
  };

  const openManualPayForInvoice = (bookingId: number, paymentId: number) => {
    setPayBookingId(bookingId);
    setPayPaymentId(paymentId);
    setPayData('payment_id', paymentId);
    setChkDp(false);
    setChkDeposit(false);
    setChkCf(false);
    setIsManualPayOpen(true);
  };

  // (Removed openManualPay)

  const getStatusBadge = (status: string, paymentStatus: string) => {
    switch(status) {
      case 'Pending': return <Badge variant="warning">Menunggu Konfirmasi</Badge>;
      case 'Confirmed': return paymentStatus !== 'Paid' ? <Badge variant="success">Di-Acc (Menunggu Pembayaran)</Badge> : <Badge variant="success">Terkonfirmasi (Lunas)</Badge>;
      case 'Checked In': return <Badge variant="success">Aktif (Check-in)</Badge>;
      case 'Completed': return <Badge variant="outline">Selesai</Badge>;
      case 'Cancelled': return <Badge variant="danger">Dibatalkan</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const tenantUsers = users?.filter((u: any) => {
    const roles = u.roles || [];
    if (roles.some((r: any) => r.code === 'penghuni' || r.name === 'Penghuni')) return true;
    if (!roles.some((r: any) => r.code === 'admin' || r.code === 'operator')) return true;
    return false;
  }) || [];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 animate-fade-in relative">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Cari pemesanan..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <Btn variant="primary" size="sm" onClick={() => setIsManualBookingOpen(true)}>
          <Plus size={14} /> Booking Manual
        </Btn>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">No</th>
                <th className="px-6 py-4 whitespace-nowrap">ID Booking</th>
                <th className="px-6 py-4 whitespace-nowrap">Penyewa</th>
                <th className="px-6 py-4 whitespace-nowrap">Kamar / Cabang</th>
                <th className="px-6 py-4 whitespace-nowrap">Tanggal Check-in</th>
                <th className="px-6 py-4 whitespace-nowrap">Total Harga</th>
                <th className="px-6 py-4 whitespace-nowrap">Status Pembayaran</th>
                <th className="px-6 py-4 whitespace-nowrap">Status Booking</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings?.length > 0 ? bookings.map((booking: any, index: number) => (
                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-indigo-600">{booking.booking_no}</div>
                    <div className="text-xs text-slate-500">{booking.created_at ? new Date(booking.created_at).toLocaleDateString() : '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{booking.tenant?.name || 'Unknown'}</div>
                    <div className="text-xs text-slate-500">{booking.tenant?.phone || booking.tenant?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{booking.room_type?.type_name || 'Tipe Kamar'}</div>
                    <div className="text-xs text-slate-500">{booking.branch?.name || '-'}</div>
                    {booking.room_unit ? (
                      <div className="mt-1 text-xs font-bold text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded">
                        Unit: {booking.room_unit.unit_number}
                      </div>
                    ) : (
                      <div className="mt-1 text-xs text-orange-500">Unit belum dialokasi</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{booking.check_in_date ? new Date(booking.check_in_date).toLocaleDateString() : '-'}</div>
                    <div className="text-xs text-slate-500">
                      {booking.rent_type === 'Daily' 
                        ? `${booking.duration_days} Hari` 
                        : `${booking.duration_month} Bulan`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                    {fmtIDR(booking.grand_total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.payment_status === 'Paid' ? (
                      <Badge variant="success">Lunas</Badge>
                    ) : booking.payment_status === 'Unpaid' ? (
                      <Badge variant="danger">Belum Dibayar</Badge>
                    ) : booking.payment_status === 'Pending' ? (
                      <Badge variant="warning">Mengecek Pembayaran</Badge>
                    ) : (
                      <Badge variant="warning">{booking.payment_status}</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking.status, booking.payment_status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openInvoicesModal(booking)} className="text-xs bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 font-medium transition-colors border border-slate-200">
                        Lihat Tagihan
                      </button>
                      
                      {booking.status === 'Confirmed' && booking.payment_status === 'Paid' && (
                        <button onClick={() => updateStatus(booking.id, 'Checked In')} className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-100 font-medium transition-colors">
                          Check In
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                    <Calendar size={40} className="mx-auto text-slate-300 mb-3" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Booking Modal */}
      {isManualBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Buat Booking Manual</h2>
              <button onClick={() => setIsManualBookingOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={submitManualBooking} className="p-5 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pilih Penghuni (User)</label>
                <SearchableSelect 
                  value={bookingData.tenant_id}
                  onChange={val => setBookingData('tenant_id', val)}
                  options={[{label: '-- Pilih Penghuni --', value: ''}, ...tenantUsers.map((u: any) => ({ label: `${u.name} (${u.email})`, value: String(u.id) }))]}
                />
                {bookingErrors.tenant_id && <p className="text-xs text-red-500 mt-1">{bookingErrors.tenant_id}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pilih Cabang</label>
                <SearchableSelect 
                  value={selectedBranchId}
                  onChange={val => {
                    setSelectedBranchId(val);
                    setBookingData('room_type_id', ''); // reset room type when branch changes
                  }}
                  options={[{label: '-- Pilih Cabang --', value: ''}, ...branches?.map((b: any) => ({ label: b.name, value: String(b.id) }))]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tipe Kamar</label>
                <SearchableSelect 
                  value={bookingData.room_type_id}
                  onChange={val => setBookingData('room_type_id', val)}
                  options={[{label: '-- Pilih Tipe Kamar --', value: ''}, ...roomTypes?.filter((rt: any) => !selectedBranchId || String(rt.branch_id) === selectedBranchId).map((rt: any) => ({ label: `${rt.type_name} - ${rt.branch?.name}`, value: String(rt.id) }))]}
                />
                {bookingErrors.room_type_id && <p className="text-xs text-red-500 mt-1">{bookingErrors.room_type_id}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tipe Sewa</label>
                  <SearchableSelect 
                    value={bookingData.rent_type}
                    onChange={val => setBookingData('rent_type', val)}
                    options={[
                      {label: 'Bulanan', value: 'Monthly'},
                      {label: 'Harian', value: 'Daily'}
                    ]}
                  />
                  {bookingErrors.rent_type && <p className="text-xs text-red-500 mt-1">{bookingErrors.rent_type}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tanggal Check-in</label>
                  <input 
                    type="date"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={bookingData.check_in_date}
                    onChange={e => setBookingData('check_in_date', e.target.value)}
                    required
                  />
                  {bookingErrors.check_in_date && <p className="text-xs text-red-500 mt-1">{bookingErrors.check_in_date}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {bookingData.rent_type === 'Monthly' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Durasi (Bulan)</label>
                    <SearchableSelect 
                      value={bookingData.duration_month}
                      onChange={val => setBookingData('duration_month', val)}
                      options={[
                        {label: '1 Bulan', value: '1'},
                        {label: '3 Bulan', value: '3'},
                        {label: '6 Bulan', value: '6'},
                        {label: '1 Tahun', value: '12'}
                      ]}
                    />
                    {bookingErrors.duration_month && <p className="text-xs text-red-500 mt-1">{bookingErrors.duration_month}</p>}
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Durasi (Hari)</label>
                      <input 
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={bookingData.duration_days}
                        onChange={e => setBookingData('duration_days', e.target.value)}
                        required
                      />
                      {bookingErrors.duration_days && <p className="text-xs text-red-500 mt-1">{bookingErrors.duration_days}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Harga Sewa Total (Manual)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">Rp</span>
                        <input 
                          type="text"
                          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="Misal: 300.000"
                          value={bookingData.custom_price ? new Intl.NumberFormat('id-ID').format(Number(bookingData.custom_price)) : ''}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '');
                            setBookingData('custom_price', val);
                          }}
                          required
                        />
                      </div>
                      {bookingErrors.custom_price && <p className="text-xs text-red-500 mt-1">{bookingErrors.custom_price}</p>}
                    </div>
                  </>
                )}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between mt-2">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Estimasi Tanggal Check-out:</p>
                  <p className="font-semibold text-slate-900 text-sm mt-0.5">{getCheckoutDate()}</p>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <Btn variant="outline" type="button" onClick={() => setIsManualBookingOpen(false)}>Batal</Btn>
                <Btn variant="primary" type="submit" disabled={bookingProcessing}>Simpan Booking</Btn>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Pay Modal */}
      {isManualPayOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Konfirmasi Pembayaran Manual</h2>
              <button onClick={() => setIsManualPayOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitManualPay} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bukti Pembayaran (Opsional)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-indigo-500 transition-colors bg-slate-50/50 group cursor-pointer relative">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    <div className="flex text-sm text-slate-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload file</span>
                        <input id="file-upload" name="file-upload" type="file" accept="image/*,.pdf" className="sr-only" onChange={(e) => setPayData('payment_proof', e.target.files?.[0] || null)} />
                      </label>
                      <p className="pl-1">atau drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, PDF up to 2MB</p>
                    {payData.payment_proof && (
                      <p className="text-sm font-medium text-indigo-600 mt-2">{payData.payment_proof.name}</p>
                    )}
                  </div>
                </div>
                {payErrors.payment_proof && <p className="text-sm text-red-600 mt-1">{payErrors.payment_proof}</p>}
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-slate-700 mb-2">Verifikasi Admin</p>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={chkDp} onChange={e => setChkDp(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                  <span className="text-sm text-slate-700 font-medium">Saya telah memverifikasi tagihan sewa / DP (Checked DP)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={chkDeposit} onChange={e => setChkDeposit(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                  <span className="text-sm text-slate-700 font-medium">Saya telah memverifikasi nominal deposit (Checked Deposit)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={chkCf} onChange={e => setChkCf(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                  <span className="text-sm text-slate-700 font-medium">Uang telah masuk ke mutasi rekening (CF Pembayaran)</span>
                </label>
              </div>


              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsManualPayOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
                  Batal
                </button>
                <Btn type="submit" variant="primary" disabled={payProcessing || !chkDp || !chkDeposit || !chkCf}>
                  {payProcessing ? 'Menyimpan...' : 'Konfirmasi Pembayaran'}
                </Btn>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoices Modal */}
      {isInvoicesModalOpen && currentBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Rincian Tagihan (Invoices)</h2>
                <p className="text-sm text-slate-500">Booking: {currentBooking.booking_no}</p>
              </div>
              <button onClick={() => setIsInvoicesModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto">
              <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-700">No</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">No. Tagihan</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Tenggat Waktu</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Nominal</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                      <th className="px-4 py-3 font-semibold text-slate-700 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentBooking.payment_headers && currentBooking.payment_headers.length > 0 ? (
                      currentBooking.payment_headers.map((inv: any, index: number) => (
                        <tr key={inv.id}>
                          <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-medium text-slate-900">{inv.payment_no}</td>
                          <td className="px-4 py-3 text-slate-600">
                            <div className="flex items-center gap-2">
                              <span>{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '-'}</span>
                              {inv.status !== 'Paid' && (
                                <button 
                                  onClick={() => {
                                    const newDate = prompt("Ubah Tanggal Jatuh Tempo (YYYY-MM-DD):", inv.due_date.split('T')[0]);
                                    if (newDate) {
                                      router.put(`/admin/transactions/bookings/invoice/${inv.id}/due-date`, { due_date: newDate }, { preserveScroll: true });
                                    }
                                  }}
                                  className="text-slate-400 hover:text-indigo-600 transition-colors"
                                  title="Ubah Jatuh Tempo"
                                >
                                  <Edit2 size={12} />
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-indigo-600">{fmtIDR(inv.grand_total)}</td>
                          <td className="px-4 py-3">
                            {inv.status === 'Paid' ? (
                              <Badge variant="success">Lunas</Badge>
                            ) : inv.status === 'Pending' ? (
                              <Badge variant="warning">Verifikasi</Badge>
                            ) : (
                              <Badge variant="danger">Belum Lunas</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {inv.status !== 'Paid' && (
                              <button onClick={() => openManualPayForInvoice(currentBooking.id, inv.id)} className="text-xs bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg hover:bg-amber-100 font-medium transition-colors border border-amber-200">
                                Bayar Manual
                              </button>
                            )}
                            {inv.status === 'Paid' && inv.proof_of_payment && (
                              <button type="button" onClick={() => setPreviewImage(`/storage/${inv.proof_of_payment}`)} className="text-xs text-indigo-600 hover:underline inline-block mt-1 ml-2 cursor-pointer">
                                Lihat Bukti
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                          Tidak ada tagihan ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewImage(null)} className="absolute -top-10 right-0 text-white hover:text-slate-300 transition-colors bg-slate-800/50 rounded-full p-2">
              <X className="w-6 h-6" />
            </button>
            <img src={previewImage} alt="Bukti Pembayaran" className="w-auto h-auto max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain bg-white" />
          </div>
        </div>
      )}

    </div>
  );
}
