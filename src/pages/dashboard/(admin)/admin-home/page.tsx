import React, { useEffect, useState } from "react";
import axios from "utlis/library/helpers/axios";
import { Select, Button, Switch } from "antd";
import "antd/dist/reset.css";
import { IoSearch } from "react-icons/io5";
import { useSelector } from "react-redux";
import { FiEye } from "react-icons/fi";
import RollerLoading from "components/loading/roller";
import InlineSvgMap from "components/SaudiMap/SaudiMap";
import TilesMap from "components/SaudiMap/SaudiMap";
import SaudiMap from "components/SaudiMap/SaudiMap";
import Search from "antd/es/transfer/search";
import SchoolsMap from "components/SchoolMap/SchoolMap";

const { Option } = Select;

type CircularProgressProps = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
};
type StudentStats = {
  present: number;
  absent: number;
  late: number;
  rewards: number;
  excuses: number;
};
function CircularProgress({
  percentage,
  size = 200,
  strokeWidth = 20,
  color = "#07A869",
  bgColor = "#D9D9D9",
  isNumber = false,
}: {
  percentage: number | undefined;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  isNumber?: boolean;
}) {
  const safeValue = Number.isFinite(Number(percentage))
    ? Number(percentage)
    : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (Math.min(safeValue, 100) / 100) * circumference;

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
          strokeDashoffset={offset}
          transform={`rotate(90 ${size / 2} ${size / 2})`}
        />
      </svg>

      <span className="absolute text-lg font-bold text-[#15445A]">
        {isNumber
          ? safeValue.toLocaleString() // أرقام عادية زي المكافآت
          : `${safeValue}%`}{" "}
        {/* نسب مؤوية */}
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
  const [isLoading, setIsLoading] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState<number | null>(0);
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
  const [loadingStats, setLoadingStats] = useState(false);

  const [selected, setSelected] = useState<"سنة" | "شهر" | "يوم">("يوم");
  const buttons: Array<"سنة" | "شهر" | "يوم"> = ["سنة", "شهر", "يوم"];
  const [statsLoadingCrud, setStatsLoadingCrud] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [showSchoolsMap, setShowSchoolsMap] = useState(false);
  const [selectedAttend, setSelectedAttend] = useState<
    "الاحصائيات" | "التقارير"
  >("الاحصائيات");
  const buttonsAttend: Array<"الاحصائيات" | "التقارير"> = [
    "الاحصائيات",
    "التقارير",
  ];
  const [selectedHr, setSelectedHr] = useState<"الطلاب" | "المدراس">("المدراس");
  const buttonsHr: Array<"الطلاب" | "المدراس"> = ["الطلاب", "المدراس"];
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);

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

  const filterTypeMapping: Record<"سنة" | "شهر" | "يوم", number> = {
    سنة: 3,
    شهر: 2,
    يوم: 1,
  };
  const { token } = useSelector((state: any) => state.Auth);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
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
              title: "الاعذار",
              value: apiData.excused,
              suffix: "حالة عذر",
              bg: "bg-white",
              text: "text-[#07A869]",
              borderStyle: {
                border: "1px solid #C2C1C1",
                background: "#f9f9f9",
              },
            },
            // {
            //   title: 'الغرامات',
            //   value: apiData.fines.toLocaleString(),
            //   suffix: 'ريال سعودي',
            //   bg: 'bg-[#07A869]',
            //   text: 'text-white',
            //   icon: '/riyal.png',
            // },
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
    if (selectedRegion !== null) {
      handleSearch();
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (regions.length > 0) {
      handleSearch();
    }
  }, [regions]);

  useEffect(() => {
    // Fetch regions
    axios
      .get("/regions", {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          "Accept-Language": "ar",
        },
      })
      .then((res) => {
        if (res.data.status) {
          const regionsData = res.data.data;
          setRegions([{ id: 0, name: "الكل" }, ...regionsData]);
        }
      })
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

  const fetchStats = async (
    regionId?: number,
    schoolId?: number,
    studentId?: number
  ) => {
    try {
      setStatsLoadingCrud(true);

      const params: any = {};
      if (regionId && regionId !== 0) params["filter[region_id]"] = regionId;
      if (schoolId) params["filter[school_id]"] = schoolId;
      if (studentId) params["filter[student_id]"] = studentId;

      const queryString = new URLSearchParams(params).toString();
      console.log(
        "📊 fetchStats URL:",
        `/admin/home/statistic-of-filter?${queryString}`
      );

      const res = await axios.get(
        `/admin/home/statistic-of-filter?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            "Accept-Language": "ar",
          },
        }
      );

      if (res.data.status) {
        setStudentStats({
          present: res.data.data.present,
          absent: res.data.data.absent,
          late: res.data.data.late,
          rewards: res.data.data.rewards,
          excuses: res.data.data.excuses,
        });
      }
    } catch (error) {
      console.error("Error fetching stats", error);
    } finally {
      setStatsLoadingCrud(false);
    }
  };

  const handleSearch = async (
    regionId?: number,
    schoolId?: number,
    studentId?: number
  ) => {
    try {
      setLoading(true);

      const params: any = {};
      const regionToUse = regionId ?? selectedRegion;

      if (schoolId) params["filter[school_id]"] = schoolId;
      if (studentId) params["filter[student_id]"] = studentId;
      if (regionToUse !== null && regionToUse !== 0)
        params["filter[region]"] = regionToUse;
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
        setHasSearched(true);

        if (studentId) {
          fetchStats(regionToUse, schoolId, studentId);
        } else {
          fetchStats(regionToUse, schoolId);
        }
      }
    } catch (err) {
      console.error("Error fetching filtered data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSchool = (schoolId: number) => {
    setSelectedSchool(schoolId);
    setSelectedHr("الطلاب");

    fetchStats(selectedRegion, schoolId);

    const schoolName = schools.find((s) => s.id === schoolId)?.name;
    if (schoolName) {
      const filteredStudents = allStudents.filter(
        (student) => student.school === schoolName
      );
      setStudentResults(filteredStudents);
    }
  };

  useEffect(() => {
    const fetchTopSchools = async () => {
      try {
        const res = await axios.get("/admin/home/top-schools", {
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
      setStatsLoading(false);
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
        fetchStats(selectedRegion, selectedSchool, studentId);
      }
    } catch (err) {
      console.error("Error fetching student stats", err);
    } finally {
      setStatsLoading(false);
    }
  };

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

  const handleSearchRegion = (regionId: number) => {
    // const backendRegion = regionMap[regionCode];
    // if (!backendRegion) return;

    setSelectedRegion(regionId);
    setShowSchoolsMap(true);
    handleSearch(regionId);
  };

  const filteredSchools =
    selectedRegion && selectedRegion !== 0
      ? schoolResults.filter((s) => s.region.id === selectedRegion)
      : schoolResults;

  return (
    <>
      {isLoading ? (
        <RollerLoading />
      ) : (
        <section dir="ltr" className="text-right px-2">
          <div className="bg-[#07A869] rounded-lg px-4 py-3 flex items-center mb-8 gap-4">
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

          <div
            className="flex justify-between items-center flex-wrap gap-5 py-2 mb-5"
            dir="rtl"
          >
            {loadingStats
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
                      <p className={`${item.text} text-base my-1`}>
                        {item.suffix}
                      </p>
                    )}
                  </div>
                ))}
          </div>

          <div
            className="mb-6 mt-2 border border-[#C2C1C1] rounded-lg bg-white"
            dir="rtl"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4"
            >
              {/* Region */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  المنطقة
                </label>
                <Select
                  placeholder="اختر المنطقة"
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
              </div>

              {/* City */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  المدينة
                </label>
                <Select
                  placeholder="اختر المدينة"
                  className="w-full"
                  value={selectedCity}
                  onChange={(val) => setSelectedCity(val)}
                >
                  {cities
                    .filter(
                      (c) => !selectedRegion || c.region.id === selectedRegion
                    )
                    .map((c) => (
                      <Option key={c.id} value={c.id}>
                        {c.name}
                      </Option>
                    ))}
                </Select>
              </div>

              {/* Ministry Number */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  الرقم الوزاري
                </label>
                <input
                  type="text"
                  placeholder="أدخل الرقم الوزاري"
                  className="w-full p-1.5 focus:outline-none hover:border-[#07A869] focus:border-[#07A869] border border-gray-300 border-solid rounded-lg placeholder:text-sm placeholder:text-[#c2c1c1]"
                  value={ministryNumber}
                  onChange={(e) => setMinistryNumber(e.target.value)}
                />
              </div>

              {/* Type */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  المرحلة
                </label>
                <Select
                  placeholder="اختر المرحلة"
                  className="w-full"
                  value={selectedType}
                  onChange={(val) => setSelectedType(val)}
                >
                  <Option value={1}>ابتدائي</Option>
                  <Option value={2}>متوسط</Option>
                  <Option value={3}>ثانوي</Option>
                </Select>
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  النوع
                </label>
                <Select
                  placeholder="اختر النوع"
                  className="w-full"
                  value={selectedGender}
                  onChange={(val) => setSelectedGender(val)}
                >
                  <Option value={1}>بنين</Option>
                  <Option value={2}>بنات</Option>
                </Select>
              </div>

              {/* School */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  اسم المدرسة
                </label>
                <Select
                  placeholder="اختر المدرسة"
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
              </div>

              {/* Search Button */}
              <div className="flex flex-col gap-1 justify-end">
                <label className="invisible">بحث</label>
                <Button
                  type="primary"
                  className="flex justify-center items-center gap-1"
                  onClick={() => handleSearch()}
                  loading={loading}
                >
                  بحث <IoSearch className="text-lg" />
                </Button>
              </div>
            </form>
          </div>

          <div className="flex flex-col-reverse xl:flex-row justify-between items-stretch  gap-6">
            <div
              style={{ border: "1px solid #C2C1C1" }}
              className="p-4 rounded-lg w-full xl:w-[35%] flex justify-center items-center"
            >
              <div className="flex flex-col gap-4 w-full">
                {/* Switch Header */}
                <div className="flex items-center justify-between p-2 border-b border-gray-300">
                  <Switch
                    checked={showSchoolsMap}
                    onChange={(checked) => setShowSchoolsMap(checked)}
                  />
                </div>

                {/* Map Container */}
                <div
                  className="border border-gray-300 rounded-lg overflow-hidden"
                  style={{ width: "100%" }}
                >
                  {showSchoolsMap ? (
                    <SchoolsMap
                      schools={filteredSchools}
                      selectedSchoolId={selectedSchool}
                      onSelectSchool={(id) => handleSelectSchool(id)}
                    />
                  ) : (
                    // <SaudiMap
                    //   regions={region}
                    //   handleSearch={handleSearchRegion}
                    //   selectedRegionId={selectedRegion}
                    // />
                    <SaudiMap
                      regions={region}
                      handleSearch={(regionId) => {
                        setSelectedRegion(regionId);
                        handleSearch(regionId);
                      }}
                      selectedRegionId={selectedRegion}
                    />
                  )}
                </div>
              </div>

              {/* <div className="px-6 flex justify-center items-center mb-2 lg:mb-0">
                <img
                  src="/map.png"
                  alt="map"
                  className="w-full max-w-[500px] "
                />
              </div> */}
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
                  {studentStats?.present != null ? (
                    <CircularProgress
                      percentage={studentStats.present}
                      size={90}
                      strokeWidth={10}
                      // color="#07A869"
                      // bgColor="#E5E7EB"
                    />
                  ) : (
                    <div className="w-[90px] h-[90px] rounded-full bg-gray-200 animate-pulse" />
                  )}

                  <span className="text-[#15445A] text-lg font-medium hover:text-[#07A869] transition-colors duration-500 ">
                    الحضور
                  </span>
                </div>

                <div className="flex items-center gap-4 justify-between px-4 mb-8">
                  {studentStats?.absent != null ? (
                    <CircularProgress
                      percentage={studentStats.absent}
                      size={90}
                      strokeWidth={10}
                      // color="#07A869"
                      // bgColor="#E5E7EB"
                    />
                  ) : (
                    <div className="w-[90px] h-[90px] rounded-full bg-gray-200 animate-pulse" />
                  )}

                  <span className="text-[#15445A] text-lg font-medium hover:text-[#07A869] transition-colors duration-500 ">
                    الغياب
                  </span>
                </div>
                <div className="flex items-center gap-4 justify-between px-4 mb-8">
                  {studentStats?.rewards ? (
                    <CircularProgress
                      percentage={studentStats.rewards}
                      size={90}
                      strokeWidth={10}
                      isNumber
                      // color="#07A869"
                      // bgColor="#E5E7EB"
                    />
                  ) : (
                    <div className="w-[90px] h-[90px] rounded-full bg-gray-200 animate-pulse" />
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
                      {loading ? (
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
                      ) : schoolResults.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                          <p className="text-center text-[#15445A] font-semibold text-lg pt-3 pb-1">
                            لا يوجد مدارس
                          </p>
                        </div>
                      ) : (
                        schoolResults.map((school: any) => (
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
                        ))
                      )}
                    </div>
                  ) : !selectedSchool ? (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-center text-[#15445A] font-semibold text-lg pt-3 pb-1">
                        اختر مدرسة أولًا لعرض الطلاب
                      </p>
                    </div>
                  ) : studentResults.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-center text-[#15445A] font-semibold text-lg pt-3 pb-1">
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
                            <img
                              src={student.image}
                              alt="student img"
                              className="w-14 h-14 rounded-full"
                            />
                            {/* <div className="w-16 h-16 bg-[#C2C1C1] rounded-full flex-shrink-0"></div> */}
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
      )}
    </>
  );
};

export default AdminHome;
