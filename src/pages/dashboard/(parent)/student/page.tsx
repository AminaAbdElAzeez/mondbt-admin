import React, { useEffect, useState } from "react";
import { MdAccessAlarms } from "react-icons/md";
import {
  RiFileEditLine,
  RiUserFollowLine,
  RiUserUnfollowLine,
} from "react-icons/ri";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "utlis/library/helpers/axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useSelector } from "react-redux";
import RollerLoading from "components/loading/roller";

type StudentData = {
  id: number;
  name: string;
  grade: string;
  school: string;
};
type Reward = {
  month: number;
  reward_title: string | null;
  description: string | null;
  reward_date: string | null;
  value: number;
  used: boolean | number;
};
type Excuse = {
  id: number;
  type: string;
  student: string;
  status: string;
  date: string;
  file: string;
};

type CircularProgressProps = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
};

type Fine = {
  id: number;
  type: string;
  amount: number;
};

const fines = [
  {
    id: 1,
    description: "مرض الطالب/ احمد علي",
    date: "1447/03/23",
    status: "مقبول",
  },
  {
    id: 2,
    description: "وفاة قريبة من الدرجة الاولى",
    date: "1447/03/24",
    status: "مرفوض",
  },
  {
    id: 3,
    description: "موعد طبي للطالبة/ زهرة علي",
    date: "1447/03/25",
    status: "مقبول",
  },
  {
    id: 4,
    description: "مرض الطالب/ علي ابراهيم",
    date: "1447/03/26",
    status: "مرفوض",
  },
];

const fineReasons = [
  {
    id: "1",
    name: "تأخر عن الاصطفاف الصباحي",
    value: "1,020,935",
  },
  {
    id: "2",
    name: "تأخر عن الحصة الاولى",
    value: "1,020,935",
  },
  {
    id: "3",
    name: "استئذان أثناء اليوم الدراسي",
    value: "1,020,935",
  },
  {
    id: "4",
    name: "غياب بدون عذر",
    value: "1,020,935",
  },
];

function CircularProgress({
  percentage,
  size = 200,
  strokeWidth = 20,
  color = "#07A869",
  bgColor = "#D9D9D9", // gray-200
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size}>
        <circle
          stroke={bgColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={(1 - percentage / 100) * circumference}
          transform={`rotate(90 ${size / 2} ${size / 2})`}
        />
      </svg>

      {/* <span className="absolute text-3xl font-bold text-[#15445A]">%{percentage}</span> */}
    </div>
  );
}

const Students: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useSelector((state: any) => state.Auth);

  // console.log(id)
  const [student, setStudent] = useState<StudentData | null>(null);
  const [attendance, setAttendance] = useState<number>(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [excuses, setExcuses] = useState<Excuse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selected, setSelected] = useState<"سنة" | "شهر" | "يوم">("يوم");
  const buttons: Array<"سنة" | "شهر" | "يوم"> = ["سنة", "شهر", "يوم"];
  const [loading, setLoading] = useState(false);

  const [selectedAttend, setSelectedAttend] = useState<
    "جميع الشهور" | "ربيع الاول"
  >("ربيع الاول");

  const buttonsAttend: Array<"جميع الشهور" | "ربيع الاول"> = [
    "جميع الشهور",
    "ربيع الاول",
  ];

  const [finesData, setFinesData] = useState<{ fines: Fine[]; total: number }>({
    fines: [],
    total: 0,
  });
  const navigate = useNavigate();

  const stats = [
    {
      title: "الغرامات",
      value: "1,020,935",
      suffix: "ريال سعودي",
      bg: "bg-[#07A869]",
      text: "text-white",
      icon: "/riyal.png",
    },
    {
      title: "الاستئذان",
      value: "12,650",
      suffix: "حالة استئذان",
      bg: "bg-white",
      text: "text-[#07A869]",
      borderStyle: { border: "1px solid #C2C1C1", background: "#f9f9f9" },
    },
    {
      title: "التأخير",
      value: "1,180,935",
      suffix: "حالة تأخير",
      bg: "bg-[#07A869]",
      text: "text-white",
    },
    {
      title: "الغياب",
      value: "314,919",
      suffix: "طالب وطالبة",
      bg: "bg-white",
      text: "text-[#07A869]",
      borderStyle: { border: "1px solid #C2C1C1", background: "#f9f9f9" },
    },
    {
      title: "الحضور",
      value: "5,983,404",
      suffix: "طالب وطالبة",
      bg: "bg-[#07A869]",
      text: "text-white",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const data = [
    { day: 15, value: 70, hijri: "21" },
    { day: 16, value: 50, hijri: "20" },
    { day: 17, value: 90, hijri: "19" },
    { day: 18, value: 30, hijri: "18" },
    { day: 19, value: 60, hijri: "17" },
    { day: 20, value: 80, hijri: "16" },
    { day: 21, value: 40, hijri: "15" },
  ];

  useEffect(() => {
    if (!id) return;

    axios
      .get(`parent/student/${id}`, {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          "Accept-Language": "ar",
        },
      })
      .then((res) => {
        setStudent(res.data.data.data);
      })
      .catch((err) => console.error(err));

    axios
      .get(`parent/student/rewards/${id}`, {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          "Accept-Language": "ar",
        },
      })
      .then((res) => {
        setRewards(res.data.data.rewards);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // console.log(id)
  //load attendance on filter change
  useEffect(() => {
    if (!id) return;

    setLoading(true);

    const url =
      selectedAttend === "ربيع الاول"
        ? `/parent/student/attendance-by-month/${id}`
        : `/parent/student/attendance-by-year/${id}`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          "Accept-Language": "ar",
        },
      })
      .then((res) => {
        console.log("attendance:", res.data);
        setAttendance(res.data.data.attendance_percentage);
      })
      .catch((err) => {
        console.error("Error fetching attendance:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, selectedAttend]);
  useEffect(() => {
    axios
      .get("/parent/excuses", {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          "Accept-Language": "ar",
        },
      })
      .then((res) => {
        setExcuses(res.data.data);
      })
      .catch((err) => console.error(err));
  }, [token]);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`/parent/student/fines/${id}`, {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          "Accept-Language": "ar",
        },
      })
      .then((res) => {
        setFinesData(res.data.data);
      })
      .catch((err) => console.error(err));
  }, [id, token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 600));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <RollerLoading />
      ) : (
        <section dir="ltr" className="text-right px-2">
          <div className=" mb-1.5 flex flex-col-reverse lg:flex-row justify-end items-end lg:items-start  gap-1 lg:gap-5">
            <h2 className="text-[#15445A] font-semibold hover:text-[#07A869] transition-colors duration-500">
              أبنائي
            </h2>
          </div>

          <div className="px-4 pt-4 pb-6 mb-6 border border-[#07A86940] border-solid rounded-lg flex flex-col-reverse lg:flex-row items-center justify-end gap-4">
            {student && (
              <div className="w-full lg:w-[70%] xl:w-[50%] flex flex-col items-end text-center lg:text-right">
                <h3 className="text-[#07A869] hover:text-[#15445A] transition-colors duration-500 text-xl sm:text-2xl font-semibold mb-4 w-full lg:w-max">
                  {student.name}
                </h3>
                <div className="flex flex-col-reverse gap-3 lg:flex-row lg:justify-between w-full">
                  <div className="flex flex-col text-base sm:text-lg gap-1 group">
                    <strong className="text-[#07A869]">
                      <bdi>المدرسة:</bdi>
                    </strong>
                    <strong className="text-[#15445A] group-hover:text-[#07A869] transition-colors duration-500">
                      {student.school}
                    </strong>
                  </div>
                  {/* <div className="flex flex-col text-base sm:text-lg gap-1 group">
                <strong className="text-[#07A869]">
                  <bdi>العمر:</bdi>
                </strong>
                <strong className="text-[#15445A] group-hover:text-[#07A869] transition-colors duration-500">
                  <bdi>9 سنوات</bdi>
                </strong>
              </div> */}
                  <div className="flex flex-col text-base sm:text-lg gap-1 group">
                    <strong className="text-[#07A869]">
                      <bdi>الصف:</bdi>
                    </strong>
                    <strong className="text-[#15445A] group-hover:text-[#07A869] transition-colors duration-500">
                      {student.grade}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* الصورة */}
            <div className="w-20 h-20 bg-[#C2C1C1] rounded-full shrink-0"></div>
          </div>

          <div className="flex flex-col xl:flex-row justify-between  items-stretch  gap-6 mb-6">
            <div
              style={{ border: "1px solid #C2C1C1" }}
              className=" p-4 rounded-lg w-full xl:w-1/2 "
            >
              <h3 className="text-[#07A869] font-semibold hover:text-[#15445A] transition-colors duration-500 text-2xl mb-7">
                المكافئات
              </h3>
              <div
                className="flex justify-between items-center flex-wrap gap-2"
                dir="rtl"
              >
                {rewards.map((reward, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-center items-center gap-1 group w-[90px] flex-grow mb-2"
                  >
                    <img
                      src={
                        reward.used === true || reward.used === 0
                          ? "/img.png"
                          : "/gray-img.png"
                      }
                      alt="icon"
                      className="w-16 h-auto"
                    />
                    <h5 className="text-[#15445A] text-sm group-hover:text-[#07A869] transition-colors duration-500 font-semibold text-center">
                      {reward.reward_title || "بدون عنوان"}
                    </h5>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{ border: "1px solid #C2C1C1" }}
              className="p-4 rounded-lg w-full xl:w-1/2"
            >
              <h3 className="text-[#07A869] font-semibold hover:text-[#15445A] transition-colors duration-500 text-2xl mb-6 sm:mb-2 text-center sm:text-right">
                نسبة الحضور
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between mb-6">
                {loading ? (
                  <div className="w-[100px] h-[100px] rounded-full bg-gray-200 animate-pulse" />
                ) : (
                  <CircularProgress
                    percentage={attendance}
                    size={100}
                    strokeWidth={14}
                    color="#07A869"
                    bgColor="#E5E7EB"
                  />
                )}

                <span className="text-[#15445A] text-4xl  hover:text-[#07A869] transition-colors duration-500 font-bold ">
                  %{attendance}
                </span>
              </div>

              <div className="flex w-full md:w-[340px] mx-auto pb-0 rounded-3xl border border-[#C2C1C1] border-solid mb-2">
                {buttonsAttend.map((btn) => {
                  const isSelected = selectedAttend === btn;
                  return (
                    <button
                      key={btn}
                      onClick={() => setSelectedAttend(btn)}
                      className={`flex-1 py-2 rounded-3xl text-base font-medium transition-colors duration-200 border-none  cursor-pointer
              ${
                isSelected
                  ? "bg-[#07A869] text-white"
                  : "bg-gray-100 text-[#15445A]"
              }
            `}
                    >
                      {btn}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className="flex flex-col xl:flex-row justify-between  items-stretch  gap-6"
            dir="rtl"
          >
            <div
              style={{ border: "1px solid #C2C1C1" }}
              className="p-4 rounded-lg w-full xl:w-1/2 overflow-x-auto"
            >
              <h3 className="text-[#07A869] font-semibold hover:text-[#15445A] transition-colors duration-500 text-2xl mb-6 text-center">
                الغرامات
              </h3>
              <div className="max-h-[300px] overflow-y-auto">
                <table className="min-w-[420px]  w-full border-collapse">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr
                      className="text-right"
                      style={{ borderBottom: "1px solid #D9D9D9" }}
                    >
                      <th className="p-3 text-[#07A869] font-semibold text-lg">
                        <bdi>مجموع الغرامات:</bdi>
                      </th>
                      <th className="p-3 text-[#07A869] font-semibold text-xl flex justify-end items-center gap-1">
                        {finesData.total}{" "}
                        <img
                          src="/green-riyal.png"
                          alt="icon"
                          className="w-7 h-auto"
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {finesData.fines.map((fine) => (
                      <tr
                        key={fine.id}
                        className="hover:bg-[#f0eeee] transition-all duration-500"
                      >
                        <td className="p-3 text-[#15445A] font-semibold text-lg">
                          {fine.type}
                        </td>
                        <td className="p-3 text-[#15445A] font-medium text-left text-lg">
                          {fine.amount}
                          <img
                            src="/black-riyal.png"
                            alt="icon"
                            className="w-6 h-auto"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center mt-6 mb-2">
                <Link
                  to="/parent/pay-fines"
                  className="bg-[#07A869] w-full sm:w-[220px] text-[#fff] text-base sm:text-lg font-semibold px-8 py-2 rounded-3xl outline-none border border-[#07A869] border-solid cursor-pointer hover:text-[#07A869] hover:bg-[#fff] transition-colors duration-500 text-center"
                >
                  دفع الغرامات
                </Link>
              </div>
            </div>

            <div
              style={{ border: "1px solid #C2C1C1" }}
              className="p-4 rounded-lg w-full xl:w-1/2 overflow-x-auto"
            >
              <h3 className="text-[#07A869] font-semibold hover:text-[#15445A] transition-colors duration-500 text-2xl mb-6 text-center">
                الغرامات
              </h3>

              <div className="max-h-[300px] overflow-y-auto">
                <table className="min-w-[420px] w-full border-collapse text-right">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr
                      className="text-right"
                      style={{ borderBottom: "1px solid #D9D9D9" }}
                    >
                      <th className="p-3 text-[#07A869] font-semibold text-lg w-1/3 text-right align-middle">
                        الوصف
                      </th>
                      <th className="p-3 text-[#07A869] font-semibold text-lg w-1/3 text-right align-middle">
                        التاريخ
                      </th>
                      <th className="p-3 text-[#07A869] font-semibold text-lg w-1/3 text-right align-middle">
                        الحالة
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {excuses.map((excuse) => (
                      <tr
                        key={excuse.id}
                        onClick={() =>
                          navigate(`/parent/student/${id}/excuses/${excuse.id}`)
                        }
                        className="hover:bg-[#f0eeee] transition-all duration-500 cursor-pointer"
                      >
                        <td className="p-3 text-[#15445A] font-semibold text-right align-middle text-lg">
                          {excuse.type}
                        </td>
                        <td className="p-3 text-[#15445A] text-right align-middle">
                          {excuse.date}
                        </td>
                        <td className="p-3 text-[#15445A] font-semibold text-right align-middle">
                          {excuse.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center mt-6 mb-2">
                <Link
                  to="/parent/new-excuse"
                  className="bg-[#07A869] w-full sm:w-[220px] text-[#fff] text-base sm:text-lg font-semibold px-8 py-2 rounded-3xl outline-none border border-[#07A869] border-solid cursor-pointer hover:text-[#07A869] hover:bg-[#fff] transition-colors duration-500 text-center"
                >
                  قدم عذر جديد
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Students;
