import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface Props {
  allowedRoles: number[];
}

export default function ProtectedRoute({ allowedRoles }: Props) {
  // const { token, role } = useSelector((state: any) => state.Auth);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!token || role === null) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(parseInt(role))) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
