import sys
import re

file_path = 'resources/js/components/admin/AdminInlineModules.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. AdminRooms
old_h1 = '<tr>{["Kamar", "Gedung", "Lantai", "Harga", "Tipe", "Fasilitas", "Status", "Aksi"].map(h => ('
new_h1 = '<tr>{["No", "Kamar", "Gedung", "Lantai", "Harga", "Tipe", "Fasilitas", "Status", "Aksi"].map(h => ('
content = content.replace(old_h1, new_h1)

old_r1 = '{filtered.map(r => ('
new_r1 = '{filtered.map((r, index) => ('
content = content.replace(old_r1, new_r1)

old_d1 = '<tr key={r.id} className="hover:bg-slate-50 transition-colors">\n                  <td className="px-4 py-3">\n                    <div className="flex items-center gap-3">'
new_d1 = '<tr key={r.id} className="hover:bg-slate-50 transition-colors">\n                  <td className="px-4 py-3 text-sm text-slate-500">{index + 1}</td>\n                  <td className="px-4 py-3">\n                    <div className="flex items-center gap-3">'
content = content.replace(old_d1, new_d1)

# 2. AdminTenants
old_h2 = '<tr>{["Penghuni", "Kamar", "Mulai Sewa", "Selesai", "Status", "Aksi"].map(h => ('
new_h2 = '<tr>{["No", "Penghuni", "Kamar", "Mulai Sewa", "Selesai", "Status", "Aksi"].map(h => ('
content = content.replace(old_h2, new_h2)

old_r2 = '{filtered.map(t => ('
new_r2 = '{filtered.map((t, index) => ('
content = content.replace(old_r2, new_r2)

old_d2 = '<tr key={t.id} className="hover:bg-slate-50 transition-colors">\n                <td className="px-4 py-3">\n                  <div className="flex items-center gap-3">'
new_d2 = '<tr key={t.id} className="hover:bg-slate-50 transition-colors">\n                <td className="px-4 py-3 text-sm text-slate-500">{index + 1}</td>\n                <td className="px-4 py-3">\n                  <div className="flex items-center gap-3">'
content = content.replace(old_d2, new_d2)

# 3. AdminPayments
old_h3 = '<tr>{["ID", "Penghuni", "Kamar", "Jumlah", "Metode", "Tanggal", "Status", "Aksi"].map(h => ('
new_h3 = '<tr>{["No", "ID", "Penghuni", "Kamar", "Jumlah", "Metode", "Tanggal", "Status", "Aksi"].map(h => ('
content = content.replace(old_h3, new_h3)

old_r3 = '{TRANSACTIONS.map(t => ('
new_r3 = '{TRANSACTIONS.map((t, index) => ('
content = content.replace(old_r3, new_r3)

old_d3 = '<tr key={t.id} className="hover:bg-slate-50 transition-colors">\n                <td className="px-4 py-3 text-xs font-mono text-slate-500">{t.id}</td>'
new_d3 = '<tr key={t.id} className="hover:bg-slate-50 transition-colors">\n                <td className="px-4 py-3 text-sm text-slate-500">{index + 1}</td>\n                <td className="px-4 py-3 text-xs font-mono text-slate-500">{t.id}</td>'
content = content.replace(old_d3, new_d3)

# 4. AdminSocialLinks
old_open_social = '<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">\n          <h3 className="font-bold text-sm text-slate-800">Daftar Social Media Terdaftar</h3>\n          <span className="text-xs text-slate-400">{social.length} item</span>\n        </div>\n        <table className="w-full">'
new_open_social = '<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">\n          <h3 className="font-bold text-sm text-slate-800">Daftar Social Media Terdaftar</h3>\n          <span className="text-xs text-slate-400">{social.length} item</span>\n        </div>\n        <div className="overflow-x-auto pb-2">\n          <table className="w-full">'
content = content.replace(old_open_social, new_open_social)

old_close_social = '          </tbody>\n        </table>\n      </div>\n    </div>'
new_close_social = '          </tbody>\n          </table>\n        </div>\n      </div>\n    </div>'
content = content.replace(old_close_social, new_close_social)

old_h4 = '<tr>\n              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Platform & Icon</th>'
new_h4 = '<tr>\n              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">No</th>\n              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Platform & Icon</th>'
content = content.replace(old_h4, new_h4)

old_span_social = '<td colSpan={5} className="p-8 text-center text-sm text-slate-400">'
new_span_social = '<td colSpan={6} className="p-8 text-center text-sm text-slate-400">'
content = content.replace(old_span_social, new_span_social)

old_r4 = ') : social.map(item => ('
new_r4 = ') : social.map((item, index) => ('
content = content.replace(old_r4, new_r4)

old_d4 = '<tr key={item.id} className="hover:bg-slate-50 transition-colors">\n                <td className="px-4 py-3">\n                  <div className="flex items-center gap-3">'
new_d4 = '<tr key={item.id} className="hover:bg-slate-50 transition-colors">\n                <td className="px-4 py-3 text-sm text-slate-500">{index + 1}</td>\n                <td className="px-4 py-3">\n                  <div className="flex items-center gap-3">'
content = content.replace(old_d4, new_d4)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')
