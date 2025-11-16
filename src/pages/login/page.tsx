import {
  Button,
  Form,
  Input,
  Checkbox,
  Layout,
  theme,
  Dropdown,
  Space,
  MenuProps,
  message,
  Card,
} from "antd";
import { useState } from "react";
import LangSwitcher from "containers/layout/Topbar/LangSwitcher";
// import ThemesSwitcher from "containers/layout/Topbar/ThemesSwitcher";
import authAction from "store/auth/actions";
import { useDispatch } from "react-redux";
import middleware from "utlis/navigation/mw";
import { useSelector } from "react-redux";
import { LoggedUserCanNotOpen } from "middlewares";
import axios from "utlis/library/helpers/axios";
import { toast } from "react-hot-toast";
import { FormattedMessage } from "react-intl";
import { Typography } from "antd";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { permissionsTransform } from "utlis/library/helpers/permissions";
import { useForm } from "antd/lib/form/Form";
import SmallLogo from "components/LogoWraper/small-logo";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { PhoneNumberUtil } from "google-libphonenumber";
import profileActions from "store/profile/actions";

const { Title } = Typography;

const { login } = authAction;
const { fetchProfileDataSuccess } = profileActions;
const phoneUtil = PhoneNumberUtil.getInstance();

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //   const onFinish = (values: any) => {
  //   setLoading(true);
  //   const myPromise = axios["post"]("/login", values);

  //   // toast.promise(
  //   //   myPromise,
  //   //   {
  //   //     loading: (
  //   //       <div className="min-w-[200px]">
  //   //         {locale === "ar" ? "جاري المعالجة " : "Pending"}
  //   //       </div>
  //   //     ),
  //   //     success: (res) => {
  //   //       setLoading(false);

  //   //       return "Backend Message Error Occured";
  //   //     },
  //   //     error: (err) => {
  //   //       setLoading(false);
  //   //       return err.response?.data?.message || "Backend Error Occured";
  //   //     },
  //   //   },
  //   //   {
  //   //     style: {
  //   //       minWidth: "250px",
  //   //     },
  //   //     success: {
  //   //       duration: 3000,
  //   //       icon: "🔥",
  //   //     },
  //   //   }
  //   // );
  // };

  const [form] = useForm();

  const mutation = useMutation({
    mutationFn: (values) =>
      axios["post"]("auth/login", values, {
        headers: {
          "Accept-Language": "ar",
        },
      }),
    onSuccess: (res) => {
      const { token, data } = res.data;
      const normalizedData = {
        ...data,
        isVerified: data.isVerified ?? true,
        isActivated: data.isActivated ?? true,
        isApproved: data.isApproved ?? true,
      };
      // console.log(res);
      dispatch(login(token, normalizedData));
      dispatch(fetchProfileDataSuccess(normalizedData));
      localStorage.setItem("token", token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      if (data.role === 1) {
        navigate("/admin/home");
      } else if (data.role === 2) {
        navigate("/minister/home");
      } else if (data.role === 3) {
        navigate("/manager/home");
      } else if (data.role === 4) {
        navigate("/parent/home");
      } else {
        navigate("/login");
      }

      message.success("تم تسجيل الدخول بنجاح");
      // navigate('/admin');

      // data.isVerified = true; // toClear
      // data.isActivated = true; // toClear
      // data.isApproved = true; // toClear
      // if (data?.permissions) {
      //   data.permissions = permissionsTransform(data.permissions);
      // }
      // dispatch(fetchProfileDataSuccess(data));
      // Invalidate and refetch
      // queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (err) => {
      const {
        status,
        data: { message },
      } = (err as any).response;

      toast.error(message, {
        position: "top-center",
        duration: 5000,
      });
    },
  });
  const onFinish = (values: any) => {
    mutation.mutate(values);
  };
  return (
    <div className="bg-texture-light dark:bg-texture-dark login">
      <div className="box-border absolute inset-x-0 top-0 w-full flex items-center justify-between container mx-auto py-5 px-2">
        <div className="brightness-90 flex items-center text-[#3730a3] no-underline hover:no-underline font-bold text-2xl lg:text-4xl w-full">
          <Link to={"/"} className="p-3 rounded-md !bg-[#07A869]">
            <img
              className=" h-auto rounded-md w-[70px] md:w-[95px]"
              src="/bg-logo.svg"
              // width={70}
              // height={73}
              alt="Mondbt Admin"
            />
          </Link>
        </div>
        <ul className="flex gap-3 items-center">
          {/* <li className="isoUser flex">
            <LangSwitcher />
          </li> */}
          {/* <li className="isoUser">
            <ThemesSwitcher />
          </li> */}
        </ul>
      </div>

      <div
        className="min-h-[100dvh] box-border w-full flex flex-col items-center justify-center px-3 sm:px-6 py-0 sm:py-8 mx-auto lg:py-0 bg-cover bg-no-repeat"
        style={{ backgroundImage: 'url("/back.png")' }}
      >
        <motion.div
          initial={{ y: -150, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="w-full max-w-md"
        >
          <Card className=" w-full  rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
            <div className="space-y-4 sm:p-4">
              <Title className="!text-xl font-bold leading-tight tracking-tight   md:!text-2xl ">
                {/* <FormattedMessage id="signin.signToYourAccount" /> */}
                تسجيل الدخول
              </Title>
              <Form
                layout="vertical"
                form={form}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item
                  // label={<FormattedMessage id="email" />}
                  label="الرقم المدني"
                  name="civil_number"
                  rules={[
                    {
                      required: true,
                      message: "الرقم المدني",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
                <Form.Item
                  label="كلمة المرور"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "كلمة المرور",
                    },
                  ]}
                >
                  <Input.Password size="large" />
                </Form.Item>
                <div className="flex justify-between mb-5">
                  <Form.Item
                    className="mb-0"
                    name="remember"
                    valuePropName="checked"
                  >
                    <Checkbox>تذكرنى</Checkbox>
                  </Form.Item>
                  {/* <Dropdown menu={{ items, onClick }}>
                    <a className="py-[5px]" onClick={(e) => e.preventDefault()}>
                      <Space>
                        <FormattedMessage id="page.forgetPassSubTitle" />
                      </Space>
                    </a>
                  </Dropdown> */}
                  {/* <Link to="/signup"><FormattedMessage id="register-new-account" /></Link> */}
                </div>

                <Form.Item>
                  <Button
                    // type="primary"

                    size="large"
                    className="w-full text-white bg-[#07A869] hover:bg-[#07A869]"
                    htmlType="submit"
                    loading={mutation.isPending}
                  >
                    {/* <FormattedMessage id="page.signInButton" /> */}
                    تسجيل الدخول
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
