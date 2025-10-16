import {
  message,
  Modal,
  Popconfirm,
  Table,
  TableColumnsType,
  Tooltip as AntdTooltip,
  Button,
  Input,
  DatePicker,
  Form,
  Tooltip,
} from "antd";
import RollerLoading from "components/loading/roller";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "utlis/library/helpers/axios";
import { FiEye } from "react-icons/fi";
import { IoAddCircle, IoCheckbox, IoCloseCircle } from "react-icons/io5";
import { AiFillCloseSquare } from "react-icons/ai";
import { FaCircleCheck } from "react-icons/fa6";
import dayjs from "dayjs";
import { ConfigProvider } from "antd";
import arEG from "antd/es/locale/ar_EG";
import "dayjs/locale/ar";

type Observation = {
  id: number;
  school: { id: number; name: string };
  reason: string;
  subject: string;
  status: string;
  observation_date: string;
  file?: string;
};

const AdminMonitor: React.FC = () => {
  const { token } = useSelector((state: any) => state.Auth);

  const [observations, setObservations] = useState<Observation[]>([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form] = Form.useForm();

  // GET /admin/observation
  const fetchObservations = async (pageNum: number = 1) => {
    setLoadingTable(true);
    try {
      const skip = (pageNum - 1) * pageSize;
      const res = await axios.get(`/admin/observation`, {
        params: { take: pageSize, skip },
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          "Accept-Language": "ar",
        },
      });

      if (res.data.status) {
        setObservations(res.data.data || []);
        setTotal(res.data.data?.length || 0);
      } else {
        message.error("فشل في تحميل البيانات");
      }
    } catch {
      message.error("حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoadingTable(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchObservations(page);
  }, [page]);

  // POST approve/reject
  const handleAction = async (id: number, action: "approve" | "reject") => {
    try {
      const res = await axios.post(
        `/admin/observation/${action}/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            "Accept-Language": "ar",
          },
        }
      );

      if (res.data.status) {
        message.success("تم تنفيذ العملية بنجاح");
        fetchObservations(page);
      } else {
        message.error("فشل في تنفيذ العملية");
      }
    } catch {
      message.error("حدث خطأ أثناء تنفيذ العملية");
    }
  };

  const columns: TableColumnsType<Observation> = [
    {
      title: "المدرسة",
      dataIndex: ["school", "name"],
      key: "school",
      align: "center",
      width: "20%",
    },
    {
      title: "سبب فتح الطلب",
      dataIndex: "reason",
      key: "reason",
      align: "center",
      width: "20%",
    },
    {
      title: "الموضوع / المشكلة",
      dataIndex: "subject",
      key: "subject",
      align: "center",
      width: "20%",
    },
    {
      title: "التاريخ",
      dataIndex: "observation_date",
      key: "observation_date",
      align: "center",
      width: "15%",
      render: (date) => (
        <span>{new Date(date).toLocaleDateString("ar-EG")}</span>
      ),
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "15%",
      render: (status: string) => (
        <span
          className={`font-semibold ${
            status.includes("انتظار")
              ? "text-[#F5A623]"
              : status.includes("موافقة")
              ? "text-[#07A869]"
              : "text-[#db3737]"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "الإجراءات",
      key: "action",
      align: "center",
      width: "15%",
      render: (_, record) => (
        <div className="flex justify-center gap-1 sm:gap-1.5">
          <AntdTooltip title="قبول الملاحظة" color="#07A869">
            <Popconfirm
              title={
                <span className="text-[#07a869] font-bold">تأكيد القبول</span>
              }
              icon={<FaCircleCheck className="text-[#07a869] text-xl ml-1" />}
              onConfirm={() => handleAction(record.id, "approve")}
              okText="نعم"
              cancelText="إلغاء"
              okButtonProps={{
                className:
                  "!bg-[#07a869] !text-white px-3 py-1 rounded cursor-pointer border border-solid border-[#07a869] hover:!text-[#07a869] hover:!bg-[#fff] transition-colors duration-500",
              }}
            >
              <button className="bg-transparent border-0">
                <IoCheckbox className="text-[#07a869] text-2xl xl:text-3xl cursor-pointer" />
              </button>
            </Popconfirm>
          </AntdTooltip>

          <AntdTooltip title="رفض الملاحظة" color="#db3737">
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
            >
              <button className="bg-transparent border-0">
                <AiFillCloseSquare className="text-[#db3737] text-2xl xl:text-3xl cursor-pointer rounded-2xl" />
              </button>
            </Popconfirm>
          </AntdTooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      {isLoading ? (
        <RollerLoading />
      ) : (
        <section dir="ltr" className="text-right px-2">
          <div className="mb-5 flex justify-between items-center">
            {/* <h2 className="text-[#15445A] hover:text-[#07A869] transition-colors duration-500 font-semibold text-[20px] sm:text-[22px] text-right">
              إدارة ملاحظات المدارس
            </h2> */}
          </div>

          <Table<Observation>
            bordered
            dataSource={observations}
            columns={columns}
            loading={loadingTable}
            pagination={{
              current: page,
              pageSize,
              total,
              onChange: (p) => setPage(p),
              showSizeChanger: false,
            }}
            rowKey="id"
            scroll={{ x: 1200, y: 400 }}
            className="custom-table rounded-lg"
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
                title="Observation File"
              />
            )}
          </Modal>
        </section>
      )}
    </>
  );
};

export default AdminMonitor;
