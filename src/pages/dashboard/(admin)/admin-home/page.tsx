import React, { useEffect, useState } from "react";
import axios from "utlis/library/helpers/axios";
import { MdAccessAlarms } from "react-icons/md";
import {
  RiFileEditLine,
  RiUserFollowLine,
  RiUserUnfollowLine,
} from "react-icons/ri";
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
import { Select, Button } from "antd";
import "antd/dist/reset.css";
import { IoSearch } from "react-icons/io5";
import { FaExclamation } from "react-icons/fa";
import { useSelector } from "react-redux";
import { FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";

const { Option } = Select;

type CircularProgressProps = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
};

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

      <span className="absolute text-lg font-bold text-[#15445A]">
        %{percentage}
      </span>
    </div>
  );
}

const AdminHome: React.FC = () => {
  const [regions, setRegions] = useState<Array<{ id: number; name: string }>>(
    []
  );
  const [cities, setCities] = useState<
    Array<{ id: number; name: string; region: { id: number } }>
  >([]);
  const [schools, setSchools] = useState<Array<any>>([]);

  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [ministryNumber, setMinistryNumber] = useState<string>("");
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedGender, setSelectedGender] = useState<number | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [schoolResults, setSchoolResults] = useState<any[]>([]);
  const [studentResults, setStudentResults] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [selected, setSelected] = useState<"سنة" | "شهر" | "يوم">("يوم");
  const buttons: Array<"سنة" | "شهر" | "يوم"> = ["سنة", "شهر", "يوم"];
  const [filteredData, setFilteredData] = useState<{
    school: any[];
    student: any[];
  }>({ school: [], student: [] });
  const [statsLoading, setStatsLoading] = useState(false);

  const [region, setRegion] = useState<string>("1"); // اختار قيمة المنطقة

  const [selectedAttend, setSelectedAttend] = useState<
    "الاحصائيات" | "التقارير"
  >("الاحصائيات");
  const buttonsAttend: Array<"الاحصائيات" | "التقارير"> = [
    "الاحصائيات",
    "التقارير",
  ];

  const [selectedHr, setSelectedHr] = useState<"الطلاب" | "المدراس">("المدراس");
  const buttonsHr: Array<"الطلاب" | "المدراس"> = ["الطلاب", "المدراس"];
  const [studentStats, setStudentStats] = useState<{
    present: number;
    absent: number;
    rewards: number;
  }>({
    present: 0,
    absent: 0,
    rewards: 0,
  });

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

  const filterTypeMapping: Record<"سنة" | "شهر" | "يوم", number> = {
    سنة: 3,
    شهر: 2,
    يوم: 1,
  };
  const { token } = useSelector((state: any) => state.Auth);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const type = filterTypeMapping[selected];
        const res = await axios.get(
          `admin/home/statistics?filter[type]=${type}`,
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
              suffix: "طالب وطالبة",
              bg: "bg-[#07A869]",
              text: "text-white",
            },
            {
              title: "الغياب",
              value: apiData.absent,
              suffix: "طالب وطالبة",
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
              icon: "/riyal.png", // الصورة موجودة فقط لكارت الغرامات
            },
          ];

          setStatsData(formattedStats);
        }
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [selected, token]);

  useEffect(() => {
    // Fetch regions
    axios
      .get("/regions", {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          "Accept-Language": "ar",
        },
      })
      .then((res) => res.data.status && setRegions(res.data.data))
      .catch(console.error);

    // Fetch cities
    axios
      .get("/cities", {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          "Accept-Language": "ar",
        },
      })
      .then((res) => res.data.status && setCities(res.data.data.data))
      .catch(console.error);

    // Fetch schools
    axios
      .get("/schools", {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          "Accept-Language": "ar",
        },
      })
      .then((res) => res.data.status && setSchools(res.data.data))
      .catch(console.error);
  }, [token]);

  const handleSearch = async () => {
    try {
      setLoading(true);

      const params: any = {};
      if (selectedRegion) params["filter[region]"] = selectedRegion;
      if (selectedCity) params["filter[city]"] = selectedCity;
      if (ministryNumber) params["filter[ministry_number]"] = ministryNumber;
      if (selectedType) params["filter[type]"] = selectedType;
      if (selectedGender) params["filter[gender]"] = selectedGender;

      const queryString = new URLSearchParams(params).toString();

      const res = await axios.get(`/admin/home/filter?${queryString}`, {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          "Accept-Language": "ar",
        },
      });

      if (res.data.status) {
        setSchoolResults(res.data.data.school || []);
        setAllStudents(res.data.data.student || []);
        setStudentResults(res.data.data.student || []);
        setHasSearched(true); // المستخدم ضغط بحث
      }
    } catch (err) {
      console.error("Error fetching filtered data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSchool = (schoolId: number) => {
    setSelectedSchool(schoolId);
    setSelectedHr("الطلاب"); // عرض الطلاب

    const schoolName = schools.find((s) => s.id === schoolId)?.name;
    if (schoolName) {
      const filteredStudents = allStudents.filter(
        (student) => student.school === schoolName
      );
      setStudentResults(filteredStudents);
    } else {
      setStudentResults([]);
    }
  };

  // تابع useEffect لتحديث الطلاب والإحصائيات عند تغيير selectedSchool
  // useEffect(() => {
  //   if (selectedSchool) {
  //     // fetchStudentList(selectedSchool);
  //     fetchStudentStats(selectedSchool);
  //   }
  // }, [selectedSchool]);

  const fetchStudentList = async (schoolId: number) => {
    try {
      const res = await axios.get(
        `/admin/home/students?school_id=${schoolId}`,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            "Accept-Language": "ar",
          },
        }
      );
      if (res.data.status) {
        setStudentResults(res.data.data || []); // هنا بيملى الطلاب
      }
    } catch (err) {
      console.error("Error fetching students", err);
    }
  };
  const fetchStudentStats = async (schoolId: number) => {
    try {
      setStatsLoading(true);
      const res = await axios.get(
        `/admin/home/student/statistics/${schoolId}`,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            "Accept-Language": "ar",
          },
        }
      );

      if (res.data.status) {
        setStudentStats(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching student statistics", err);
    } finally {
      setStatsLoading(false); // End loading
    }
  };

  const handleViewStudent = async (studentId: number) => {
    try {
      setStatsLoading(true);
      const res = await axios.get(
        `/admin/home/student/statistics/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            "Accept-Language": "ar",
          },
        }
      );

      if (res.data.status) {
        setStudentStats(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching student stats", err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedHr === "الطلاب") {
      setStudentStats({ present: 0, absent: 0, rewards: 0 });
    }
  }, [selectedHr, selectedSchool]); // لو اخترت مدرسة جديدة أو رجعت على الطلاب

  return (
    <section dir="ltr" className="text-right px-2">
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

      <div
        className="flex justify-between items-center flex-wrap gap-5 py-2 mb-5"
        dir="rtl"
      >
        {statsLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl h-[130px] shadow-md p-4 bg-white border border-[#C2C1C1] flex-grow w-[160px] animate-pulse"
              >
                <div className="w-full h-3.5 bg-[#c2c1c1] rounded mb-3"></div>
                <div className="w-[80%] h-3.5 bg-[#c2c1c1] rounded mb-3"></div>
                <div className="w-[60%] h-3.5 bg-[#c2c1c1] rounded"></div>
              </div>
            ))
          : statsData.map((item, index) => (
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
                  <p className={`${item.text} text-base my-1`}>{item.suffix}</p>
                )}
              </div>
            ))}
      </div>

      <div
        className="mb-6 mt-2 border border-[#C2C1C1] rounded-lg bg-white"
        dir="rtl"
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
          {/* Region */}
          <Select
            placeholder="المنطقة"
            className="w-full"
            value={selectedRegion}
            onChange={(val) => setSelectedRegion(val)}
          >
            {regions.map((r) => (
              <Option key={r.id} value={r.id}>
                {r.name}
              </Option>
            ))}
          </Select>

          {/* City */}
          <Select
            placeholder="المدينة"
            className="w-full"
            value={selectedCity}
            onChange={(val) => setSelectedCity(val)}
          >
            {cities
              .filter((c) => !selectedRegion || c.region.id === selectedRegion)
              .map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.name}
                </Option>
              ))}
          </Select>

          {/* Ministry Number */}
          <input
            type="text"
            placeholder="الرقم الوزاري"
            className="w-full p-2 border border-gray-300 rounded"
            value={ministryNumber}
            onChange={(e) => setMinistryNumber(e.target.value)}
          />

          {/* Type */}
          <Select
            placeholder="النوع"
            className="w-full"
            value={selectedType}
            onChange={(val) => setSelectedType(val)}
          >
            <Option value={1}>Primary</Option>
            <Option value={2}>Intermediate</Option>
            <Option value={3}>Secondary</Option>
          </Select>

          {/* Gender */}
          <Select
            placeholder="الجنس"
            className="w-full"
            value={selectedGender}
            onChange={(val) => setSelectedGender(val)}
          >
            <Option value={1}>ذكر</Option>
            <Option value={2}>أنثى</Option>
          </Select>

          {/* School */}
          <Select
            placeholder="اسم المدرسة"
            className="w-full"
            value={selectedSchool}
            onChange={(val) => {
              setSelectedSchool(val);
              fetchStudentStats(val);
              handleSelectSchool(val);
            }}
          >
            {schools.map((s) => (
              <Option key={s.id} value={s.id}>
                {s.name}
              </Option>
            ))}
          </Select>

          {/* Search Button */}
          <Button
            type="primary"
            className="flex justify-center items-center gap-1"
            onClick={handleSearch}
          >
            بحث <IoSearch className="text-lg" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col-reverse xl:flex-row justify-between items-stretch  gap-6">
        <div
          style={{ border: "1px solid #C2C1C1" }}
          className="p-4 rounded-lg w-full xl:w-[35%]"
        >
          <div className="px-6 flex justify-center items-center mb-2 lg:mb-0">
            <img src="/map.png" alt="map" className="w-full max-w-[500px] " />
          </div>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-6 w-full xl:w-[65%]">
          <div
            style={{ border: "1px solid #C2C1C1" }}
            className="flex-1  rounded-lg border border-[#C2C1C1] flex flex-col gap-4 w-full lg:w-1/2"
          >
            <div className="flex gap-2 w-full px-4 pt-3 pb-0">
              {buttonsAttend.map((btn) => {
                const isSelected = selectedAttend === btn;
                return (
                  <button
                    key={btn}
                    onClick={() => setSelectedAttend(btn)}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 border border-[#07A869] border-solid  cursor-pointer
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
            <div className="w-full h-px bg-gray-300 " />
            <div className="flex items-center gap-4 justify-between px-4 mb-8">
              {statsLoading ? (
                <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
              ) : (
                <CircularProgress
                  percentage={studentStats.present}
                  size={90}
                  strokeWidth={10}
                  color="#07A869"
                  bgColor="#E5E7EB"
                />
              )}
              <span className="text-[#15445A] text-lg font-medium hover:text-[#07A869] transition-colors duration-500 ">
                الحضور
              </span>
            </div>

            <div className="flex items-center gap-4 justify-between px-4 mb-8">
              {statsLoading ? (
                <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
              ) : (
                <CircularProgress
                  percentage={studentStats.absent}
                  size={90}
                  strokeWidth={10}
                  color="#07A869"
                  bgColor="#E5E7EB"
                />
              )}

              <span className="text-[#15445A] text-lg font-medium hover:text-[#07A869] transition-colors duration-500 ">
                الغياب
              </span>
            </div>
            <div className="flex items-center gap-4 justify-between px-4 mb-8">
              {statsLoading ? (
                <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
              ) : (
                <CircularProgress
                  percentage={studentStats.absent}
                  size={90}
                  strokeWidth={10}
                  color="#07A869"
                  bgColor="#E5E7EB"
                />
              )}

              <span className="text-[#15445A] text-lg font-medium hover:text-[#07A869] transition-colors duration-500 ">
                المكافئات
              </span>
            </div>
          </div>

          <div
            className="flex-1 rounded-lg border border-[#C2C1C1] flex flex-col  w-full lg:w-1/2"
            style={{ border: "1px solid #C2C1C1" }}
          >
            <div className="flex gap-2 w-full p-4">
              {buttonsHr.map((btn) => {
                const isSelected = selectedHr === btn;
                return (
                  <button
                    key={btn}
                    onClick={() => setSelectedHr(btn)}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 border border-[#07A869] border-solid  cursor-pointer
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
            <div className="w-full h-px bg-gray-300 " />

            <div className="mt-2 overflow-y-auto max-h-[400px]" dir="rtl">
              {!hasSearched ? (
                // Skeleton Loader
                <>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      className="flex flex-row-reverse justify-between items-start px-4 bg-white rounded-lg border border-[#C2C1C1] w-full mt-2 mb-3"
                      key={i}
                    >
                      <button className="text-2xl text-[#15445A] cursor-pointer bg-transparent border-none outline-none">
                        <FiEye />
                      </button>

                      <div className="flex flex-row-reverse items-center gap-3 w-[80%]">
                        <div className="flex-1 flex flex-col gap-2 justify-end items-start">
                          <div className="w-full h-2.5 bg-[#C2C1C1] rounded-md"></div>
                          <div className="w-[70%] h-2.5 bg-[#C2C1C1] rounded-md"></div>
                        </div>

                        <div className="w-10 h-10 bg-[#C2C1C1] rounded-full flex-shrink-0"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : selectedHr === "المدراس" ? (
                <div className="flex flex-col gap-2">
                  {schoolResults.map((school: any) => (
                    <div
                      key={school.id}
                      className="px-3 sm:px-4 w-full mb-1 cursor-pointer"
                      onClick={() => handleSelectSchool(school.id)}
                    >
                      <h4 className="sm:text-right font-semibold text-lg text-[#07A869] hover:text-[#15445A] transition-colors duration-500 mb-1.5">
                        {school.name}
                      </h4>
                      <p className="text-right text-[#15445A] text-base font-semibold mb-3">
                        {school.address}
                      </p>
                    </div>
                  ))}
                </div>
              ) : !selectedSchool ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-center text-[#15445A] font-semibold text-lg">
                    اختر مدرسة أولًا لعرض الطلاب
                  </p>
                </div>
              ) : studentResults.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-center text-[#15445A] font-semibold text-lg">
                    لا يوجد طلاب في هذه المدرسة
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2" dir="ltr">
                  {studentResults.map((student: any) => (
                    <div
                      key={student.id}
                      className="flex sm:flex-row justify-between items-start px-3 sm:px-4"
                    >
                      <button
                        onClick={() => handleViewStudent(student.id)}
                        className="text-2xl text-[#15445A] hover:text-[#07A869] transition-colors duration-500 cursor-pointer bg-transparent border-none outline-none mb-2 sm:mb-0"
                      >
                        <FiEye />
                      </button>
                      <div className="flex flex-col-reverse md:flex-row items-end md:items-center gap-3 w-[100%] sm:w-[80%]">
                        <div className="flex-1 flex flex-col justify-end items-end w-full">
                          <h4 className="sm:text-right font-semibold text-lg text-[#07A869] hover:text-[#15445A] transition-colors duration-500 mb-1.5">
                            {student.name}
                          </h4>
                          <p className="text-right text-[#15445A] text-base font-semibold mb-1">
                            {student.grade}
                          </p>
                          <p className="text-xs text-gray-500">
                            {student.school}
                          </p>
                        </div>
                        <div className="w-16 h-16 bg-[#C2C1C1] rounded-full flex-shrink-0"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col lg:flex-row justify-between items-stretch  gap-6">
        <div style={{ border: '1px solid #C2C1C1' }} className="p-4 rounded-lg w-full lg:w-1/2">
          <div className="px-6 flex justify-center items-center mb-2 lg:mb-0">
            <img src="/map.png" alt="map" className="w-full max-w-[500px] " />
          </div>
        </div>

        <div
          style={{ border: '1px solid #C2C1C1' }}
          className="p-4 rounded-lg w-full lg:w-1/2 flex flex-col justify-center items-center py-10"
        >
          <div className="w-16 h-16 bg-[#dce3e7] rounded-full flex justify-center items-center mb-4">
            <FaExclamation className="text-3xl text-[#15445A]" />
          </div>
          <h4 className="text-[#15445A] text-2xl sm:text-3xl xl:text-4xl leading-tight font-medium text-center">
            اختر أي من المناطق <br /> لإظهار النتائج
          </h4>
        </div>
      </div> */}
    </section>
  );
};

export default AdminHome;
