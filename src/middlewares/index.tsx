import { ExpireHandling } from "components/ExpireToken/ExpireToken";
import { useSelector } from "react-redux";
import {
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";

/* ================================
   LoggedUserCanNotOpen
================================ */
export function LoggedUserCanNotOpen(Comp: any, next: any) {
  return function Wrapped(props: any) {
    const { token } = useSelector((state: { Auth: IAuth }) => state.Auth);
    const location = useLocation();

    if (token) {
      if (location.pathname !== "/admin/home") {
        return <Navigate to="/admin/home" replace />;
      }
      return <Comp {...props} />;
    }

    return next(() => <Comp {...props} />);
  };
}

/* ================================
   PrivateRoute
================================ */
export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useSelector((state: any) => state.Auth);
  const location = useLocation();

  if (!token) {
    if (location.pathname !== "/login") {
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  return children;
}

/* ================================
   ValidateVerifyState
================================ */
export function ValidateVerifyState(Comp: any, next: any) {
  return function Wrapped(props: any) {
    const location = useLocation();
    const { from, phone, email } = location.state || {};

    if (!from || !phone || !email) {
      return <Navigate to="/404" replace />;
    }

    return next(() => <Comp {...props} />);
  };
}

/* ================================
   ValidateOtpState
================================ */
export function ValidateOtpState(Comp: any, next: any) {
  return function Wrapped(props: any) {
    const location = useLocation();
    const { from, type, value } = location.state || {};

    if (!from || !type || !value) {
      return <Navigate to="/404" replace />;
    }

    return next(() => <Comp {...props} />);
  };
}

/* ================================
   FromSignupShouldBeLoginedAndNotVerified
================================ */
export function FromSignupShouldBeLoginedAndNotVerified(Comp: any, next: any) {
  return function Wrapped(props: any) {
    const { slug } = useParams();
    const [, from] = slug.split("-");
    const { token } = useSelector((state: { Auth: IAuth }) => state.Auth);
    const isVerified = false;

    if (from === "signup" && (!token || isVerified)) {
      return <Navigate to="/404" replace />;
    }

    return next(() => <Comp {...props} />);
  };
}

/* ================================
   FromSignupShouldBeLogined
================================ */
export function FromSignupShouldBeLogined(Comp: any, next: any) {
  return function Wrapped(props: any) {
    const location = useLocation();
    const { token } = useSelector((state: { Auth: IAuth }) => state.Auth);

    if (!token || !location.state?.isDone) {
      return <Navigate to="/404" replace />;
    }

    return next(() => <Comp {...props} />);
  };
}

/* ================================
   ThereOtpAndPhoneOrEmail
================================ */
export function ThereOtpAndPhoneOrEmail(Comp: any, next: any) {
  return function Wrapped(props: any) {
    const location = useLocation();

    if (!location.state?.type || !location.state?.otp_code) {
      return <Navigate to="/404" replace />;
    }

    return next(() => <Comp {...props} />);
  };
}

/* ================================
   ExpirationTokenGuard
================================ */
export function ExpirationTokenGuard(Comp: any, next: any) {
  return function Wrapped(props: any) {
    const { status } = useSelector((state: { Auth: IAuth }) => state.Auth);

    if (status !== "EXPIRED") {
      return next(() => <Comp {...props} />);
    }

    return (
      <ExpireHandling
        msg="انتهت صلاحية الجلسة، برجاء تسجيل الدخول من جديد"
        title="انتهت الجلسة"
      />
    );
  };
}
