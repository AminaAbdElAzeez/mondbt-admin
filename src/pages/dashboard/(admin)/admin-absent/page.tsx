import React, { useEffect, useState } from "react";
import { MdAccessAlarms } from "react-icons/md";
import {
  RiFileEditLine,
  RiUserFollowLine,
  RiUserUnfollowLine,
} from "react-icons/ri";
import { useSelector } from "react-redux";
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
import axios from "utlis/library/helpers/axios";

type CircularProgressProps = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
};

function CircularProgress({
  percentage,
  size = 200,
  strokeWidth = 18,
  color = "#07A869",
  bgColor = "#D9D9D9",
  label,
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
      {label && (
        <span className=" absolute top-[32%] text-base font-semibold text-[#15445A] mb-2">
          {label}
        </span>
      )}

      <span className="absolute top-[47%] text-2xl font-bold text-[#07A869]">
        {percentage}%
      </span>
    </div>
  );
}

const AdminAbsent: React.FC = () => {
  const [selected, setSelected] = useState<"سنة" | "شهر" | "يوم">("يوم");
  const buttons: Array<"سنة" | "شهر" | "يوم"> = ["سنة", "شهر", "يوم"];
  const [selectedBottom, setSelectedBottom] = useState<"سنة" | "شهر" | "يوم">(
    "يوم"
  );
  const buttonsBottom: Array<"سنة" | "شهر" | "يوم"> = ["سنة", "شهر", "يوم"];
  const { token } = useSelector((state: any) => state.Auth);

  const [attendanceData, setAttendanceData] = useState({
    all: 0,
    male: 0,
    female: 0,
    primary: 0,
    intermidite: 0,
    secondary: 0,
  });

  const filterTypeMapping: Record<"يوم" | "شهر" | "سنة", number> = {
    يوم: 1,
    شهر: 2,
    سنة: 3,
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const type = filterTypeMapping[selected];
        const res = await axios.get(`/admin/absent?filter[type]=${type}`, {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            "Accept-Language": "ar",
          },
        });
        if (res.data.status) {
          setAttendanceData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching attendance data", error);
      }
    };

    fetchAttendance();
  }, [selected]);

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

  return (
    <section dir="ltr" className="text-right px-2">
      <div className=" mb-3 flex flex-col-reverse lg:flex-row justify-end items-end lg:items-start gap-2">
        <h2 className="text-[#15445A] font-semibold hover:text-[#07A869] transition-colors duration-500">
          احصائيات الغياب
        </h2>
      </div>

      <div className="flex flex-col xl:flex-row justify-between items-stretch  gap-6">
        <div
          style={{ border: "1px solid #C2C1C1" }}
          className="p-4 rounded-lg w-full xl:w-1/2"
        >
          <div className="px-6 flex justify-center items-center mb-2 lg:mb-0">
            <img src="/map.png" alt="map" className="w-full max-w-[500px] " />
          </div>
        </div>

        <div
          style={{ border: "1px solid #C2C1C1" }}
          className="p-4 rounded-lg w-full xl:w-1/2 "
        >
          <h3 className="text-xl font-semibold text-[#07A869] mb-8">
            منطقة الرياض
          </h3>
          <div
            className="flex rounded-3xl h-9 w-full sm:w-max  overflow-hidden mx-auto"
            style={{ border: "1px solid #C2C1C1" }}
          >
            {buttons.map((btn) => {
              const isSelected = selected === btn;
              return (
                <button
                  key={btn}
                  onClick={() => setSelected(btn)}
                  className={`
              text-base h-8.5 w-1/3 sm:w-24 rounded-3xl transition-all duration-200 cursor-pointer
              ${
                isSelected
                  ? "bg-[#07A869] text-white"
                  : "bg-transparent text-[#C2C1C1]"
              }
              hover:${isSelected ? "brightness-110" : "bg-gray-100"}
              outline-none border-none
            `}
                >
                  {btn}
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid max-[400px]:grid-cols-1 min-[401px]:grid-cols-2  md:grid-cols-3  gap-6 justify-items-center">
            <CircularProgress
              label="البنات"
              percentage={attendanceData.female}
              size={140}
              color="#07A869"
              bgColor="#E5E7EB"
            />
            <CircularProgress
              label="البنين"
              percentage={attendanceData.male}
              size={140}
              color="#07A869"
              bgColor="#E5E7EB"
            />
            <CircularProgress
              label="الكل"
              percentage={attendanceData.all}
              size={140}
              color="#07A869"
              bgColor="#E5E7EB"
            />
            <CircularProgress
              label="الثانوي"
              percentage={attendanceData.secondary}
              size={140}
              color="#07A869"
              bgColor="#E5E7EB"
            />
            <CircularProgress
              label="المتوسط"
              percentage={attendanceData.intermidite}
              size={140}
              color="#07A869"
              bgColor="#E5E7EB"
            />
            <CircularProgress
              label="الابتدائي"
              percentage={attendanceData.primary}
              size={140}
              color="#07A869"
              bgColor="#E5E7EB"
            />
          </div>
        </div>
      </div>

      {/* <div className="mt-6 mb-3 flex flex-col-reverse lg:flex-row justify-end items-end lg:items-start gap-1 lg:gap-5">
        <div
          className="flex rounded-3xl h-9 w-max  overflow-hidden"
          style={{ border: '1px solid #C2C1C1' }}
        >
          {buttonsBottom.map((btn) => {
            const isSelected = selectedBottom  === btn;
            return (
              <button
                key={btn}
                onClick={() => setSelectedBottom(btn)}
                className={`
              text-base h-8.5 w-[76px] sm:w-24 rounded-3xl transition-all duration-200 cursor-pointer
              ${isSelected ? 'bg-[#07A869] text-white' : 'bg-transparent text-[#C2C1C1]'}
              hover:${isSelected ? 'brightness-110' : 'bg-gray-100'}
              outline-none border-none
            `}
              >
                {btn}
              </button>
            );
          })}
        </div>
        <h2 className="text-[#15445A] font-semibold hover:text-[#07A869] transition-colors duration-500">
          احصائيات الانضباط
        </h2>
      </div> */}
    </section>
  );
};

export default AdminAbsent;
