import React, { useEffect, useState } from "react";
import { MdAccessAlarms } from "react-icons/md";
import {
  RiFileEditLine,
  RiUserFollowLine,
  RiUserUnfollowLine,
} from "react-icons/ri";
import { useSelector } from "react-redux";
import { ConfigProvider, DatePicker, message } from "antd";
import arEG from "antd/locale/ar_EG";
import dayjs from "dayjs";
import "dayjs/locale/ar";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadialBar,
  Legend,
  RadialBarChart,
} from "recharts";
import axios from "utlis/library/helpers/axios";
import RollerLoading from "components/loading/roller";
import SaudiMap from "components/SaudiMap/SaudiMap";

type CircularProgressProps = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
};
dayjs.locale("ar");
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

      <span className="absolute text-2xl font-bold text-[#15445A]">
        %{percentage}
      </span>
    </div>
  );
}

const MinisterHome: React.FC = () => {
  const [selected, setSelected] = useState<"سنة" | "شهر" | "يوم">("يوم");
  const buttons: Array<"سنة" | "شهر" | "يوم"> = ["سنة", "شهر", "يوم"];
  const [chartData, setChartData] = useState<{ date: string; count: number }[]>(
    []
  );
  const [loadingMap, setLoadingMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [fromDate, setFromDate] = useState<string>("2025/09/01");
  const [toDate, setToDate] = useState<string>("2025/09/25");
  const [fromDateMap, setFromDateMap] = useState<string>("2025/09/01");
  const [toDateMap, setToDateMap] = useState<string>("2025/09/25");
  const [selectedMetric, setSelectedMetric] = useState<
    "attendance" | "absent" | "late"
  >("attendance");
  const [loadingStats, setLoadingStats] = useState(false);

  const [mapData, setMapData] = useState<{
    attendance: number;
    late: number;
    absent: number;
  } | null>(null);

  const [selectedAttend, setSelectedAttend] = useState<
    "المكأفات" | "الغرامات" | "التأخير" | "الاستئذان" | "الحضور"
  >("الحضور");

  const buttonsAttend: Array<
    "المكأفات" | "الغرامات" | "التأخير" | "الاستئذان" | "الحضور"
  > = ["المكأفات", "الغرامات", "التأخير", "الاستئذان", "الحضور"];
  const [topSchools, setTopSchools] = useState<
    Array<{ school_id: number; score: number; school_name: string }>
  >([]);

  const [statsData, setStatsData] = useState<
    Array<{
      title: string;
      value: string | number;
      suffix?: string;
      bg?: string;
      text?: string;
      icon?: string;
      borderStyle?: React.CSSProperties;
    }>
  >([]);

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
      suffix: "طالب",
      bg: "bg-white",
      text: "text-[#07A869]",
      borderStyle: { border: "1px solid #C2C1C1", background: "#f9f9f9" },
    },
    {
      title: "الحضور",
      value: "5,983,404",
      suffix: "طالب",
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
  const { token } = useSelector((state: any) => state.Auth);
  const typeMapping: Record<string, string> = {
    الحضور: "attendance",
    الاستئذان: "excuse",
    التأخير: "late",
    الغرامات: "fines",
    المكأفات: "rewards",
  };

  useEffect(() => {
    const fetchTopSchools = async () => {
      try {
        const res = await axios.get("/minister/home/top-schools", {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            "Accept-Language": "ar",
          },
        });
        if (res.data && Array.isArray(res.data)) {
          setTopSchools(res.data);
        }
      } catch (err) {
        console.error("Error fetching top schools", err);
      }
    };

    fetchTopSchools();
  }, [token]);

  useEffect(() => {
    if (!fromDate || !toDate) return;

    if (dayjs(fromDate).isAfter(dayjs(toDate))) {
      message.warning("تاريخ البداية أكبر من تاريخ النهاية");
      return;
    }

    const fetchChartData = async () => {
      try {
        const apiType = typeMapping[selectedAttend];
        console.log("Selected:", selectedAttend, "Mapped:", apiType);

        if (!apiType) {
          console.warn("No mapping found for:", selectedAttend);
          return;
        }

        const res = await axios.get(
          `minister/home/chart?from=${fromDate}&to=${toDate}&type=${apiType}`,
          {
            headers: {
              Authorization: `Bearer ${token || localStorage.getItem("token")}`,
              "Accept-Language": "ar",
            },
          }
        );

        if (res.data.status) {
          setChartData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching chart data", error);
      }
    };

    fetchChartData();
  }, [fromDate, toDate, selectedAttend, token]);

  const percentage =
    selectedMetric === "attendance"
      ? mapData?.attendance || 0
      : selectedMetric === "absent"
      ? mapData?.absent || 0
      : mapData?.late || 0;

  const region = [
    { id: 1, code: "SA01", name: "الرياض" },
    { id: 2, code: "SA02", name: "مكة المكرمة" },
    { id: 3, code: "SA03", name: "المدينة المنورة" },
    { id: 4, code: "SA04", name: "الشرقية" },
    { id: 5, code: "SA05", name: "القصيم" },
    { id: 6, code: "SA06", name: "حائل" },
    { id: 7, code: "SA07", name: "تبوك" },
    { id: 8, code: "SA08", name: "الحدود الشمالية" },
    { id: 9, code: "SA09", name: "جازان" },
    { id: 10, code: "SA10", name: "نجران" },
    { id: 11, code: "SA11", name: "الباحة" },
    { id: 12, code: "SA12", name: "الجوف" },
    { id: 13, code: "SA13", name: "الشمال" },
    { id: 14, code: "SA14", name: "عسير" },
  ];

  // تحويل كود الخريطة لكود backend مع تعديل الـ id للـ backend
  const regionMap: Record<string, { code: string; id: number }> = {
    SA01: { code: "01", id: 1 }, // الرياض
    SA02: { code: "02", id: 2 }, // مكة
    SA03: { code: "03", id: 3 }, // المدينة
    SA04: { code: "05", id: 5 }, // الشرقية
    SA05: { code: "04", id: 4 }, // القصيم
    SA06: { code: "08", id: 8 }, // حائل
    SA07: { code: "07", id: 7 }, // تبوك
    SA08: { code: "09", id: 9 }, // الحدود الشمالية
    SA09: { code: "10", id: 10 }, // جازان
    SA10: { code: "11", id: 11 }, // نجران
    SA11: { code: "12", id: 12 }, // الباحة
    SA12: { code: "13", id: 13 }, // الجوف
    SA13: { code: "13", id: 13 }, // Northern Borders → استخدم نفس الجوف إذا مش موجود
    SA14: { code: "06", id: 6 }, // عسير
  };

  const [regions] = useState(
    Object.entries(regionMap).map(([mapCode, { id }]) => ({
      id,
      code: mapCode,
      name: region.find((r) => r.code === mapCode)?.name || "",
    }))
  );

  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(
    regions[0]?.id || null
  );

  useEffect(() => {
    if (!fromDateMap || !toDateMap) return;
    if (!selectedRegionId) return;

    const fetchMapData = async () => {
      try {
        setLoadingMap(true);
        const res = await axios.get(
          `minister/home/map?from=${fromDateMap}&to=${toDateMap}&region_id=${selectedRegionId}`,
          {
            headers: {
              Authorization: `Bearer ${token || localStorage.getItem("token")}`,
              "Accept-Language": "ar",
            },
          }
        );

        if (res.data.status) {
          setMapData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching map data", error);
      } finally {
        setTimeout(() => {
          setLoadingMap(false);
        }, 600);
      }
    };

    fetchMapData();
  }, [fromDateMap, toDateMap, token, selected, selectedRegionId]);

  const filterTypeMapping: Record<"سنة" | "شهر" | "يوم", number> = {
    سنة: 3,
    شهر: 2,
    يوم: 1,
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const type = filterTypeMapping[selected]; // 1 يوم، 2 شهر، 3 سنة
        const res = await axios.get(
          `minister/home/statistic?filter[type]=${type}`,
          {
            headers: {
              Authorization: `Bearer ${token || localStorage.getItem("token")}`,
              "Accept-Language": "ar",
            },
          }
        );

        if (res.data.status) {
          const apiData = res.data.data;

          const formattedStats = [
            {
              title: "الحضور",
              value: apiData.present,
              suffix: "طالب",
              bg: "bg-[#07A869]",
              text: "text-white",
            },
            {
              title: "الغياب",
              value: apiData.absent,
              suffix: "طالب",
              bg: "bg-white",
              text: "text-[#07A869]",
              borderStyle: {
                border: "1px solid #C2C1C1",
                background: "#f9f9f9",
              },
            },
            {
              title: "التأخير",
              value: apiData.late,
              suffix: "حالة تأخير",
              bg: "bg-[#07A869]",
              text: "text-white",
            },
            {
              title: "الاستئذان",
              value: apiData.excused,
              suffix: "حالة استئذان",
              bg: "bg-white",
              text: "text-[#07A869]",
              borderStyle: {
                border: "1px solid #C2C1C1",
                background: "#f9f9f9",
              },
            },
            {
              title: "الغرامات",
              value: apiData.fines.toLocaleString(),
              suffix: "ريال سعودي",
              bg: "bg-[#07A869]",
              text: "text-white",
              icon: "/riyal.png",
            },
          ];

          setStatsData(formattedStats);
        }
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [selected, token]);

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

  const maxValue = Math.max(...chartData.map((d) => d.count));
  const roundedMax = Math.ceil(maxValue / 100) * 100;

  return (
    <>
      {isLoading ? (
        <RollerLoading />
      ) : (
        <ConfigProvider locale={arEG} direction="rtl">
          <section dir="ltr" className="text-right px-2">
            <div className="bg-[#07A869] rounded-lg px-4 py-3 flex items-center mb-5 gap-4">
              <div className="flex-1 overflow-hidden relative">
                <div className="marquee-content flex gap-8 w-max">
                  {[...topSchools, ...topSchools, ...topSchools].map(
                    (school, index) => (
                      <p
                        key={`${school.school_id}-${index}`}
                        className="text-white font-semibold w-max shrink-0 mb-0"
                      >
                        <bdi>{school.school_name}</bdi>
                      </p>
                    )
                  )}
                </div>
              </div>
              <p className="text-white font-semibold text-lg shrink-0 mb-0">
                <bdi>أفضل 5 مدارس:</bdi>
              </p>
            </div>
            <div className=" mb-3 flex flex-col-reverse lg:flex-row justify-end items-end lg:items-start  gap-1 lg:gap-5">
              <div
                className="flex rounded-3xl h-9 w-max  overflow-hidden"
                style={{ border: "1px solid #C2C1C1" }}
              >
                {buttons.map((btn) => {
                  const isSelected = selected === btn;
                  return (
                    <button
                      key={btn}
                      onClick={() => setSelected(btn)}
                      className={`
              text-base h-8.5 w-[76px] sm:w-24 rounded-3xl transition-all duration-200 cursor-pointer
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
              <h2 className="text-[#15445A] font-semibold hover:text-[#07A869] transition-colors duration-500">
                احصائيات الانضباط
              </h2>
            </div>

            {loadingStats ? (
              <div
                className="flex justify-between items-center flex-wrap gap-5 py-2 mb-5"
                dir="rtl"
              >
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl h-[130px] shadow-md p-4 bg-white border border-[#C2C1C1] flex-grow w-[160px] animate-pulse"
                  >
                    <div className="w-full h-3.5 bg-[#c2c1c1] rounded mb-3"></div>
                    <div className="w-[80%] h-3.5 bg-[#c2c1c1] rounded mb-3"></div>
                    <div className="w-[60%] h-3.5 bg-[#c2c1c1] rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="flex justify-between items-center flex-wrap gap-5 py-2 mb-5"
                dir="rtl"
              >
                {statsData.map((item, index) => (
                  <div
                    key={index}
                    className={`rounded-xl shadow-md p-4 ${item.bg} transform transition duration-300 hover:scale-105 hover:shadow-xl flex-grow w-[160px] text-right`}
                    style={item.borderStyle || {}}
                  >
                    <h3 className={`${item.text} text-lg font-medium mb-1`}>
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 justify-start">
                      {item.icon && (
                        <img src={item.icon} alt="icon" className="w-7 h-7" />
                      )}
                      <span className={`${item.text} text-2xl font-semibold`}>
                        {item.value}
                      </span>
                    </div>
                    {item.suffix && (
                      <p className={`${item.text} text-base my-1`}>
                        {item.suffix}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col justify-center items-center  gap-6">
              <div className="w-full flex flex-col-reverse xl:flex-row justify-between items-stretch gap-6">
                <div
                  className="w-full xl:w-1/2 p-4 rounded-lg"
                  style={{ border: "1px solid #C2C1C1" }}
                >
                  <div>
                    <h3 className="text-xl font-semibold text-[#07A869] mb-1">
                      {regions.find((r) => r.id === selectedRegionId)?.name ||
                        "اختر منطقة"}
                    </h3>

                    <div className="flex flex-col-reverse lg:flex-row justify-center lg:justify-between gap-4 lg:gap-8 py-4 mb-2">
                      <div className="flex gap-2 items-center w-full lg:w-1/2">
                        <DatePicker
                          placeholder="اختر تاريخ النهاية"
                          format="YYYY/MM/DD"
                          className="w-full py-2"
                          value={
                            toDateMap ? dayjs(toDateMap, "YYYY/MM/DD") : null
                          }
                          onChange={(date) =>
                            setToDateMap(date ? date.format("YYYY/MM/DD") : "")
                          }
                        />

                        <label className="text-[#15445A] text-base font-semibold">
                          الي
                        </label>
                      </div>
                      <div className="flex gap-2 items-center w-full lg:w-1/2">
                        <DatePicker
                          placeholder="اختر تاريخ البداية"
                          format="YYYY/MM/DD"
                          className="w-full py-2"
                          value={
                            fromDateMap
                              ? dayjs(fromDateMap, "YYYY/MM/DD")
                              : null
                          }
                          onChange={(date) =>
                            setFromDateMap(
                              date ? date.format("YYYY/MM/DD") : ""
                            )
                          }
                        />
                        <label className="text-[#15445A] text-base font-semibold">
                          من
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-5 md:gap-0 mb-8">
                      {loadingMap ? (
                        <div className="w-[145px] h-[145px] rounded-full border-[20px] border-gray-200 animate-pulse flex items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
                        </div>
                      ) : (
                        <CircularProgress
                          percentage={percentage}
                          size={145}
                          color="#07A869"
                          bgColor="#E5E7EB"
                        />
                      )}

                      <div className="text-[#07A869] flex flex-col gap-3">
                        <div
                          className={`flex gap-1 group cursor-pointer ${
                            selectedMetric === "attendance"
                              ? "text-[#07A869]"
                              : "text-[#15445A]"
                          }`}
                          onClick={() => setSelectedMetric("attendance")}
                        >
                          <p className="font-medium w-[50px]">الحضور</p>
                          <RiUserFollowLine className="!text-xl" />
                        </div>

                        <div
                          className={`flex gap-1 group cursor-pointer ${
                            selectedMetric === "absent"
                              ? "text-[#07A869]"
                              : "text-[#15445A]"
                          }`}
                          onClick={() => setSelectedMetric("absent")}
                        >
                          <p className="font-medium w-[50px]">الغياب</p>
                          <RiUserUnfollowLine className="!text-xl" />
                        </div>

                        <div
                          className={`flex gap-1 group cursor-pointer ${
                            selectedMetric === "late"
                              ? "text-[#07A869]"
                              : "text-[#15445A]"
                          }`}
                          onClick={() => setSelectedMetric("late")}
                        >
                          <p className="font-medium w-[50px]">التأخير</p>
                          <MdAccessAlarms className="!text-xl" />
                        </div>

                        {/* <div
                        className={`flex gap-1 group cursor-pointer ${
                          selectedMetric === "late"
                            ? "text-[#07A869]"
                            : "text-[#15445A]"
                        }`}
                        onClick={() => setSelectedMetric("late")}
                      >
                        <p className="font-medium w-[50px]">الاستئذان</p>
                        <MdAccessAlarms className="!text-xl" />
                      </div> */}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center items-center">
                    <button
                      className="bg-[#07A869] outline-0 border border-[#07A869] border-solid rounded-3xl py-2 px-8 text-[#fff] text-base font-medium hover:bg-[#fff] hover:text-[#07A869] transition-colors duration-500 cursor-pointer mb-4"
                      onClick={async () => {
                        try {
                          const res = await axios.get(
                            `minister/home/map/export?from=${fromDateMap}&to=${toDateMap}`,
                            {
                              headers: {
                                Authorization: `Bearer ${
                                  token || localStorage.getItem("token")
                                }`,
                                "Accept-Language": "ar",
                              },
                              responseType: "blob",
                            }
                          );
                          const url = window.URL.createObjectURL(
                            new Blob([res.data])
                          );
                          const link = document.createElement("a");
                          link.href = url;
                          link.setAttribute("download", "report.xlsx");
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        } catch (err) {
                          console.error("Error downloading report:", err);
                        }
                      }}
                    >
                      إصدار التقرير
                    </button>
                  </div>
                </div>

                <div
                  className="w-full xl:w-1/2 p-4 rounded-lg"
                  style={{ border: "1px solid #C2C1C1" }}
                >
                  {/* <h3 className="text-xl font-semibold text-[#07A869] mb-8">
                    {regions.find((r) => r.id === selectedRegionId)?.name ||
                      "اختر منطقة"}
                  </h3> */}
                  <SaudiMap
                    regions={regions}
                    selectedRegionId={selectedRegionId}
                    handleSearch={setSelectedRegionId}
                  />
                </div>
              </div>

              <div className="w-full flex flex-col-reverse xl:flex-row justify-center xl:justify-between gap-6 items-center xl:items-stretch">
                <div
                  style={{ border: "1px solid #C2C1C1" }}
                  className="p-4 rounded-lg w-full"
                >
                  <div className="flex flex-col justify-center items-center mt-4">
                    <h2 className="text-[#15445A] font-bold hover:text-[#07A869] transition-colors duration-500 text-right">
                      أفضل 5 مدارس
                    </h2>
                    <div className="w-[240px] sm:w-[400px] mx-auto radial">
                      <ResponsiveContainer width="100%" height={400}>
                        <RadialBarChart
                          innerRadius="20%"
                          outerRadius="100%"
                          data={topSchools}
                          startAngle={180}
                          endAngle={0}
                        >
                          <RadialBar
                            dataKey="score"
                            background
                            label={{
                              position: "insideStart",
                              fill: "#fff",
                            }}
                          >
                            {topSchools.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  index === 0
                                    ? "#07A869"
                                    : index === 1
                                    ? "#41bb8c"
                                    : index === 2
                                    ? "#2ecc71"
                                    : index === 3
                                    ? "#a8e6cf"
                                    : "#C1DFDF"
                                }
                              />
                            ))}
                          </RadialBar>
                          <Tooltip
                            formatter={(val: any, name: any, props: any) => [
                              props.payload.school_name,
                              `%${val}`,
                            ]}
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                    <ul
                      className="flex flex-wrap justify-center gap-4 -mt-32"
                      dir="rtl"
                    >
                      {topSchools.map((entry, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span
                            style={{
                              display: "inline-block",
                              width: 12,
                              height: 12,
                              backgroundColor:
                                index === 0
                                  ? "#07A869"
                                  : index === 1
                                  ? "#2ecc71"
                                  : index === 2
                                  ? "#a8e6cf"
                                  : "#C1DFDF",
                            }}
                          />
                          <span className="text-sm text-gray-700">
                            {entry.school_name} ({entry.score}%)
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div
                  style={{ border: "1px solid #C2C1C1" }}
                  className="p-4 rounded-lg w-full"
                >
                  <div
                    className="flex  w-full rounded-3xl h-9.5 overflow-hidden ml-auto"
                    style={{ border: "1px solid #C2C1C1" }}
                  >
                    {buttonsAttend.map((btn) => {
                      const isSelected = selectedAttend === btn;
                      return (
                        <button
                          key={btn}
                          onClick={() => setSelectedAttend(btn)}
                          className={`
            text-[12px] lg:text-[15px] h-9 w-1/5 rounded-3xl transition-all duration-200 cursor-pointer
            ${
              isSelected
                ? "bg-[#07A869] text-white"
                : "bg-transparent text-[#C2C1C1] hover:bg-gray-100"
            }
            outline-none border-none
          `}
                        >
                          {btn}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 0, left: 0, bottom: 30 }}
                        barCategoryGap="30%"
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12 }}
                          // interval={0}
                          interval="preserveStartEnd"
                          angle={-45}
                          textAnchor="end"
                        />

                        <YAxis
                          domain={[0, roundedMax]}
                          ticks={Array.from(
                            { length: roundedMax / 100 + 1 },
                            (_, i) => i * 100
                          )}
                          tick={{ fontSize: 12 }}
                          tickMargin={20}
                          allowDecimals={false}
                        />
                        <Tooltip
                          labelFormatter={(label: any) => `تاريخ: ${label}`}
                          formatter={(value: any) => [`${value}`, "القيمة"]}
                        />

                        <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={30}>
                          {chartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                activeIndex === index ? "#07A869" : "#C1DFDF"
                              }
                              onMouseEnter={() => setActiveIndex(index)}
                              onMouseLeave={() => setActiveIndex(null)}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>

                    <div className="flex flex-col-reverse lg:flex-row justify-center lg:justify-between gap-4 lg:gap-8 pb-8 mt-5">
                      <div className="flex gap-2 items-center w-full lg:w-1/2">
                        <DatePicker
                          placeholder="اختر تاريخ النهاية"
                          format="YYYY/MM/DD"
                          className="w-full py-2"
                          value={toDate ? dayjs(toDate, "YYYY/MM/DD") : null}
                          onChange={(date) =>
                            setToDate(date ? date.format("YYYY/MM/DD") : "")
                          }
                        />

                        <label className="text-[#15445A] text-base font-semibold">
                          الي
                        </label>
                      </div>
                      <div className="flex gap-2 items-center w-full lg:w-1/2">
                        <DatePicker
                          placeholder="اختر تاريخ البداية"
                          format="YYYY/MM/DD"
                          className="w-full py-2"
                          value={
                            fromDate ? dayjs(fromDate, "YYYY/MM/DD") : null
                          }
                          onChange={(date) =>
                            setFromDate(date ? date.format("YYYY/MM/DD") : "")
                          }
                        />
                        <label className="text-[#15445A] text-base font-semibold">
                          من
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ConfigProvider>
      )}
    </>
  );
};

export default MinisterHome;
