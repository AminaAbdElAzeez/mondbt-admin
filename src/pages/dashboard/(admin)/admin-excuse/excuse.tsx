import { message, Modal, Popconfirm, Table, TableColumnsType } from "antd";
import RollerLoading from "components/loading/roller";
import SaudiMap from "components/SaudiMap/SaudiMap";
import React, { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
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
import { Tooltip as AntdTooltip } from "antd";

import axios from "utlis/library/helpers/axios";
import { FaCircleCheck, FaSquareCheck } from "react-icons/fa6";
import { IoCheckbox, IoCloseCircle } from "react-icons/io5";
import { AiFillCloseSquare } from "react-icons/ai";

type CircularProgressProps = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
};
type Excuse = {
  id: number;
  type: string;
  student: string;
  status: string;
  date: string;
  file: string;
  region: string;
  school: string;
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

const AdminExcuse: React.FC = () => {
  const [selected, setSelected] = useState<"سنة" | "شهر" | "يوم">("يوم");
  const buttons: Array<"سنة" | "شهر" | "يوم"> = ["سنة", "شهر", "يوم"];
  const [selectedBottom, setSelectedBottom] = useState<"سنة" | "شهر" | "يوم">(
    "يوم"
  );
  const buttonsBottom: Array<"سنة" | "شهر" | "يوم"> = ["سنة", "شهر", "يوم"];
  const { token } = useSelector((state: any) => state.Auth);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [excuses, setExcuses] = useState<Excuse[]>([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    const fetchAttendance = async () => {
      if (!selectedRegionId) return;
      try {
        setLoading(true);
        const type = filterTypeMapping[selected];
        const res = await axios.get(
          `/admin/excuses?filter[type]=${type}&region_id=${selectedRegionId}`,
          {
            headers: {
              Authorization: `Bearer ${token || localStorage.getItem("token")}`,
              "Accept-Language": "ar",
            },
          }
        );
        if (res.data.status) {
          setAttendanceData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching attendance data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selected, selectedRegionId]);

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

  const fetchExcuses = async (pageNum: number = 1) => {
    setLoadingTable(true);
    try {
      const skip = (pageNum - 1) * pageSize;
      const res = await axios.get(`/admin/student/excuses`, {
        params: { take: pageSize, skip },
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "ar",
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
        },
      });

      setExcuses(res.data.data.excuses || []);
      setTotal(res.data.data.count || 0);
    } catch (err) {
      message.error("فشل في تحميل البيانات");
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    fetchExcuses(page);
  }, [page]);

  const handleAction = async (id: number, action: "accept" | "reject") => {
    try {
      const res = await axios.post(
        `/admin/student/excuses/${action}/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": "ar",
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.status) {
        message.success(res.data.message);
        fetchExcuses(page);
      } else {
        message.error("فشل في العملية");
      }
    } catch {
      message.error("حصل خطأ أثناء العملية");
    }
  };

  const columns: TableColumnsType<Excuse> = [
    {
      title: "الطالب",
      dataIndex: "student",
      key: "student",
      align: "center",
      width: "20%",
    },
    {
      title: "المدرسة",
      dataIndex: "school",
      key: "school",
      align: "center",
      width: "20%",
    },
    {
      title: "الوصف",
      dataIndex: "type",
      key: "type",
      align: "center",
      width: "15%",
    },
    {
      title: "التاريخ",
      dataIndex: "date",
      key: "date",
      align: "center",
      width: "15%",
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "15%",

      render: (status: string) => <span>{status}</span>,
    },
    {
      title: "",
      key: "action",
      align: "center",
      width: "15%",
      fixed: "right",

      render: (_, record) => (
        <div className="flex justify-center gap-1 sm:gap-1.5">
          <AntdTooltip title="قبول العذر" color="#07A869">
            <Popconfirm
              title={
                <span className="text-[#07a869] font-bold">تأكيد القبول</span>
              }
              icon={<FaCircleCheck className="text-[#07a869] text-xl ml-1" />}
              onConfirm={() => handleAction(record.id, "accept")}
              okText="نعم"
              cancelText="إلغاء"
              okButtonProps={{
                className:
                  "!bg-[#07a869] !text-white px-3 py-1 rounded cursor-pointer border border-solid border-[#07a869] hover:!text-[#07a869] hover:!bg-[#fff] transition-colors duration-500",
              }}
              // cancelButtonProps={{
              //   className:
              //     'bg-[#db3737] text-white px-3 py-1 rounded cursor-pointer border border-solid border-[#db3737] hover:text-[#db3737] hover:bg-[#fff] transition-colors duration-500',
              // }}
            >
              <button className="bg-transparent border-0">
                <IoCheckbox className="text-[#07a869] text-2xl xl:text-3xl cursor-pointer" />
              </button>
            </Popconfirm>
          </AntdTooltip>

          <AntdTooltip title="رفض العذر" color="#db3737">
            <Popconfirm
              title={
                <span className="text-[#db3737] font-bold">تأكيد الرفض</span>
              }
              icon={<IoCloseCircle className="text-[#db3737] text-xl ml-1" />}
              onConfirm={() => handleAction(record.id, "reject")}
              okText="نعم"
              cancelText="إلغاء"
              okButtonProps={{
                className:
                  "!bg-[#db3737] !text-white px-3 py-1 rounded cursor-pointer border border-solid border-[#db3737] hover:!text-[#db3737] hover:!bg-[#fff] transition-colors duration-500",
              }}
              // cancelButtonProps={{
              //   className:
              //     'bg-[#db3737] text-white px-3 py-1 rounded cursor-pointer border border-solid border-[#db3737] hover:text-[#db3737] hover:bg-[#fff] transition-colors duration-500',
              // }}
            >
              <button className="bg-transparent border-0">
                <AiFillCloseSquare className="text-[#db3737] text-2xl xl:text-3xl cursor-pointer rounded-2xl" />
              </button>
            </Popconfirm>
          </AntdTooltip>

          <AntdTooltip title="عرض التفاصيل" color="#15445A">
            <FiEye
              className="text-[#15445A] text-xl xl:text-2xl cursor-pointer mt-[2px]"
              onClick={() => {
                setSelectedFile(record.file);
                setIsModalOpen(true);
              }}
            />
          </AntdTooltip>
        </div>
      ),
    },
  ];

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
          <div className=" mb-5 md:mb-3 flex flex-col-reverse md:flex-row justify-end items-end lg:items-start gap-1 md:gap-2">
            <button
              onClick={async () => {
                try {
                  const res = await axios.get(
                    `/exports/excuses?filter[type]=${filterTypeMapping[selected]}&region_id=${selectedRegionId}`,
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

                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute(
                    "download",
                    `attendance_${selectedRegionId}.xlsx`
                  ); // أو .csv
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                } catch (error) {
                  console.error("خطأ أثناء تحميل الملف", error);
                }
              }}
              className="bg-[#07A869] outline-0 border border-[#07A869] border-solid rounded-3xl py-2 px-8 text-[#fff] text-base font-medium hover:bg-[#fff] hover:text-[#07A869] transition-colors duration-500 cursor-pointer"
            >
              اصدار التقرير
            </button>
            <h2 className="text-[#15445A] font-semibold hover:text-[#07A869] transition-colors duration-500">
              احصائيات الاعذار
            </h2>
          </div>

          <div className="flex flex-col xl:flex-row justify-between items-center xl:items-stretch mb-7  gap-6">
            <div
              style={{ border: "1px solid #C2C1C1" }}
              className="p-4 rounded-lg w-full xl:w-1/2"
            >
              <SaudiMap
                regions={regions}
                selectedRegionId={selectedRegionId}
                handleSearch={setSelectedRegionId}
              />
            </div>

            <div
              style={{ border: "1px solid #C2C1C1" }}
              className="p-4 rounded-lg w-full xl:w-1/2 "
            >
              <h3 className="text-xl font-semibold text-[#07A869] mb-8">
                {regions.find((r) => r.id === selectedRegionId)?.name ||
                  "اختر منطقة"}
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
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div className="w-[140px] h-[140px] rounded-full bg-gray-200 animate-pulse" />
                  ))
                ) : (
                  <>
                    <CircularProgress
                      label="البنات"
                      percentage={attendanceData.female}
                      size={140}
                    />
                    <CircularProgress
                      label="البنين"
                      percentage={attendanceData.male}
                      size={140}
                    />
                    <CircularProgress
                      label="الكل"
                      percentage={attendanceData.all}
                      size={140}
                    />
                    <CircularProgress
                      label="الثانوي"
                      percentage={attendanceData.secondary}
                      size={140}
                    />
                    <CircularProgress
                      label="المتوسط"
                      percentage={attendanceData.intermidite}
                      size={140}
                    />
                    <CircularProgress
                      label="الابتدائي"
                      percentage={attendanceData.primary}
                      size={140}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          <Table<Excuse>
            bordered
            dataSource={excuses}
            columns={columns}
            loading={loadingTable}
            pagination={{
              current: page,
              pageSize,
              total,
              responsive: true,
              //  size: "small",
              onChange: (p) => setPage(p),
              showSizeChanger: false,
            }}
            rowKey="id"
            scroll={{ x: 800, y: 300 }}
            className="custom-table rounded-lg"
            style={{ border: "1px solid #D9D9D9" }}
          />
          <Modal
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            width="80%"
          >
            {selectedFile && (
              <iframe
                src={selectedFile}
                width="100%"
                height="600px"
                title="Excuse File"
              />
            )}
          </Modal>
        </section>
      )}
    </>
  );
};

export default AdminExcuse;
