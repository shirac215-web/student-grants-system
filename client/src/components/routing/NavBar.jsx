import { NavLink, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar({ auth }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';
  const isAuthenticated = Boolean(auth?.user);
  const isAdmin = auth?.user?.role === 'admin';

  const handleLogout = () => {
    auth?.logout?.();
    navigate('/');
  };

  const displayName = auth?.user
    ? `${auth.user.firstName ?? ''} ${auth.user.lastName ?? ''}`.trim()
    : '';

  const initials = auth?.user
    ? `${auth.user.firstName?.[0] ?? ''}${auth.user.lastName?.[0] ?? ''}`.toUpperCase() || 'סט'
    : 'סט';

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 px-8 py-5 border-b border-[#122843]/50 bg-[#071325]">
      <div className="flex items-center gap-3">
        <div className="bg-[#1f4ea8] p-2.5 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          </svg>
        </div>
        <span className="font-bold text-xl text-white">מערכת מענקים</span>
      </div>

      {!isLanding && (
        <div className="hidden md:flex gap-6 text-base">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `transition px-5 py-2 rounded-full font-medium ${
                isActive ? 'bg-[#1f4ea8]/20 text-[#E5DED0]' : 'text-[#cbd5ea] hover:text-white'
              }`
            }
          >
            דף הבית
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              `transition px-5 py-2 rounded-full font-medium ${
                isActive ? 'bg-[#1f4ea8]/20 text-[#E5DED0]' : 'text-[#cbd5ea] hover:text-white'
              }`
            }
          >
            הרשמה
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/admin-requests"
              className={({ isActive }) =>
                `transition px-5 py-2 rounded-full font-medium ${
                  isActive ? 'bg-[#1f4ea8]/20 text-[#E5DED0]' : 'text-[#cbd5ea] hover:text-white'
                }`
              }
            >
              ניהול בקשות
            </NavLink>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        {!isAuthenticated ? (
          <button
            onClick={() => navigate('/login')}
            className="transition rounded-full bg-[#0d2544] px-5 py-2 text-base font-medium text-white hover:bg-[#163a71]"
          >
            התחברות
          </button>
        ) : (
          <>
            <button
              onClick={handleLogout}
              className="text-base bg-[#0d2544] hover:bg-[#163a71] text-white px-5 py-2 rounded-lg border border-[#1f4ea8] transition"
            >
              יציאה
            </button>
            <div className="flex items-center gap-3 rounded-full bg-[#0d2544]/70 px-4 py-2 border border-[#1f4ea8]">
              <span className="text-base font-medium text-white">{displayName}</span>
              <div className="bg-[#1f4ea8] text-white text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full">
                {initials}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
