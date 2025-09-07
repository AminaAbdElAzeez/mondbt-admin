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
import themeSwitcherActions from "store/themeSwitcher/actions";
import instance from "utlis/library/helpers/axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/layout";
import Index from "./pages/page";
import Login from "./pages/login/page";
import DashboardLayout from "./pages/dashboard/(admin)/layout";
import Users from "./pages/dashboard/(admin)/users/page";
import Orders from "./pages/dashboard/(admin)/orders/page";
import OrderDetails from "./pages/dashboard/(admin)/orders/order";
import PrescriptionOrders from "./pages/dashboard/(admin)/prescription-orders/page";
import PrescriptionOrderDetails from "./pages/dashboard/(admin)/prescription-orders/order";
import UserDetails from "./pages/dashboard/(admin)/users/User";
import AddOrder from "./pages/dashboard/(admin)/orders/add-order";
import Statistics from "./pages/dashboard/(admin)/statistics/page";
import Products from "./pages/dashboard/(admin)/products/page";
import ProductInBranches from "./pages/dashboard/(admin)/products/product-branches";

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Index />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "admin",
        element: <DashboardLayout />,
        children: [
          {
            path: "home",
            element: <Statistics />,
          },
          // {
          //   path: "coupons",
          //   element: <Coupons />,
          // },
          // {
          //   path: "master-data",
          //   children: [
          //     {
          //       path: "categories",
          //       element: <Categories />,
          //       children: [
          //         { path: "sub-categories", element: <SubCategories /> },
          //         { path: "upload-image", element: <CategoryUpload /> },
          //       ],
          //     },
          {
            path: "departure",
            element: <Products />,
            children: [
              { path: "product-branchs", element: <ProductInBranches /> },
            ],
          },
          //     {
          //       path: "branches",
          //       element: <Branches />,
          //     },
          //     {
          //       path: "brands",
          //       element: <Brands />,
          //     },
          //     {
          //       path: "governorate",
          //       element: <Governorate />,
          //     },
          //     {
          //       path: "cities",
          //       element: <City />,
          //     },
          //   ],
          // },

          // {
          //   path: "settings",
          //   element: <Settings />,
          // },

          {
            path: "attendance",
            element: <Users />,
            children: [{ path: "client-details", element: <UserDetails /> }],
          },

          // {
          //   path: "banners",
          //   element: <Banners />,
          //   children: [
          //     { path: "add-banner", element: <AddBanner /> },
          //     { path: "edit-banner", element: <AddBanner /> },
          //   ],
          // },
          // {
          //   path: "faq",
          //   element: <Faqs />,
          // },
          // {
          //   path: "rates",
          //   element: <Rates />,
          // },

          // {
          //   path: "offers",
          //   element: <Offers />,
          // },
          {
            path: "permission",
            element: <Orders />,
            children: [
              {
                path: "order-details",
                element: <OrderDetails />,
              },
              {
                path: "add-order",
                element: <AddOrder />,
              },
            ],
          },
          {
            path: "discipline_statistics",
            element: <PrescriptionOrders />,
            children: [
              {
                path: "order-details",
                element: <PrescriptionOrderDetails />,
              },
            ],
          },
          // {
          //   path: "clients-support",
          //   element: <ContactUs />,
          // },
          // {
          //   path: "problems",
          //   element: <Problems />,
          // },
          // {
          //   path: "profile",
          //   element: <Profile />,
          // },
        ],
      },
    ],
  },
]);

const { changeTheme } = themeSwitcherActions;
type Locale = keyof typeof AppLocale;
const queryClient = new QueryClient();

function AppProvider() {
  const dispatch = useDispatch();
  const { locale } = useSelector(
    ({ LanguageSwitcher }: { LanguageSwitcher: ILanguageSwitcher }) =>
      LanguageSwitcher.language
  );
  const { themeName, isDark } = useSelector(
    ({ ThemeSwitcher }: { ThemeSwitcher: ISelectedTheme }) => ThemeSwitcher
  );

  const reChangeTheme = () => {
    dispatch(changeTheme("system"));
  };

  const dir = locale === "ar" ? "rtl" : "ltr";
  const currentAppLocale = AppLocale[locale as Locale];
  useLayoutEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
    instance.defaults.headers.common["Accept-Language"] =
      locale === "ar" ? "ar-EG" : "en-US";
    instance.defaults.headers.common["X-Language"] =
      locale === "ar" ? "ar" : "en";
  }, [locale, dir]);
  useEffect(() => {
    const darkModePreference = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    if (themeName === "system") {
      darkModePreference.addEventListener("change", reChangeTheme);
    }
    return () => {
      if (themeName === "system") {
        darkModePreference.removeEventListener("change", reChangeTheme);
      }
    };
  }, [themeName]);

  useLayoutEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);
  useEffect(() => {
    instance.defaults.headers["Accept-Language"] = `${
      locale === "en" ? "en-US" : "ar-SA"
    }`;
    instance.defaults.headers["X-Language"] = `${
      locale === "en" ? "en-US" : "ar-SA"
    }`;
  }, [locale]);

  // useEffect(()=>{
  // instance.interceptors.request.use((config) => {
  //   config.headers['Accept-Language'] = `${locale === "en"?"en-US":"ar-SA"}`;
  //   console.log("Intercepted request config:",locale, config);
  //   return config;
  // });
  //  },[locale])

  return (
    <ErrorBoundaryProvider fallBackUIComponent={<FallBackUI />}>
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}
      >
        <ConfigProvider
          locale={currentAppLocale.antd}
          direction={dir}
          theme={{
            algorithm: antdTheme[isDark ? "darkAlgorithm" : "defaultAlgorithm"],
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
      </IntlProvider>
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
