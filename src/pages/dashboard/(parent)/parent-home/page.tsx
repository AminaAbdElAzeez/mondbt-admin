import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
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
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Modal, Table, TableColumnsType, Tag } from "antd";
import { FiEye } from "react-icons/fi";
import { Tooltip } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "utlis/library/helpers/axios";
import { useSelector } from "react-redux";
import RollerLoading from "components/loading/roller";

interface Excuse {
  key: string;
  description: string;
  date: string;
  son: string;
  status: string;
  file?: string;
}
interface Child {
  id: number;
  name: string;
  grade: string;
  school?: string;
  image?: string;
}

const ParentHome: React.FC = () => {
  // children
  const [children, setChildren] = useState<Child[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(false);

  // fines
  const [fine, setFine] = useState<number>(0);
  const [loadingFine, setLoadingFine] = useState(false);

  // excuses
  const [excuses, setExcuses] = useState<Excuse[]>([]);
  const [loadingExcuses, setLoadingExcuses] = useState(false);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useSelector((state: any) => state.Auth);
  const [topSchools, setTopSchools] = useState<
    Array<{ school_id: number; score: number; school_name: string }>
  >([]);

  const columns: TableColumnsType<Excuse> = [
    {
      title: "الوصف",
      dataIndex: "type",
      key: "type",
      width: "25%",
      align: "center",
      // render: (text) =>
      //   text || (
      //     <p className="text-gray-300">{<FormattedMessage id="noData" />}</p>
      //   ),
    },
    {
      title: "التاريخ",
      dataIndex: "date",
      key: "date",
      width: "21%",
      align: "center",
    },
    {
      title: "الابن",
      dataIndex: "student",
      key: "student",
      width: "27%",
      align: "center",
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      width: "19%",
      align: "center",

      render: (status: string) => <span className="!m-0">{status}</span>,
    },

    {
      title: "",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: "8%",
      render: (_, record: any) => (
        <Tooltip title="عرض التفاصيل" color="#07A869">
          <FiEye
            className="text-[#15445A] text-xl cursor-pointer"
            onClick={() => {
              setSelectedFile(record.file);
              setIsModalOpen(true);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  useEffect(() => {
    const fetchTopSchools = async () => {
      try {
        const res = await axios.get("/parent/top-schools", {
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

  // fetch children
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoadingChildren(true);
        const res = await axios.get(`parent/children`, {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            "Accept-Language": "ar",
          },
        });
        setChildren(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching children", error);
      } finally {
        setLoadingChildren(false);
      }
    };

    fetchChildren();
  }, []);

  // fetch total fine
  useEffect(() => {
    const fetchFine = async () => {
      try {
        setLoadingFine(true);
        const res = await axios.get(`parent/totalfine`, {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        });
        setFine(res.data?.data?.fine_amount || 0);
      } catch (error) {
        console.error("Error fetching fine", error);
      } finally {
        setLoadingFine(false);
      }
    };

    fetchFine();
  }, []);

  // fetch excuses
  useEffect(() => {
    const fetchExcuses = async () => {
      try {
        setLoadingExcuses(true);
        const res = await axios.get(`parent/excuses`, {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            "Accept-Language": "ar",
          },
        });
        setExcuses(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching excuses", error);
      } finally {
        setLoadingExcuses(false);
      }
    };

    fetchExcuses();
  }, []);

  // check file type
  const renderFile = () => {
    if (!selectedFile) return null;
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(selectedFile);
    const isPDF = /\.pdf$/i.test(selectedFile);

    if (isImage) {
      return (
        <div className="w-full flex justify-center">
          <img
            src={selectedFile}
            alt="excuse file"
            className="max-w-full max-h-[80vh] rounded-lg object-contain"
          />
        </div>
      );
    }

    if (isPDF) {
      return (
        <div className="w-full h-[70vh] md:h-[80vh]">
          <iframe
            src={selectedFile}
            title="excuse pdf"
            className="w-full h-full rounded-lg border-none"
          />
        </div>
      );
    }

    return (
      <a
        href={selectedFile}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#07A869] underline"
      >
        تحميل الملف
      </a>
    );
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
      {isLoading ? (
        <RollerLoading />
      ) : (
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

          <div className=" mb-1 flex flex-col-reverse lg:flex-row justify-end items-end lg:items-start  gap-1 lg:gap-5">
            <h2 className="text-[#15445A] font-semibold hover:text-[#07A869] transition-colors duration-500">
              أبنائي
            </h2>
          </div>

          <div
            className="flex justify-between items-center flex-wrap gap-5 py-2 mb-5"
            dir="rtl"
          >
            {loadingChildren ? (
              <p className="text-[#07A869] text-center text-2xl w-full">
                جار التحميل...
              </p>
            ) : children.length === 0 ? (
              <p className="text-[#ff0000] text-center text-2xl w-full">
                لا يوجد أبناء
              </p>
            ) : (
              children.map((child) => (
                <div
                  key={child.id}
                  className="rounded-xl shadow-md p-4 pb-6 transform transition duration-300 hover:scale-105 hover:shadow-xl flex-grow w-[230px] text-right cursor-pointer"
                  style={{ border: "1px solid #07A86940" }}
                  onClick={() => navigate(`/parent/student/${child.id}`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-max flex items-center gap-3">
                      <img
                        src={child.image}
                        alt="student img"
                        className="w-12 h-12 rounded-full bg-[#D9D9D9]"
                      />
                      <span className="text-[#07A869] text-lg font-semibold">
                        {child.name}
                      </span>
                    </div>
                    <BsThreeDotsVertical className="text-2xl text-[#15445A] cursor-pointer hover:text-[#07A869] transition-colors duration-500" />
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <strong className="text-[#07A869] w-[50px]">الصف:</strong>
                      <span className="text-[#15445A]">{child.grade}</span>
                    </div>
                    {child.school && (
                      <div className="flex items-center gap-2 text-sm">
                        <strong className="text-[#07A869] w-[50px]">
                          المدرسة:
                        </strong>
                        <span className="text-[#15445A] text-[13px]">
                          {child.school}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className=" mb-1 flex flex-col-reverse lg:flex-row justify-end items-end lg:items-start  gap-1 lg:gap-5">
            <h2 className="text-[#15445A] font-semibold hover:text-[#07A869] transition-colors duration-500">
              قائمة الاستئذان
            </h2>
          </div>
          <Table<Excuse>
            bordered
            dataSource={excuses}
            columns={columns}
            loading={loadingExcuses}
            pagination={false}
            rowKey="id"
            scroll={{ x: 800, y: 300 }}
            className="custom-table rounded-lg"
            style={{ border: "1px solid #D9D9D9" }}
            footer={() => (
              <div className="flex justify-end">
                <button className="bg-[#07A869] text-[#fff] text-sm sm:text-base font-semibold px-8 py-2 rounded-3xl outline-none border border-[#07A869] border-solid cursor-pointer hover:text-[#07A869] hover:bg-[#fff] transition-colors duration-500 ">
                  عرض الكل
                </button>
              </div>
            )}
          />

          {/* Modal */}
          <Modal
            title={
              <p className="text-2xl text-[#07A869] cursor-pointer hover:text-[#15445A] transition-colors duration-500">
                عرض الملف
              </p>
            }
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            width="80%"
            style={{ top: 20 }}
          >
            {renderFile()}
          </Modal>

          <div
            className={`rounded-xl shadow-md p-4 transform transition duration-300  mt-5`}
            style={{ border: "1px solid #D9D9D9" }}
          >
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-start mb-1.5 gap-1">
              <div className="flex items-center gap-2 justify-end text-[#07A869]">
                <img
                  src="/green-riyal.png"
                  alt="icon"
                  className="w-7 md:w-9 h-auto"
                />
                {loadingFine ? (
                  <span className="text-[#07A869]  text-xl">
                    جار التحميل...
                  </span>
                ) : (
                  <span className="text-[#07A869]  text-2xl font-semibold">
                    {fine.toLocaleString()}
                  </span>
                )}
              </div>
              <h3 className="text-[#07A869] hover:text-[#15445A] transition-colors duration-500  text-xl sm:text-2xl font-semibold">
                <bdi>مجموع الغرامات:</bdi>
              </h3>
            </div>

            <div className="flex justify-center md:justify-start mb-1.5">
              <Link
                to="/parent/pay-total-fines"
                className="bg-[#07A869] text-[#fff] text-sm sm:text-base font-semibold px-8 py-2 rounded-3xl outline-none border border-[#07A869] border-solid cursor-pointer hover:text-[#07A869] hover:bg-[#fff] transition-colors duration-500 "
              >
                دفع الغرامات
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ParentHome;

// {isLoading ? (
//             <RollerLoading />
//           ) : (
