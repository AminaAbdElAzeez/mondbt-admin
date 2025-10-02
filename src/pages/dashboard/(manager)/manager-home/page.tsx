import React, { useEffect, useState } from "react";
import axios from "utlis/library/helpers/axios";
import "antd/dist/reset.css";
import { useSelector } from "react-redux";
import { FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";
import RollerLoading from "components/loading/roller";

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
        %{percentage.toFixed(2)}
      </span>
    </div>
  );
}

const ManagerHome: React.FC = () => {
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
  const [isLoading, setIsLoading] = useState(false);

  const [topSchools, setTopSchools] = useState<
    Array<{ school_id: number; score: number; school_name: string }>
  >([]);
  const [grades, setGrades] = useState<
    Array<{
      grade_id: number;
      grade_name: string;
      students: Array<{ id: number; name: string; image?: string }>;
    }>
  >([]);
  const [selectedStudentStats, setSelectedStudentStats] = useState({
    present: 0,
    absent: 0,
    rewards: 0,
    excuses: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsLoadingStudent, setStatsLoadingStudent] = useState(true);

  const [selected, setSelected] = useState<"سنة" | "شهر" | "يوم">("يوم");
  const buttons: Array<"سنة" | "شهر" | "يوم"> = ["سنة", "شهر", "يوم"];
  const [animatedStats, setAnimatedStats] = useState({
    present: 0,
    absent: 0,
    rewards: 0,
  });
  const [loading, setLoading] = useState(true);

  const [filteredData, setFilteredData] = useState<{
    school: any[];
    student: any[];
  }>({ school: [], student: [] });

  const [studentStats, setStudentStats] = useState<{
    present: number;
    absent: number;
    rewards: number;
  }>({
    present: 0,
    absent: 0,
    rewards: 0,
  });

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
        setLoading(true);
        setStatsLoading(true);

        const type = filterTypeMapping[selected]; // 1 يوم، 2 شهر، 3 سنة
        const res = await axios.get(
          `manager/home/statistic?filter[type]=${type}`,
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
            // {
            //   title: "الغرامات",
            //   value: apiData.fines.toLocaleString(),
            //   suffix: "ريال سعودي",
            //   bg: "bg-[#07A869]",
            //   text: "text-white",
            //   icon: "/riyal.png",
            // },
            {
              title: "الغياب بعذر",
              value: apiData.excused.toLocaleString(),
              suffix: "طالب",
              bg: "bg-[#07A869]",
              text: "text-white",
            },
            {
              title: "الغياب بدون عذر",
              value: apiData.withoutExcused.toLocaleString(),
              suffix: "طالب",
              bg: "bg-white",
              text: "text-[#07A869]",
              borderStyle: {
                border: "1px solid #C2C1C1",
                background: "#f9f9f9",
              },
            },
          ];

          setStatsData(formattedStats);
        }
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setStatsLoading(false);
        setLoading(false);
      }
    };

    fetchStats();
  }, [selected, token]);

  useEffect(() => {
    const fetchTopSchools = async () => {
      try {
        const res = await axios.get("/manager/home/top-schools", {
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
    const fetchStudents = async () => {
      try {
        const res = await axios.get("/manager/home/students", {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            "Accept-Language": "ar",
          },
        });
        if (res.data) setGrades(res.data);
      } catch (err) {
        console.error("Error fetching students", err);
      }
    };

    fetchStudents();
  }, [token]);

  const handleViewStudent = async (studentId: number) => {
    try {
      setStatsLoadingStudent(true);
      const res = await axios.get(
        `/manager/home/student/statistics/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            "Accept-Language": "ar",
          },
        }
      );
      const stats = res.data.data;

      setSelectedStudentStats({
        present: stats.present || 0,
        absent: stats.absent || 0,
        rewards: stats.rewards || 0,
        excuses: stats.excuses || 0,
      });
    } catch (err) {
      console.error("Error fetching student stats", err);
    } finally {
      setStatsLoadingStudent(false);
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
  return (
    <>
      {" "}
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
                      <p className={`${item.text} text-base my-1`}>
                        {item.suffix}
                      </p>
                    )}
                  </div>
                ))}
          </div>

          <div
            className="flex flex-col lg:flex-row justify-between items-stretch gap-5 py-2 mb-5"
            dir="rtl"
          >
            <div
              className=" rounded-lg border flex flex-col gap-4 !w-full lg:!w-1/2"
              style={{ border: "1px solid #C2C1C1" }}
              dir="ltr"
            >
              <div className="flex-shrink-0">
                <h4 className="text-[#07A869] font-semibold text-xl text-right px-4 pt-4 pb-2">
                  قائمة الطلاب
                </h4>
                <div className="w-full h-px bg-gray-300 " />
              </div>
              <div className="flex-1 overflow-y-auto max-h-[400px] px-[3px]  sm:px-0">
                {grades.map((grade) => (
                  <div key={grade.grade_id} className="w-full mb-5">
                    <h4 className="text-[#07A869] hover:text-[#15445A] transition-colors duration-500 text-lg sm:text-xl font-semibold mb-4 px-2 sm:px-4">
                      {grade.grade_name}
                    </h4>

                    {grade.students.map((student) => (
                      <div
                        key={student.id}
                        className="flex sm:flex-row justify-between items-start px-3 sm:px-4 bg-white rounded-lg border border-[#C2C1C1] w-full mb-1"
                      >
                        <button
                          onClick={() => handleViewStudent(student.id)}
                          className="text-2xl text-[#15445A] hover:text-[#07A869] transition-colors duration-500 cursor-pointer bg-transparent border-none outline-none mb-2 sm:mb-0"
                        >
                          <FiEye />
                        </button>

                        <div className="flex flex-col-reverse md:flex-row items-end md:items-center gap-3 w-[100%] sm:w-[80%]">
                          <div className="flex-1 flex flex-col justify-end items-end w-full">
                            <Link
                              to={`/manager/student/${student.id}`}
                              className="= sm:text-right font-semibold text-lg text-[#07A869] hover:text-[#15445A] transition-colors duration-500 mb-1.5 px-0"
                            >
                              {student.name}
                            </Link>
                            <p className="text-right text-[#15445A] text-base font-semibold mb-3">
                              {grade.grade_name}
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
                ))}
              </div>
            </div>
            <div
              style={{ border: "1px solid #C2C1C1" }}
              dir="ltr"
              className=" rounded-lg border flex flex-col gap-4 !w-full lg:!w-1/2 "
            >
              <div className="flex-shrink-0">
                <h4 className="text-[#07A869] font-semibold text-xl text-right px-4 pt-4 pb-2">
                  إحصائيات الطالب
                </h4>
                <div className="w-full h-px bg-gray-300 " />
              </div>
              <div className="flex-1 overflow-y-auto max-h-[400px]  px-4">
                <div className="flex items-center gap-4 justify-between px-4 mb-8">
                  {statsLoadingStudent ? (
                    <div className="w-[90px] h-[90px] rounded-full bg-gray-200 animate-pulse" />
                  ) : (
                    <CircularProgress
                      percentage={selectedStudentStats.present}
                      size={100}
                      strokeWidth={12}
                      color="#07A869"
                      bgColor="#E5E7EB"
                    />
                  )}
                  <span className="text-[#15445A] text-lg font-medium">
                    الحضور
                  </span>
                </div>

                <div className="flex items-center gap-4 justify-between px-4 mb-8">
                  {statsLoadingStudent ? (
                    <div className="w-[90px] h-[90px] rounded-full bg-gray-200 animate-pulse" />
                  ) : (
                    <CircularProgress
                      percentage={selectedStudentStats.absent}
                      size={100}
                      strokeWidth={12}
                      color="#07A869"
                      bgColor="#E5E7EB"
                    />
                  )}
                  <span className="text-[#15445A] text-lg font-medium">
                    الغياب
                  </span>
                </div>

                <div className="flex items-center gap-4 justify-between px-4 mb-8">
                  {statsLoadingStudent ? (
                    <div className="w-[90px] h-[90px] rounded-full bg-gray-200 animate-pulse" />
                  ) : (
                    <CircularProgress
                      percentage={selectedStudentStats.excuses}
                      size={100}
                      strokeWidth={12}
                      color="#07A869"
                      bgColor="#E5E7EB"
                    />
                  )}
                  <span className="text-[#15445A] text-lg font-medium">
                    الاعذار
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ManagerHome;
