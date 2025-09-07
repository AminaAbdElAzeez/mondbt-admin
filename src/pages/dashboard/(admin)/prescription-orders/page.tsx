import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "utlis/library/helpers/axios";

import { SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AiOutlineContainer } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { useForm } from "antd/lib/form/Form";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import {
  Input,
  Space,
  Table,
  Button,
  Tooltip,
  message,
  Form,
  Modal,
  Image,
  Select,
} from "antd";
import { useNavigate, Outlet, useParams, useLocation } from "react-router-dom";
import RollerLoading from "components/loading/roller";
import { FormattedMessage, useIntl } from "react-intl";
import { FaLeaf, FaPrescriptionBottle } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";

type prescription = {
  id: number;
  url: string;
};

export interface DataType {
  user_id: number;
  user_name: string;
  total_price: string;
  status: number;
  id: number;
  prescriptions: prescription[];
}

function PrescriptionOrders() {
  /////states

  const [query, setQuery] = useState({} as any);

  const intel = useIntl();
  const [pagination, setPagination] = useState({
    pageSize: 10,
    totalCount: 0,
    currentPage: 0,
  });
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [editPrescriptionOpen, setEditPrescriptionOpen] = useState(false);
  const [prescriptionStatus, setPrescriptionStatus] = useState(undefined);
  const [newPrescriptionStatus, setNewPrescriptionStatus] = useState(undefined);
  const [prescriptionId, setPrescriptionId] = useState(undefined);
  const [prescriptions, setPrescriptions] = useState([]);
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);
  const [status, setStatus] = useState(undefined);
  const [search, setSearch] = useState(undefined);
  const navigate = useNavigate();
  const [form] = useForm();
  const pathname = location.pathname;
  const statusArr = [
    { value: 1, label: intel.formatMessage({ id: "pending" }) },
    { value: 2, label: intel.formatMessage({ id: "accepted" }) },
    { value: 3, label: intel.formatMessage({ id: "away" }) },
    { value: 4, label: intel.formatMessage({ id: "completed" }) },
    { value: 5, label: intel.formatMessage({ id: "canceled" }) },
    { value: 6, label: intel.formatMessage({ id: "rejected" }) },
  ];

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
    //const searchParams = searchQuery();
    // params.query = query;
    let x = "";
    search && (x = x + `&filter[search]=${search}`);
    const { data } = await axios.get(
      `admin/prescription-orders?skip=${params?.skip}&take=${params?.take}${x}`
    );
    // console.log("coupons", data);

    setPagination((current) => ({
      ...current,
      totalCount: data?.count,
    }));
    //  }
    console.log(data?.data);
    return data?.data;
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      "fetchPrescriptionOrders",
      pagination?.currentPage,
      pagination?.pageSize,
      search,
    ],
    queryFn: fetchOrdersFunc,
  });

  ///edit prescription status mutation
  const editStatusMutation = useMutation({
    mutationFn: (values) =>
      axios["post"](
        `admin/prescription-orders/${prescriptionId}/change-status`,
        values
      ),
    onSuccess: (res) => {
      // const { data } = res?.data?.data;
      const { message } = res?.data;
      //  console.log(res?.data?.data);
      setEditPrescriptionOpen(false);

      refetch();
      toast.success(message, {
        position: "top-center",
        duration: 3000,
      });
    },
    onError: (err) => {
      const {
        status,
        data: { message },
      } = (err as any).response;
      console.log(err, err.message);
      // setIsAddContainerModalOpen(false);
      toast.error(err.message, {
        position: "top-center",
        duration: 3000,
      });
    },
  });

  const editStatusFinish = (values: any) => {
    editStatusMutation.mutate(values);
  };

  //// column search component
  const columnSearch = (placeHolder, state, setState, columnName) => {
    return (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={intel?.formatMessage({ id: placeHolder })}
          value={state}
          onChange={(e) => setState(e.target.value)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          size="small"
          // style={{ width: 90 }}
          className="w-full"
          onClick={() => {
            setPagination((current) => ({
              ...current,
              currentPage: 0,
            }));
            // if (state) {
            //   setQuery({ ...query, [columnName]: state });
            // } else {
            //   const obj = { ...query };

            //   delete obj[columnName];

            //   setQuery(obj);
            // }
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
      width: "11%",
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
      width: "17%",
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
      width: "10%",
      align: "center",
      render: (text) =>
        statusArr.filter((item) => item.value === text)[0].label || (
          <p className="text-gray-300">{<FormattedMessage id="noData" />}</p>
        ),
      // filterDropdown: columnSearch("status", status, setStatus, "status"),
      // filterIcon: (
      //   <SearchOutlined style={{ color: status ? "#1890ff" : undefined }} />
      // ),
    },
    {
      title: <FormattedMessage id="total-price" />,
      dataIndex: "total_price",
      key: "total_price",
      width: "11%",
      align: "center",
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
      width: "16%",
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
      width: "13%",
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
      width: "12%",
      align: "center",
      render: (text: string) => renderDuration(text),
    },
    {
      title: (
        <div className="text-center">
          <FormattedMessage id="actions" />
        </div>
      ),
      width: "10%",
      align: "center",
      key: "actions",
      fixed: "right",
      render: (_, row) => (
        <div className="flex justify-center items-center">
          <Tooltip title={<FormattedMessage id="details" />} color="#1283ad">
            <AiOutlineContainer
              className="text-[#1283ad] cursor-pointer mx-[5px] text-xl"
              onClick={() => {
                navigate("order-details", { state: { orderId: row?.id } });
              }}
            />
          </Tooltip>

          <Tooltip
            title={<FormattedMessage id="prescriptions" />}
            color="#ecb53d"
          >
            <FaPrescriptionBottle
              className="text-[#ecb53d] cursor-pointer mx-[5px] text-xl"
              onClick={() => {
                //console.log(row?.prescriptions)
                setPrescriptions(row?.prescriptions);
                setPrescriptionModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title={<FormattedMessage id="edit" />} color="#03b89e">
            <FiEdit
              className="text-primary cursor-pointer mx-[5px] text-xl"
              onClick={() => {
                setPrescriptionStatus(row?.status);
                setPrescriptionId(row?.id);
                setEditPrescriptionOpen(true);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  //if (error) return <div>Error: {error}</div>;
  return (
    <>
      {pathname.split("/")[pathname.split("/").length - 1] ===
      "prescriptions" ? (
        <div className="container mx-auto">
          {isLoading ? (
            <RollerLoading />
          ) : (
            <Table<DataType>
              columns={columns}
              dataSource={data}
              scroll={{ x: 1250, y: 445 }}
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
          )}
        </div>
      ) : (
        <Outlet />
      )}

      {/****view prescriptions modal****/}
      <Modal
        title={
          <p className="text-[18px]">
            <FormattedMessage id="order-prescriptions" />
          </p>
        }
        open={prescriptionModalOpen}
        onOk={() => setPrescriptionModalOpen(false)}
        onCancel={() => setPrescriptionModalOpen(false)}
        footer={
          <div className="flex justify-end items-center">
            <button
              className="cursor-pointer min-w-[60px] py-2 px-3 bg-primary text-white mx-2 rounded-md border-none"
              onClick={() => setPrescriptionModalOpen(false)}
            >
              <FormattedMessage id="ok" />
            </button>
          </div>
        }
      >
        <div className="p-4 flex flex-wrap justify-center items-center max-w-[90%] sm:max-w-[500px]">
          {prescriptions?.map((item, index) => (
            <div className="m-2 w-[120px]">
              <Image
                key={item?.id}
                src={item?.url}
                alt="prescription"
                className="!w-[120px] !h-[100px] object-cover rounded-[5px]"
                width={120}
                height={100}
                style={{ objectFit: "cover", borderRadius: 4 }}
                preview={{
                  mask: (
                    <span className="flex items-center p-2 text-[14px]">
                      <IoEyeOutline className="text-[16px] mx-1" />
                      <FormattedMessage id="perview" />
                    </span>
                  ),
                }}
              />
            </div>
          ))}
        </div>
      </Modal>
      {/****edit prescription status modal****/}
      <Modal
        title={
          <p className="text-[18px]">
            <FormattedMessage id="edit-prescription-status" />
          </p>
        }
        open={editPrescriptionOpen}
        onOk={() => setEditPrescriptionOpen(false)}
        onCancel={() => setEditPrescriptionOpen(false)}
        footer={null}
      >
        <div className="p-4 max-w-[90%] sm:max-w-[500px]">
          <Form
            layout="vertical"
            form={form}
            onFieldsChange={(changedFields, allFields) => {}}
            onFinish={editStatusFinish}

            // autoComplete="off"
          >
            <div
              className="my-8 px-2 py-1 
           
            "
            >
              <Form.Item
                label={<FormattedMessage id="status" />}
                name="status"
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="status-required" />,
                  },
                ]}
              >
                <Select
                  //defaultValue={(statusArr.filter((item)=>item.value===prescriptionStatus)[0].label)||''}
                  showSearch
                  placeholder={<FormattedMessage id="select-status" />}
                  optionFilterProp="label"
                  // onChange={onChange}
                  // onSearch={onSearch}
                  options={[
                    {
                      value: 2,
                      label: intel.formatMessage({ id: "accepted" }),
                    },
                    {
                      value: 6,
                      label: intel.formatMessage({ id: "rejected" }),
                    },
                  ]}
                />
              </Form.Item>
            </div>
            <Form.Item className="modals-btns update-user-modal-btns flex justify-end items-center sticky bottom-0 bg-white z-[1000] pt-4">
              <Button
                // type="primary"

                size="large"
                className="modals-cancel-btn min-w-[60px] me-1 text-black inline-block hover:text-black hover:border-black"
                onClick={() => {
                  setEditPrescriptionOpen(false);
                }}
              >
                <FormattedMessage id="cancel" />
              </Button>
              <Button
                // type="primary"

                size="large"
                className="modals-confirm-btn min-w-[60px] text-white ms-1 bg-primary hover:bg-primary inline-block"
                htmlType="submit"
                loading={editStatusMutation?.isPending}
              >
                <FormattedMessage id="edit" />
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default PrescriptionOrders;
