import ErrorBoundaryProvider from "utlis/library/helpers/error-handler/ErrorBoundaryProvider";
import FallBackUI from "components/fallback-ui";
import { ConfigProvider, theme as antdTheme } from "antd";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "store/store";
import AppLocale from "utlis/config/translation";
import { IntlProvider } from "react-intl";
import { useEffect, useLayoutEffect } from "react";
import ToastProvider from "components/ToastProvider/index";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
//import axios from "axios"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import instance from "utlis/library/helpers/axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/layout";
import Index from "./pages/page";
import Login from "./pages/login/page";
import AdminDashboardLayout from "./pages/dashboard/(admin)/layout";
import MinisterAttendance from "./pages/dashboard/(minister)/minister-attendance/page";
import ParentHome from "./pages/dashboard/(parent)/parent-home/page";
import DisciplineStatistics from "./pages/dashboard/(admin)/admin-home/page";
import MinisterHome from "./pages/dashboard/(minister)/minister-home/page";
import ExcuseStatus from "./pages/dashboard/(parent)/excuse-status/excuse-status";
import PayFines from "./pages/dashboard/(parent)/pay-fines/pay-fines";
import Students from "./pages/dashboard/(parent)/student/page";
import NewExcuse from "./pages/dashboard/(parent)/new-excuse/page";
import actions from "store/auth/actions";
import ProtectedRoute from "components/protected-route/ProtectedRoute";
import AdminHome from "./pages/dashboard/(admin)/admin-home/page";
import Unauthorized from "./pages/dashboard/unauthorized/page";
import PrivateRoute from "components/PrivateRoute/PrivateRoute";
import ParentDashboardLayout from "./pages/dashboard/(parent)/layout";
import MinisterDashboardLayout from "./pages/dashboard/(minister)/layout";
import MinisterAbsent from "./pages/dashboard/(minister)/minister-absent/page";
import MinisterExcuse from "./pages/dashboard/(minister)/minister-excuse/excuse";
import MinisterLate from "./pages/dashboard/(minister)/minister-late/page";
import AdminAttendance from "./pages/dashboard/(admin)/admin-attendance/page";
import AdminAbsent from "./pages/dashboard/(admin)/admin-absent/page";
import AdminExcuse from "./pages/dashboard/(admin)/admin-excuse/excuse";
import AdminLate from "./pages/dashboard/(admin)/admin-late/page";
import ManagerHome from "./pages/dashboard/(manager)/manager-home/page";
import ManagerDashboardLayout from "./pages/dashboard/(manager)/layout";
import ManagerStudents from "./pages/dashboard/(manager)/student/page";
import PayTotalFines from "./pages/dashboard/(parent)/pay-totalFines/pay-totalFines";
import ManagerBalance from "./pages/dashboard/(manager)/manager-monitor/page";
import AdminMonitor from "./pages/dashboard/(admin)/admin-monitor/page";
import ParentContact from "./pages/dashboard/(parent)/parent-contact/page";
import ManagerContact from "./pages/dashboard/(manager)/manager-contact/page";
import AdminContactPage from "./pages/dashboard/(admin)/admin-contact/page";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },

  {
    path: "/",
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      { path: "", element: <Index /> },

      {
        path: "admin",
        element: <ProtectedRoute allowedRoles={[1]} />,
        children: [
          {
            element: <AdminDashboardLayout />,
            children: [
              { path: "home", element: <AdminHome /> },
              { path: "attendance", element: <AdminAttendance /> },
              { path: "absent", element: <AdminAbsent /> },
              { path: "excuse", element: <AdminExcuse /> },
              { path: "late", element: <AdminLate /> },
              { path: "openmonitoring", element: <AdminMonitor /> },
              { path: "contacts", element: <AdminContactPage /> },
            ],
          },
        ],
      },

      {
        path: "minister",
        element: <ProtectedRoute allowedRoles={[2]} />,
        children: [
          {
            element: <MinisterDashboardLayout />,
            children: [
              { path: "home", element: <MinisterHome /> },
              { path: "attendance", element: <MinisterAttendance /> },
              { path: "absent", element: <MinisterAbsent /> },
              { path: "excuse", element: <MinisterExcuse /> },
              { path: "late", element: <MinisterLate /> },
            ],
          },
        ],
      },

      {
        path: "manager",
        element: <ProtectedRoute allowedRoles={[3]} />,
        children: [
          {
            element: <ManagerDashboardLayout />,
            children: [
              { path: "home", element: <ManagerHome /> },
              { path: "student/:id", element: <ManagerStudents /> },
              { path: "openmonitoring", element: <ManagerBalance /> },
              { path: "contact", element: <ManagerContact /> },
            ],
          },
        ],
      },

      {
        path: "parent",
        element: <ProtectedRoute allowedRoles={[4]} />,
        children: [
          {
            element: <ParentDashboardLayout />,
            children: [
              { path: "home", element: <ParentHome /> },
              { path: "student/:id", element: <Students /> },
              { path: "student/:id/excuses/:id", element: <ExcuseStatus /> },
              { path: "student/:id/pay-fines", element: <PayFines /> },
              { path: "pay-total-fines", element: <PayTotalFines /> },
              { path: "new-excuse", element: <NewExcuse /> },
              { path: "contact", element: <ParentContact /> },
            ],
          },
        ],
      },
    ],
  },
]);

type Locale = keyof typeof AppLocale;
const queryClient = new QueryClient();

function AppProvider() {
  const dispatch = useDispatch();
  const dir = "rtl";

  const { login } = actions;
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(login(token, null as any));
    }
  }, [dispatch]);

  return (
    <ErrorBoundaryProvider fallBackUIComponent={<FallBackUI />}>
      <ConfigProvider
        direction="rtl"
        theme={{
          // algorithm: antdTheme[isDark ? 'darkAlgorithm' : 'defaultAlgorithm'],
          token: {
            colorPrimary: "#209163",
            // colorPrimaryBg: "#3730a3",
            // colorBorder: "#3730a3",

            colorLink: "#209163",
            colorInfo: "#209163",
          },
        }}
      >
        {/* <RoutersProvider /> */}
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />

          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <ToastProvider />
      </ConfigProvider>
    </ErrorBoundaryProvider>
  );
}
function MainProvider() {
  return (
    <Provider store={store}>
      <AppProvider />
    </Provider>
  );
}

export default MainProvider;
