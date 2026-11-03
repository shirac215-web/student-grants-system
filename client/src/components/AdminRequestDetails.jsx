import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function AdminRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/requests/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('שגיאה בטעינת הבקשה');
        return res.json();
      })
      .then(data => { setRequest(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [id]);

  const handleStatus = async (status) => {
    const isApproved = status === 'approved';
    const confirm = await Swal.fire({
      title: isApproved ? 'אישור בקשה' : 'דחיית בקשה',
      text: isApproved ? 'האם אתה בטוח שברצונך לאשר את הבקשה?' : 'האם אתה בטוח שברצונך לדחות את הבקשה?',
      icon: isApproved ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0c1e36',
      cancelButtonColor: '#aaa',
      confirmButtonText: isApproved ? 'כן, אשר' : 'כן, דחה',
      cancelButtonText: 'ביטול',
    });
    if (!confirm.isConfirmed) return;
    await fetch(`/api/requests/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    await Swal.fire({
      title: isApproved ? 'הבקשה אושרה!' : 'הבקשה נדחתה',
      icon: isApproved ? 'success' : 'error',
      confirmButtonColor: '#0c1e36',
      confirmButtonText: 'אישור',
    });
    navigate('/admin-requests');
  };

  if (loading) return <div className="min-h-screen bg-[#ece6db] flex items-center justify-center text-[#0c1e36]">טוען...</div>;
  if (error) return <div className="min-h-screen bg-[#ece6db] flex items-center justify-center text-red-600">{error}</div>;

  const fullName = `${request.userSnapshot?.firstName} ${request.userSnapshot?.lastName}`;
  const birthDate = request.personal?.birthDate ? new Date(request.personal.birthDate).toLocaleDateString('he-IL') : '-';
  const createdAt = request.createdAt ? new Date(request.createdAt).toLocaleDateString('he-IL') : '-';
  const statusMap = {
    pending:  { label: 'ממתין לטיפול', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    approved: { label: 'אושרה',        color: 'bg-green-100 text-green-700 border-green-300' },
    rejected: { label: 'נדחתה',        color: 'bg-red-100 text-red-700 border-red-300' },
  };
  const statusInfo = statusMap[request.status] || statusMap.pending;

  return (
    <div className="bg-[#ece6db] min-h-screen text-[#0d1b2a] font-['Heebo']">
      <main className="max-w-[900px] mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-[28px] font-bold text-[#0c1e36]">פרטי בקשה מלאים</h2>
            <p className="text-[#0c1e36]/60 text-[15px] mt-1">בקשה מספר #{request._id?.slice(-5)} - {fullName}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className={`text-[12px] font-semibold border rounded-[8px] px-3 py-1 ${statusInfo.color}`}>{statusInfo.label}</span>
              <span className="text-[13px] text-[#0c1e36]/50">הוגשה בתאריך: {createdAt}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin-requests')}
            className="bg-white border border-[#0c1e36]/20 rounded-[10px] text-[#0c1e36] text-[14px] font-medium px-5 py-2.5 cursor-pointer hover:bg-[#0c1e36]/5 transition-all"
          >
            ← חזרה לרשימה
          </button>
        </div>

        <div className="bg-white border border-[#0c1e36]/10 rounded-[20px] shadow-sm p-8 mb-5">
          <div className="text-[14px] font-semibold text-[#0c1e36]/50 uppercase tracking-[0.5px] mb-5 pb-3 border-b border-[#0c1e36]/10">פרטים אישיים</div>
          <div className="grid grid-cols-2 gap-5">
            <Field label="מספר זהות" value={request.userSnapshot?.nationalId} />
            <Field label="שם מלא" value={fullName} />
            <Field label="תאריך לידה" value={birthDate} />
            <Field label="עיר מגורים" value={request.personal?.city} />
            <Field label="כתובת" value={request.personal?.address} />
            <Field label="טלפון נייד" value={request.personal?.mobile} />
          </div>
        </div>

        <div className="bg-white border border-[#0c1e36]/10 rounded-[20px] shadow-sm p-8 mb-5">
          <div className="text-[14px] font-semibold text-[#0c1e36]/50 uppercase tracking-[0.5px] mb-5 pb-3 border-b border-[#0c1e36]/10">פרטי משפחה</div>
          <div className="grid grid-cols-2 gap-5">
            <Field label="שם האב" value={`${request.family?.father?.firstName || ''} ${request.family?.father?.lastName || ''} (${request.family?.father?.id || '-'})`} />
            <Field label="שם האם" value={`${request.family?.mother?.firstName || ''} ${request.family?.mother?.lastName || ''} (${request.family?.mother?.id || '-'})`} />
            <Field label="מספר אחים" value={request.family?.siblings?.length ?? '-'} />
          </div>
        </div>

        <div className="bg-white border border-[#0c1e36]/10 rounded-[20px] shadow-sm p-8 mb-5">
          <div className="text-[14px] font-semibold text-[#0c1e36]/50 uppercase tracking-[0.5px] mb-5 pb-3 border-b border-[#0c1e36]/10">פרטי לימודים</div>
          <div className="grid grid-cols-2 gap-5">
            <Field label="מגמה" value={request.education?.field} />
            <Field label="מוסד לימודים" value={request.education?.institution} />
            <Field label="מספר שנות לימוד" value={request.education?.years} />
            <Field label="שכר לימוד שנתי" value={request.education?.tuition ? `₪${request.education.tuition.toLocaleString()}` : '-'} />
          </div>
        </div>

        <div className="bg-white border border-[#0c1e36]/10 rounded-[20px] shadow-sm p-8 mb-5">
          <div className="text-[14px] font-semibold text-[#0c1e36]/50 uppercase tracking-[0.5px] mb-5 pb-3 border-b border-[#0c1e36]/10">פרטי חשבון בנק</div>
          <div className="grid grid-cols-2 gap-5">
            <Field label="מ.ז בעל החשבון" value={request.bank?.ownerId} />
            <Field label="שם הבנק" value={request.bank?.bankName} />
            <Field label="מספר סניף" value={request.bank?.branch} />
            <Field label="מספר חשבון" value={request.bank?.accountNumber} />
          </div>

        </div>

        <div className="bg-white border border-[#0c1e36]/10 rounded-[20px] shadow-sm p-8 mb-5">
          <div className="text-[14px] font-semibold text-[#0c1e36]/50 uppercase tracking-[0.5px] mb-5 pb-3 border-b border-[#0c1e36]/10">מסמכים מצורפים</div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'ת.ז סטודנט', file: request.files?.studentId },
                { label: 'ת.ז אב', file: request.files?.fatherId },
                { label: 'ת.ז אם', file: request.files?.motherId },
                { label: 'אישור לימודים', file: request.files?.studyApproval },
                { label: 'אישור ניהול חשבון', file: request.files?.bankApproval },
              ].map(({ label, file }) => (
                <div key={label} className="bg-[#e9e2d5] border border-[#0c1e36]/10 rounded-[14px] text-center cursor-pointer hover:bg-[#0c1e36]/5 transition-all p-[18px]">
                  <svg className="w-8 h-8 fill-[#0c1e36] mx-auto mb-2.5" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>
                  <p className="text-[13px] text-[#0c1e36] font-medium">{label}</p>
                  <span className="text-[11px] text-[#0c1e36]/50 block mt-1">{file || '-'}</span>
                </div>
              ))}
            </div>
        </div>

        <div className="bg-white border border-[#0c1e36]/10 rounded-[20px] shadow-sm p-8">
          <div className="text-[18px] font-bold text-[#0c1e36] mb-4">החלטה על הבקשה</div>
          <div className="text-[14px] text-[#0c1e36]/60 mb-6">בחר אם לאשר או לדחות את הבקשה</div>
          <div className="flex gap-4">
            <button
              onClick={() => handleStatus('approved')}
              className="flex-1 bg-[#0c1e36] rounded-[14px] text-white text-[16px] font-bold px-4 py-4 hover:bg-[#1d3557] transition-all shadow-lg shadow-[#0c1e36]/10"
            >
              אישור בקשה
            </button>
            <button
              onClick={() => handleStatus('rejected')}
              className="flex-1 border border-[#0c1e36]/30 rounded-[14px] text-[#0c1e36] text-[16px] font-bold px-4 py-4 hover:bg-[#0c1e36]/5 transition-all"
            >
              דחיית בקשה
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-[12px] text-[#0c1e36]/60">{label}</div>
      <div className="text-[15px] font-medium">{value || '-'}</div>
    </div>
  );
}
