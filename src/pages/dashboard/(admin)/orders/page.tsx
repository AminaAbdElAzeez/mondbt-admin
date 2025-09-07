import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "utlis/library/helpers/axios";
import { SearchOutlined } from "@ant-design/icons";
import { AiOutlineContainer } from "react-icons/ai";
import { useQuery, useMutation } from "@tanstack/react-query";

import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import {
  Input,
  Space,
  Table,
  Button,
  Tooltip,
  message,
  Form,
  Select,
  Modal,
} from "antd";
import { useNavigate, Outlet, useParams, useLocation } from "react-router-dom";
import RollerLoading from "components/loading/roller";
import { FormattedMessage, useIntl } from "react-intl";
import { FaCheckSquare, FaPlus } from "react-icons/fa";
import { CgCloseR } from "react-icons/cg";

export interface DataType {
  user_id: number;
  user_name: string;
  total_price: string;
  status: number;
  id: number;

  payment_status: number;
  payment_method: number;
  delivery_method: number;
  created_at: string;
}

function Orders() {
  /////states

  const [query, setQuery] = useState({} as any);
  const [form] = Form.useForm();

  const intl = useIntl();
  const [pagination, setPagination] = useState({
    pageSize: 10,
    totalCount: 0,
    currentPage: 0,
  });

  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);
  const [status, setStatus] = useState<any>(undefined);
  const [deliveryMethod, setDeliveryMethod] = useState<any>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<any>(undefined);
  const [paymentStatus, setPaymentStatus] = useState<any>(undefined);
  const [addFaqOpen, setAddFaqOpen] = useState(false);
  const [search, setSearch] = useState(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState<"complete" | "cancel" | null>(
    null
  );
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [cancelReasons, setCancelReasons] = useState<any[]>([]);
  const [selectedCancelReason, setSelectedCancelReason] = useState<
    number | null
  >(null);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const pathname = location.pathname;
  const statusObj = {
    1: <FormattedMessage id="pending" />,
    2: <FormattedMessage id="accepted" />,
    3: <FormattedMessage id="away" />,
    4: <FormattedMessage id="completed" />,
    5: <FormattedMessage id="canceled" />,
    6: <FormattedMessage id="rejected" />,
    7: <FormattedMessage id="refunded" />,
  };
  const deliveryMethodObj = {
    1: <FormattedMessage id="pharmacy-pickup" />,
    2: <FormattedMessage id="home-delivery" />,
  };
  const paymentMethodObj = {
    1: <FormattedMessage id="credit" />,
    2: <FormattedMessage id="mada" />,
    3: <FormattedMessage id="cash" />,
  };
  const paymentStatusObj = {
    1: <FormattedMessage id="pending" />,
    2: <FormattedMessage id="done" />,
    3: <FormattedMessage id="Cancelled" />,
  };

  const durationObj = {
    day: <FormattedMessage id="day" />,
    days: <FormattedMessage id="days" />,
    hour: <FormattedMessage id="hour" />,
    hours: <FormattedMessage id="hours" />,
    min: <FormattedMessage id="min" />,
    mins: <FormattedMessage id="mins" />,
    secs: <FormattedMessage id="secs" />,
    sec: <FormattedMessage id="sec" />,
  };

  const parseDuration = (duration: string | null | undefined) => {
    if (!duration || typeof duration !== "string") {
      return [];
    }

    const parts = duration.trim().split(/\s+/);
    const result: { value: number; unit: string }[] = [];

    for (let i = 0; i < parts.length; i += 2) {
      const value = Number(parts[i]);
      const unit = parts[i + 1];
      if (!isNaN(value) && unit) {
        result.push({ value, unit });
      }
    }

    return result;
  };

  const renderDuration = (text?: string | null) => {
    const parsed = parseDuration(text);

    if (!parsed.length) {
      return (
        <span className="text-gray-300">
          <FormattedMessage id="noData" />
        </span>
      );
    }

    return (
      <>
        {parsed.map(({ value, unit }, index) => (
          <span key={index}>
            {value} {durationObj[unit] ?? unit}
            {index !== parsed.length - 1 && " "}
          </span>
        ))}
      </>
    );
  };
  // const searchQuery = () => {
  //   let search = "";
  //   if (Object.keys(query).length > 0) {
  //     for (let x in query) {
  //       search = `${search}` + `&${x}=${query[x]}`;
  //     }
  //   }
  //   return search;
  // };

  const fetchOrdersFunc = async () => {
    // dispatch(fetchUsersRequest());

    const params: { [key: string]: string | number } = {};
    if (typeof pagination.currentPage === "number") {
      params.skip = pagination.currentPage * pagination.pageSize;
      params.take = pagination.pageSize;
    }
    // const searchParams = searchQuery();
    // params.query = query;
    let x = "";
    search && (x = x + `&filter[search]=${search}`);
    status && (x = x + `&filter[status]=${status}`);
    // paymentMethod && (x = x + `&filter[payment_method]=${paymentMethod}`);
    if (paymentMethod === 1) {
      x = x + `&filter[payment_method]=3`;
    } else if (paymentMethod === 2) {
      x = x + `&filter[payment_method]=1,2`;
    }

    paymentStatus && (x = x + `&filter[payment_status]=${paymentStatus}`);
    deliveryMethod && (x = x + `&filter[delivery_method]=${deliveryMethod}`);
    const { data } = await axios.get(
      `admin/orders?skip=${params?.skip}&take=${params?.take}${x}`
    );
    // console.log("coupons", data);

    setPagination((current) => ({
      ...current,
      totalCount: data?.count,
    }));
    //  }

    return data?.data;
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      "fetchOrders",
      pagination?.currentPage,
      pagination?.pageSize,
      search,
      status,
      paymentMethod,
      deliveryMethod,
      paymentStatus,
    ],
    queryFn: fetchOrdersFunc,
  });

  const handleOpenModal = (type: "complete" | "cancel", orderId: number) => {
    setActionType(type);
    setSelectedOrderId(orderId);
    setModalVisible(true);
  };

  useEffect(() => {
    if (modalVisible && actionType === "cancel") {
      fetchCancelReasons();
    }
  }, [modalVisible, actionType]);

  const fetchCancelReasons = async () => {
    try {
      const response = await axios.get("admin/cancel-reasons");
      setCancelReasons(response.data.data);
    } catch (error) {
      console.error("Error fetching cancel reasons", error);
    }
  };

  const handleConfirmAction = async () => {
    if (!actionType || !selectedOrderId) return;
    setLoading(true);

    try {
      let responseMessage = "";
      if (actionType === "complete") {
        const response = await axios.post(
          `admin/orders/${selectedOrderId}/complete`
        );
        responseMessage = response.data.message;
        message.success(responseMessage);
        refetch();
      } else if (actionType === "cancel") {
        const selectedReason = cancelReasons.find(
          (reason) => reason.id === selectedCancelReason
        );
        const response = await axios.post("admin/orders/cancel", {
          _method: "patch",
          order_id: selectedOrderId,
          reason_id: selectedReason?.id,
          reason: selectedReason?.title,
        });
        responseMessage = response.data.message;
        message.success(responseMessage);
        refetch();
      }

      setModalVisible(false);
    } catch (err) {
      const errorMessage = err.data.message;
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  //// column search component
  const columnSearch = (placeHolder, state, setState, columnName) => {
    return (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={intl?.formatMessage({ id: placeHolder })}
          value={state}
          onChange={(e) => setState(e.target.value)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
          onClick={() => {
            setPagination((current) => ({
              ...current,
              currentPage: 0,
            }));
            setSearch(state);
          }}
        >
          <FormattedMessage id="search" />
        </Button>
      </div>
    );
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: <FormattedMessage id="order-id" />,
      dataIndex: "id",
      key: "id",
      width: "8%",
      align: "center",
      render: (text) =>
        text || (
          <p className="text-gray-300">{<FormattedMessage id="noData" />}</p>
        ),
    },
    {
      title: <FormattedMessage id="user-name" />,
      dataIndex: "user_name",
      key: "user_name",
      width: "11%",
      render: (text) =>
        text || (
          <p className="text-gray-300">{<FormattedMessage id="noData" />}</p>
        ),
      filterDropdown: columnSearch(
        "user-name",
        userName,
        setUserName,
        "user_name"
      ),
      filterIcon: (
        <SearchOutlined style={{ color: userName ? "#1890ff" : undefined }} />
      ),
    },
    {
      title: <FormattedMessage id="status" />,
      dataIndex: "status",
      key: "status",
      width: "8%",
      align: "center",
      render: (text) =>
        statusObj[text] || (
          <p className="text-gray-300">{<FormattedMessage id="noData" />}</p>
        ),
      // filterDropdown: columnSearch(
      //   "status",
      //   status,
      //   setStatus,
      //   "status"
      // ),
      // filterIcon: (
      //   <SearchOutlined style={{ color: status ? "#1890ff" : undefined }} />
      // ),
    },
    {
      title: <FormattedMessage id="delivery-method" />,
      dataIndex: "delivery_method",
      key: "delivery_method",
      align: "center",
      width: "11%",
      render: (text) =>
        deliveryMethodObj[text] || (
          <p className="text-gray-300">{<FormattedMessage id="noData" />}</p>
        ),
      // filterDropdown: columnSearch(
      //   "delivery-method",
      //   deliveryMethod,
      //   setDeliveryMethod,
      //   "delivery_method"
      // ),
      // filterIcon: (
      //   <SearchOutlined style={{ color: deliveryMethod ? "#1890ff" : undefined }} />
      // ),
    },
    {
      title: <FormattedMessage id="payment-method" />,
      dataIndex: "payment_method",
      key: "payment_method",
      align: "center",
      width: "11%",
      render: (text) =>
        paymentMethodObj[text] || (
          <p className="text-gray-300">{<FormattedMessage id="noData" />}</p>
        ),
      // filterDropdown: columnSearch(
      //   "payment-method",
      //   paymentMethod,
      //   setPaymentMethod,
      //   "payment_method"
      // ),
      // filterIcon: (
      //   <SearchOutlined style={{ color: paymentMethod ? "#1890ff" : undefined }} />
      // ),
    },
    {
      title: <FormattedMessage id="payment-status" />,
      dataIndex: "payment_status",
      key: "payment_status",
      align: "center",
      width: "10%",
      render: (_, row) =>
        row?.status === 6 ? (
          <FormattedMessage id="Cancelled" />
        ) : (
          paymentStatusObj[row?.payment_status] || (
            <p className="text-gray-300">
              <FormattedMessage id="noData" />
            </p>
          )
        ),
      // render: (text) =>
      //   paymentStatusObj[text] || (
      //     <p className="text-gray-300">{<FormattedMessage id="noData" />}</p>
      //   ),
      // filterDropdown: columnSearch(
      //   "payment-status",
      //   paymentStatus,
      //   setPaymentStatus,
      //   "payment_status"
      // ),
      // filterIcon: (
      //   <SearchOutlined style={{ color: paymentStatus ? "#1890ff" : undefined }} />
      // ),
    },
    {
      title: <FormattedMessage id="total-price" />,
      dataIndex: "total_price",
      key: "total_price",
      align: "center",
      width: "8%",
      render: (text) =>
        (+text === 0 || text) && text !== null ? (
          text
        ) : (
          <p className="text-gray-300">{<FormattedMessage id="noData" />}</p>
        ),
    },
    {
      title: <FormattedMessage id="created-at" />,
      dataIndex: "created_at",
      key: "created_at",
      width: "11%",
      align: "center",
      render: (text) =>
        text ? (
          text
        ) : (
          <p className="text-gray-300">{<FormattedMessage id="noData" />}</p>
        ),
    },
    {
      title: <FormattedMessage id="is_remote_shipping" />,
      dataIndex: "is_remote_shipping",
      key: "is_remote_shipping",
      width: "9%",
      align: "center",
      render: (value: number) =>
        value === 0 ? (
          <span>
            <FormattedMessage id="OutletPlus" />
          </span>
        ) : value === 1 ? (
          <span>
            <FormattedMessage id="SAMSA" />
          </span>
        ) : (
          <p className="text-gray-300">
            <FormattedMessage id="noData" />
          </p>
        ),
    },
    {
      title: <FormattedMessage id="duration" />,
      dataIndex: "duration",
      key: "duration",
      width: "7%",
      align: "center",
      render: (text: string) => renderDuration(text),
    },
    {
      title: (
        <div className="text-center">
          <FormattedMessage id="actions" />
        </div>
      ),
      width: "6%",
      key: "actions",
      align: "center",
      fixed: "right",
      render: (_, row) => (
        <div className="flex justify-center items-center gap-2">
          <Tooltip title={<FormattedMessage id="view" />} color="#1283ad">
            <AiOutlineContainer
              className="text-[#1283ad] cursor-pointer text-xl"
              onClick={() => {
                navigate("order-details", { state: { orderId: row?.id } });
              }}
            />
          </Tooltip>

          {row.delivery_method === 1 &&
            row.status !== 3 &&
            row.status !== 4 &&
            row.status !== 5 &&
            row.status !== 6 &&
            row.status !== 7 && (
              <div className="flex justify-center items-center gap-2">
                <Tooltip
                  title={<FormattedMessage id="completeOrder" />}
                  color="#03b89e"
                >
                  <FaCheckSquare
                    className="text-[#03b89e] cursor-pointer text-xl"
                    onClick={() => handleOpenModal("complete", row.id)}
                  />
                </Tooltip>

                <Tooltip
                  title={<FormattedMessage id="cancelOrder" />}
                  color="rgb(185 28 28)"
                >
                  <CgCloseR
                    className="text-red-700 cursor-pointer text-xl"
                    onClick={() => handleOpenModal("cancel", row.id)}
                  />
                </Tooltip>
              </div>
            )}
        </div>
      ),
    },
  ];

  //if (error) return <div>Error: {error}</div>;
  return (
    <>
      {pathname.split("/")[pathname.split("/").length - 1] === "permission" ? (
        <div className="container mx-auto ">
          {isLoading ? (
            <RollerLoading />
          ) : (
            <>
              <div className="py-4 flex justify-center sm:justify-end items-center flex-wrap">
                <Select
                  className="w-[150px] mx-1 my-2 dark:[&_.ant-select-arrow]:!text-[#e7e5e5]"
                  //defaultValue={(statusArr.filter((item)=>item.value===prescriptionStatus)[0].label)||''}
                  showSearch
                  value={status}
                  placeholder={
                    <span className=" dark:text-[#e7e5e5] dark:!border-[#fff]">
                      <FormattedMessage id="status" />
                    </span>
                  }
                  optionFilterProp="label"
                  onChange={(value) => setStatus(value)}
                  // onSearch={onSearch}
                  options={[
                    {
                      value: 1,
                      label: intl.formatMessage({ id: "pending" }),
                    },
                    {
                      value: 2,
                      label: intl.formatMessage({ id: "accepted" }),
                    },
                    {
                      value: 3,
                      label: intl.formatMessage({ id: "away" }),
                    },
                    {
                      value: 4,
                      label: intl.formatMessage({ id: "completed" }),
                    },
                    {
                      value: 5,
                      label: intl.formatMessage({ id: "canceled" }),
                    },
                    {
                      value: 6,
                      label: intl.formatMessage({ id: "rejected" }),
                    },
                  ]}
                />
                <Select
                  className="w-[150px] mx-1 my-2 dark:[&_.ant-select-arrow]:!text-[#e7e5e5]"
                  //defaultValue={(statusArr.filter((item)=>item.value===prescriptionStatus)[0].label)||''}
                  showSearch
                  value={deliveryMethod}
                  placeholder={
                    <span className=" dark:text-[#e7e5e5] dark:!border-[#fff]">
                      <FormattedMessage id="delivery-method" />
                    </span>
                  }
                  optionFilterProp="label"
                  onChange={(value) => setDeliveryMethod(value)}
                  // onSearch={onSearch}
                  options={[
                    {
                      value: 1,
                      label: intl.formatMessage({ id: "pharmacy-pickup" }),
                    },
                    {
                      value: 2,
                      label: intl.formatMessage({ id: "home-delivery" }),
                    },
                  ]}
                />
                <Select
                  className="w-[150px] mx-1 my-2 dark:[&_.ant-select-arrow]:!text-[#e7e5e5]"
                  //defaultValue={(statusArr.filter((item)=>item.value===prescriptionStatus)[0].label)||''}
                  showSearch
                  value={paymentMethod}
                  placeholder={
                    <span className=" dark:text-[#e7e5e5] dark:!border-[#fff]">
                      <FormattedMessage id="payment-method" />
                    </span>
                  }
                  optionFilterProp="label"
                  onChange={(value) => setPaymentMethod(value)}
                  // onSearch={onSearch}
                  options={[
                    {
                      value: 1,
                      label: intl.formatMessage({ id: "cash" }),
                    },
                    {
                      value: 2,
                      label: intl.formatMessage({ id: "online" }),
                    },
                  ]}
                />
                <Select
                  className="w-[150px] mx-1 my-2 dark:[&_.ant-select-arrow]:!text-[#e7e5e5]"
                  //defaultValue={(statusArr.filter((item)=>item.value===prescriptionStatus)[0].label)||''}
                  showSearch
                  value={paymentStatus}
                  placeholder={
                    <span className=" dark:text-[#e7e5e5] dark:!border-[#fff]">
                      <FormattedMessage id="payment-status" />
                    </span>
                  }
                  optionFilterProp="label"
                  onChange={(value) => setPaymentStatus(value)}
                  // onSearch={onSearch}
                  options={[
                    {
                      value: 1,
                      label: intl.formatMessage({ id: "pending" }),
                    },
                    {
                      value: 2,
                      label: intl.formatMessage({ id: "done" }),
                    },
                    {
                      value: 3,
                      label: intl.formatMessage({ id: "Cancelled" }),
                    },
                  ]}
                />
              </div>
              <Table<DataType>
                title={() => (
                  <Tooltip
                    title={<FormattedMessage id="add" />}
                    color="#03b89e"
                  >
                    <Button
                      type="primary"
                      className="shadow-none"
                      icon={<FaPlus />}
                      shape="circle"
                      // loading={loading}
                      onClick={() => {
                        navigate("add-order");
                        //form.resetFields();
                      }}
                    />
                  </Tooltip>
                )}
                columns={columns}
                dataSource={data}
                scroll={{ x: 1800, y: 310 }}
                pagination={{
                  total: pagination.totalCount,
                  current: pagination.currentPage + 1,
                  pageSize: pagination.pageSize,
                  onChange(page, pageSize) {
                    setPagination((current) => ({
                      ...current,
                      pageSize,
                      currentPage: page - 1,
                    }));
                  },
                }}
              />
            </>
          )}
        </div>
      ) : (
        <Outlet />
      )}

      <Modal
        open={modalVisible}
        confirmLoading={loading}
        onCancel={() => setModalVisible(false)}
        onOk={handleConfirmAction}
        title={
          actionType === "complete" ? (
            <FormattedMessage id="completeOrder" />
          ) : (
            <FormattedMessage id="cancelOrder" />
          )
        }
        okText={<FormattedMessage id="Confirm" />}
        cancelText={<FormattedMessage id="Cancel" />}
      >
        {actionType === "cancel" && (
          <>
            <p>
              <FormattedMessage id="cancelMsg" />
            </p>
            <Select
              value={selectedCancelReason}
              onChange={setSelectedCancelReason}
              placeholder={<FormattedMessage id="selectCancelReason" />}
              style={{ width: "100%", margin: "10px 0" }}
            >
              {cancelReasons.map((reason) => (
                <Select.Option key={reason.id} value={reason.id}>
                  {reason.title}
                </Select.Option>
              ))}
            </Select>
          </>
        )}
        {actionType === "complete" && (
          <p>
            <FormattedMessage id="completeMsg" />
          </p>
        )}
      </Modal>
    </>
  );
}

export default Orders;
