import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// תרגום ערכים מהמסד לתצוגה
const FIELD_LABELS = {
  'Computer Science': 'מדעי המחשב',
  Engineering: 'הנדסת תוכנה',
  Math: 'מתמטיקה',
  Other: 'אחר',
};

const STATUS = {
  pending:  { label: 'ממתין לטיפול', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  approved: { label: 'אושרה',        color: 'bg-green-100 text-green-700 border-green-300' },
  rejected: { label: 'נדחתה',        color: 'bg-red-100 text-red-700 border-red-300' },
};

const FILTERS = [
  { key: 'all', label: 'הכל' },
  { key: 'pending', label: 'ממתינות' },
  { key: 'approved', label: 'אושרו' },
  { key: 'rejected', label: 'נדחו' },
];

// דף מנהל: רשימת כל הבקשות במערכת, עם חיפוש וסינון לפי סטטוס
export default function AdminRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('scholarshipAppToken');
    fetch('/api/requests', { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'שגיאה בטעינת הבקשות');
        return data;
      })
      .then((data) => setRequests(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // מונים לכל סטטוס, לכרטיסי הסיכום
  const counts = useMemo(() => {
    const c = { all: requests.length, pending: 0, approved: 0, rejected: 0 };
    requests.forEach((r) => { c[r.status] = (c[r.status] || 0) + 1; });
    return c;
  }, [requests]);

  // סינון לפי סטטוס וחיפוש לפי שם או ת"ז
  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return requests.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (!term) return true;
      const name = `${r.userSnapshot?.firstName || ''} ${r.userSnapshot?.lastName || ''}`.toLowerCase();
      return name.includes(term) || (r.userSnapshot?.nationalId || '').includes(term);
    });
  }, [requests, search, statusFilter]);

  if (loading) {
    return <div className="min-h-screen bg-[#ece6db] flex items-center justify-center text-[#0c1e36]">טוען בקשות...</div>;
  }
  if (error) {
    return <div className="min-h-screen bg-[#ece6db] flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className="bg-[#ece6db] min-h-screen text-[#0d1b2a]" dir="rtl">
      <main className="max-w-[1100px] mx-auto px-6 py-12">
        <header className="mb-8">
          <p className="text-[#0c1e36]/60 text-[15px]">שלום, מנהל המערכת 👋</p>
          <h1 className="text-[28px] font-bold text-[#0c1e36]">ניהול בקשות מענק</h1>
        </header>

        {/* כרטיסי סיכום */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatusFilter(key)}
              className={`text-right bg-white border rounded-[16px] p-5 transition-all ${
                statusFilter === key ? 'border-[#0c1e36] shadow-md' : 'border-[#0c1e36]/10 hover:border-[#0c1e36]/30'
              }`}
            >
              <div className="text-[13px] text-[#0c1e36]/60">{label}</div>
              <div className="text-[28px] font-bold text-[#0c1e36]">{counts[key] || 0}</div>
            </button>
          ))}
        </div>

        {/* חיפוש */}
        <div className="mb-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש לפי שם או מספר זהות..."
            className="w-full md:w-[360px] bg-white border border-[#0c1e36]/20 rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:border-[#0c1e36]"
          />
        </div>

        {/* טבלת הבקשות */}
        <div className="bg-white border border-[#0c1e36]/10 rounded-[20px] shadow-sm overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead className="bg-[#0c1e36]/5 text-[#0c1e36]/70">
              <tr>
                <th className="text-right font-semibold px-5 py-4">שם הסטודנט</th>
                <th className="text-right font-semibold px-5 py-4">מספר זהות</th>
                <th className="text-right font-semibold px-5 py-4">מוסד ומגמה</th>
                <th className="text-right font-semibold px-5 py-4">תאריך הגשה</th>
                <th className="text-right font-semibold px-5 py-4">סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => {
                const status = STATUS[r.status] || STATUS.pending;
                return (
                  <tr
                    key={r._id}
                    onClick={() => navigate(`/admin-requests/${r._id}`)}
                    className="border-t border-[#0c1e36]/5 hover:bg-[#ece6db]/50 cursor-pointer transition"
                  >
                    <td className="px-5 py-4 font-medium">
                      {`${r.userSnapshot?.firstName || ''} ${r.userSnapshot?.lastName || ''}`.trim() || '-'}
                    </td>
                    <td className="px-5 py-4">{r.userSnapshot?.nationalId || '-'}</td>
                    <td className="px-5 py-4">
                      {r.education?.institution || '-'}
                      <span className="block text-[12px] text-[#0c1e36]/50">
                        {FIELD_LABELS[r.education?.field] || r.education?.field || ''}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString('he-IL') : '-'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[12px] font-semibold border rounded-[8px] px-3 py-1 ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {visible.length === 0 && (
            <p className="text-center text-[#0c1e36]/50 py-10">לא נמצאו בקשות</p>
          )}
        </div>
      </main>
    </div>
  );
}
