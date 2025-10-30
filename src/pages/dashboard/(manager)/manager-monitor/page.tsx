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

const ManagerBalance: React.FC = () => {
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

  // GET observations
  const fetchObservations = async (pageNum: number = 1) => {
    setLoadingTable(true);
    try {
      const skip = (pageNum - 1) * pageSize;
      const res = await axios.get(`/manager/observation`, {
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

  // POST - Add new observation
  const handleAddObservation = async (values: any) => {
    try {
      const res = await axios.post(
        `/manager/observation`,
        {
          reason: values.reason,
          subject: values.subject,
          observation_date: values.observation_date.format("YYYY-MM-DD"),
        },
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            "Accept-Language": "ar",
          },
        }
      );

      if (res.data.status) {
        message.success("تم إضافة الملاحظة بنجاح");
        setIsAddModalOpen(false);
        form.resetFields();
        fetchObservations(page);
      } else {
        message.error("فشل في إضافة الملاحظة");
      }
    } catch {
      message.error("حدث خطأ أثناء إضافة الملاحظة");
    }
  };

  const columns: TableColumnsType<Observation> = [
    {
      title: "المدرسة",
      dataIndex: ["school", "name"],
      key: "school",
      align: "center",
      width: "22%",
    },
    {
      title: "سبب فتح الطلب",
      dataIndex: "reason",
      key: "reason",
      align: "center",
      width: "22%",
    },
    {
      title: "الموضوع / المشكلة",
      dataIndex: "subject",
      key: "subject",
      align: "center",
      width: "22%",
    },
    {
      title: "التاريخ",
      dataIndex: "observation_date",
      key: "observation_date",
      align: "center",
      width: "17%",
      render: (date) => (
        <span>{new Date(date).toLocaleDateString("ar-EG")}</span>
      ),
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "17%",
      render: (status: string) => (
        <span
          className={`font-semibold ${
            status === "Pending"
              ? "text-[#F5A623]"
              : status === "Accepted"
              ? "text-[#07A869]"
              : "text-[#db3737]"
          }`}
        >
          {status}
        </span>
      ),
    },
    // {
    //   title: "",
    //   key: "action",
    //   align: "center",
    //   width: "10%",
    //   fixed: "right",
    //   render: (_, record) => (
    //     <Tooltip color="#07A869" title="إضافة ملاحظة جديدة">
    //       <button
    //         className="border-none bg-transparent cursor-pointer"
    //         onClick={() => setIsAddModalOpen(true)}
    //       >
    //         <IoAddCircle className="text-[#07A869] text-3xl" />
    //       </button>
    //     </Tooltip>
    //   ),
    // },
  ];

  return (
    <>
      {isLoading ? (
        <RollerLoading />
      ) : (
        <section dir="ltr" className="text-right px-2">
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
            title={() => (
              <div className="flex items-center justify-between px-2 py-1">
                <h2 className="text-[#15445A] hover:text-[#07A869] transition-colors duration-500 font-semibold text-[20px] sm:text-[22px] text-right">
                  طلب فتح رصد
                </h2>
                <Tooltip color="#07A869" title="طلب فتح رصد">
                  <button
                    className="border-none cursor-pointer"
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    <IoAddCircle className="text-[#07A869] text-3xl hover:scale-110 transition-transform" />
                  </button>
                </Tooltip>
              </div>
            )}
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

          <Modal
            title="طلب فتح رصد"
            open={isAddModalOpen}
            onCancel={() => setIsAddModalOpen(false)}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleAddObservation}
              className="mt-4"
            >
              <Form.Item
                label="سبب فتح الطلب"
                name="reason"
                rules={[{ required: true, message: "الرجاء إدخال السبب" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="الموضوع / المشكلة"
                name="subject"
                rules={[{ required: true, message: "الرجاء إدخال الموضوع" }]}
              >
                <Input />
              </Form.Item>

              <ConfigProvider locale={arEG} direction="rtl">
                <Form.Item
                  label="التاريخ"
                  name="observation_date"
                  rules={[{ required: true, message: "الرجاء اختيار التاريخ" }]}
                >
                  <DatePicker
                    placeholder="حدد التاريخ"
                    className="w-full"
                    format="YYYY-MM-DD"
                    disabledDate={(d) => d && d > dayjs()}
                  />
                </Form.Item>
              </ConfigProvider>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-[#07A869]"
                >
                  حفظ
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </section>
      )}
    </>
  );
};

export default ManagerBalance;
