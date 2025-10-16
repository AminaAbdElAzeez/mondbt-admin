"use client";
import { Table, TableColumnsType, message } from "antd";
import RollerLoading from "components/loading/roller";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "utlis/library/helpers/axios";

type Contact = {
  name: string;
  phone: string;
  type: string;
  created_at: string;
};

const AdminContactPage: React.FC = () => {
  const { token } = useSelector((state: any) => state.Auth);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  // GET /admin/contact
  const fetchContacts = async (pageNum: number = 1) => {
    setLoadingTable(true);
    try {
      const skip = (pageNum - 1) * pageSize;
      const res = await axios.get(`/admin/contact`, {
        params: { take: pageSize, skip },
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          "Accept-Language": "ar",
        },
      });

      if (res.data.status) {
        setContacts(res.data.data || []);
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
    fetchContacts(page);
  }, [page]);

  const columns: TableColumnsType<Contact> = [
    {
      title: "الاسم",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: "25%",
    },
    {
      title: "رقم الهاتف",
      dataIndex: "phone",
      key: "phone",
      align: "center",
      width: "25%",
    },
    {
      title: "نوع الاستفسار",
      dataIndex: "type",
      key: "type",
      align: "center",
      width: "25%",

      render: (type: string) => (
        <span
        // className={`font-semibold ${
        //   type === "استفسار"
        //     ? "text-[#0077b6]"
        //     : type === "اقتراح"
        //     ? "text-[#07A869]"
        //     : "text-[#db3737]"
        // }`}
        >
          {type}
        </span>
      ),
    },
    {
      title: "تاريخ الإرسال",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      width: "25%",

      render: (date) => (
        <span>{new Date(date).toLocaleDateString("ar-EG")}</span>
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
            {/* <h2 className="text-[#15445A] font-semibold text-[20px] sm:text-[22px]">
              إدارة رسائل التواصل
            </h2> */}
          </div>

          <Table<Contact>
            bordered
            dataSource={contacts}
            columns={columns}
            loading={loadingTable}
            pagination={{
              current: page,
              pageSize,
              total,
              onChange: (p) => setPage(p),
              showSizeChanger: false,
            }}
            rowKey={(record) =>
              `${record.name}-${record.phone}-${record.created_at}`
            }
            scroll={{ x: 800, y: 400 }}
            className="custom-table rounded-lg"
          />
        </section>
      )}
    </>
  );
};

export default AdminContactPage;
