import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import axios from "utlis/library/helpers/axios";
import {
  Input,
  Space,
  Table,
  Button,
  message,
  Form,
  Modal,
  Tooltip,
  App,
  Image,
} from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useIntl, FormattedMessage } from "react-intl";
import faqsActions from "../../../../store/faq/actions";
import RollerLoading from "components/loading/roller";
import { FaPlus } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin7Line } from "react-icons/ri";
import ViewModal, {
  AddUserModal,
  EditUserModal,
  DeleteUserModal,
} from "./modal";
import { IoEyeOutline, IoEyeSharp } from "react-icons/io5";
import { Outlet, useNavigate } from "react-router-dom";
import { AiOutlineContainer } from "react-icons/ai";

// import FaqModal from "./modal";

export interface DataType {
  id: number;
  name: string;
  email: string;
  phone: string;
  profile_image: string;
  is_verified: number;
}

type DataIndex = keyof DataType;

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [query, setQuery] = useState({} as any);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    totalCount: 0,
    currentPage: 0,
  });

  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [UserId, setUserId] = useState(undefined);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isVerified, setIsVerified] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserEdit, setSelectedUserEdit] = useState(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<number>(1);
  const [search, setSearch] = useState(undefined);

  const intl = useIntl();
  const pathname = location.pathname;

  const searchQuery = () => {
    let searchVal = "";
    // if (Object.keys(query).length > 0) {
    //   for (let x in query) {
    //     search = `${search}` + `&${x}=${query[x]}`;
    //   }
    // }
    if (search) {
      searchVal = `filter[search]=${search}`;
    }
    return searchVal;
  };
  ///table data
  const columnSearch = (placeholder, state, setState, columnName) => {
    return (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={placeholder}
          value={state}
          onChange={(e) => setState(e.target.value)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Button
          icon={<SearchOutlined className="mr-[-2px]" />}
          className="bg-[#03b89e] text-[#fff] w-full"
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
      title: <FormattedMessage id="name" />,
      dataIndex: "name",
      key: "name",
      width: "18%",
      filterDropdown: columnSearch(
        // "name",
        intl.formatMessage({ id: "name" }),
        name,
        setName,
        "name"
      ),
      filterIcon: (
        <SearchOutlined style={{ color: name ? "#03b89e" : undefined }} />
      ),
      render: (text) =>
        text || (
          <p className="text-gray-300">{<FormattedMessage id="noData" />}</p>
        ),
    },
    {
      title: <FormattedMessage id="email" />,
      dataIndex: "email",
      key: "email",
      width: "20%",
      filterDropdown: columnSearch(
        // "email",
        intl.formatMessage({ id: "email" }),
        email,
        setEmail,
        "email"
      ),
      filterIcon: (
        <SearchOutlined style={{ color: email ? "#03b89e" : undefined }} />
      ),
      render: (text) =>
        text || (
          <p className="text-gray-300">{<FormattedMessage id="noData" />}</p>
        ),
    },
    {
      title: <FormattedMessage id="phone" />,
      dataIndex: "phone",
      key: "phone",
      width: "16%",
      filterDropdown: columnSearch(
        // "phone",
        intl.formatMessage({ id: "phone" }),
        phone,
        setPhone,
        "phone"
      ),
      filterIcon: (
        <SearchOutlined style={{ color: phone ? "#03b89e" : undefined }} />
      ),
      render: (text) =>
        text || (
          <p className="text-gray-300">{<FormattedMessage id="noData" />}</p>
        ),
    },
    {
      title: <FormattedMessage id="profileImage" />,
      dataIndex: "profile_image",
      key: "profile_image",
      width: "16%",
      align: "center",
      render: (text) =>
        text ? (
          <Image
            src={text}
            className="!h-16 !w-[85px]"
            preview={{
              toolbarRender: () => null,
              mask: (
                <span className="flex items-center p-2 text-[14px]">
                  <IoEyeOutline className="text-[16px] mx-1" />
                  <FormattedMessage id="perview" />
                </span>
              ),
            }}
          />
        ) : (
          <p className="text-gray-300">{<FormattedMessage id="no-img" />}</p>
        ),
      // filterDropdown: columnSearch(
      //   "profile_image",
      //   profileImage,
      //   setProfileImage,
      //   "profileImage"
      // ),
      // filterIcon: (
      //   <SearchOutlined
      //     style={{ color: profileImage ? "#03b89e" : undefined }}
      //   />
      // ),
    },
    {
      title: <FormattedMessage id="is-verified" />,
      dataIndex: "is_verified",
      key: "is_verified",
      width: "11%",
      align: "center",
      // filterDropdown: columnSearch(
      //   // "is-verified",
      //   intl.formatMessage({ id: "is-verified" }),
      //   isVerified,
      //   setIsVerified,
      //   "is-verified"
      // ),
      // filterIcon: (
      //   <SearchOutlined style={{ color: isVerified ? "#03b89e" : undefined }} />
      // ),
      render: (isVerified) => {
        if (isVerified === 1) {
          return <FormattedMessage id="yes" />;
        } else if (isVerified === 0) {
          return <FormattedMessage id="no" />;
        } else {
          return (
            <p className="text-gray-300">
              <FormattedMessage id="noData" />
            </p>
          );
        }
      },
    },
    {
      title: <FormattedMessage id="status" />,
      dataIndex: "status",
      key: "status",
      width: "11%",
      align: "center",
      render: (status, record) => (
        <Tooltip title={<FormattedMessage id="changeStatusTooltip" />}>
          <Button
            type={status === 1 ? "primary" : "default"}
            danger={status === 0}
            onClick={() => handleStatusChange(record.id, status)}
          >
            <FormattedMessage id={status === 1 ? "active" : "inactive"} />
          </Button>
        </Tooltip>
      ),
    },
    {
      title: (
        <div className="text-center">
          <FormattedMessage id="actions" />
        </div>
      ),
      key: "actions",
      width: "8%",
      fixed: "right",
      render: (_, record: DataType) => (
        <div className="flex justify-center items-center">
          <Tooltip title={<FormattedMessage id="edit" />} color="#03b89e">
            <span>
              <FiEdit
                className="text-primary cursor-pointer mx-1 text-xl"
                onClick={() => {
                  setUserId(record.id);
                  setSelectedUserEdit(record);
                  form.setFieldsValue({
                    name: record?.name,
                    email: record?.email,
                    phone: record?.phone,
                    profile_image: record?.profile_image,
                    is_verified: record?.is_verified,
                  });
                  setEditUserOpen(true);
                }}
              />
            </span>
          </Tooltip>
          <Tooltip title={<FormattedMessage id="details" />} color="#1283ad">
            <span>
              <AiOutlineContainer
                className="text-[#1283ad] cursor-pointer mx-[5px] text-xl"
                onClick={() => {
                  // console.log(record?.id);
                  navigate("client-details", { state: { userId: record?.id } });
                }}
              />
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  //// get all faqs
  const fetchData = async () => {
    const params: { [key: string]: string | number } = {};
    if (typeof pagination.currentPage === "number") {
      params.skip = pagination.currentPage * pagination.pageSize;
      params.take = pagination.pageSize;
    }
    const searchParams = searchQuery();
    // params.query = query;

    const { data } = await axios.get(
      `admin/users?skip=${params?.skip}&take=${params?.take}&${searchParams}`
    );
    // console.log(data)
    setPagination((current) => ({
      ...current,
      totalCount: data?.count,
    }));

    return data?.data;
  };
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      "fetchData",
      pagination?.currentPage,
      pagination?.pageSize,
      query,
      search,
    ],
    queryFn: fetchData,
    // refetchInterval: 5000,
  });
  //// add user logic
  const addUsersMutation = useMutation({
    mutationFn: (values: any) => axios["post"](`admin/users`, values),
    onSuccess: (res) => {
      setAddUserOpen(false);
      refetch();
      message.success(res?.data?.message, 3);
      form.resetFields();
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const addUserFunc = (values: any) => {
    addUsersMutation.mutate(values);
  };

  //// edit Faq logic
  const editUsersMutation = useMutation({
    mutationFn: (values: any) => axios["put"](`admin/users/${UserId}`, values),
    onSuccess: (res) => {
      setEditUserOpen(false);
      refetch();
      message.success(res?.data?.message, 3);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const editUserFunc = (values: any) => {
    //console.log('editedValues',values)
    editUsersMutation.mutate(values);
  };

  /// delete faq logic

  const deleteUsersMutation = useMutation({
    mutationFn: () => axios["delete"](`admin/faqs/${UserId}`),
    onSuccess: (res) => {
      // const { data } = res?.data?.data;

      setDeleteUserOpen(false);
      message.success(res?.data?.message);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const deleteUsersFunc = () => {
    deleteUsersMutation.mutate();
  };

  // view
  // const fetchUserDetails = async (userId: number) => {
  //   try {
  //     const response = await axios.get(`admin/users/${userId}`);
  //     setSelectedUser(response.data.data);
  //     setModalVisible(true);
  //   } catch (error: any) {
  //     message.error(intl.formatMessage({ id: "userErrorDetails" }));
  //   }
  // };

  // change status
  const changeStatusMutation = useMutation({
    mutationFn: () =>
      axios.post(`admin/users/${selectedUserId}/change-status`, {
        _method: "patch",
        status: newStatus,
      }),
    onSuccess: (res) => {
      message.success(res.data.message);
      setStatusModalVisible(false);
      refetch();
    },
    onError: (err) => {
      message.error("Failed to change status!");
    },
  });

  const handleStatusChange = (userId: number, currentStatus: number) => {
    setSelectedUserId(userId);
    setNewStatus(currentStatus === 1 ? 0 : 1);
    setStatusModalVisible(true);
  };

  return (
    <App>
      {pathname.split("/")[pathname.split("/").length - 1] === "attendance" ? (
        <div className="container mx-auto">
          {isLoading ? (
            <RollerLoading />
          ) : (
            <Table<DataType>
              title={() => (
                <Tooltip title={<FormattedMessage id="add" />} color="#03b89e">
                  <Button
                    type="primary"
                    className="shadow-none"
                    icon={<FaPlus />}
                    shape="circle"
                    // loading={loading}
                    onClick={() => {
                      form.resetFields();
                      setAddUserOpen(true);
                    }}
                  />
                </Tooltip>
              )}
              columns={columns}
              // dataSource={data}
              dataSource={data?.map((item) => ({ ...item, key: item.id }))}
              scroll={{ x: 1200, y: 380 }}
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

      <AddUserModal
        open={addUserOpen}
        cancel={() => {
          setAddUserOpen(false);
          form.resetFields();
        }}
        ok={addUserFunc}
        form={form}
        loading={addUsersMutation.isPending}
      />
      <EditUserModal
        open={editUserOpen}
        cancel={() => setEditUserOpen(false)}
        form={form}
        ok={editUserFunc}
        loading={editUsersMutation.isPending}
      />
      <DeleteUserModal
        open={deleteUserOpen}
        cancel={() => setDeleteUserOpen(false)}
        ok={deleteUsersFunc}
        loading={deleteUsersMutation.isPending}
      />
      {/* <ViewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        user={selectedUser}
      /> */}
      <Modal
        title={<FormattedMessage id="changeUserStatus" />}
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        onOk={() => changeStatusMutation.mutate()}
        confirmLoading={changeStatusMutation.isPending}
      >
        <p>
          <FormattedMessage
            id="confirmChangeStatus"
            values={{
              status:
                newStatus === 1 ? (
                  <b>
                    <FormattedMessage id="active" />
                  </b>
                ) : (
                  <b>
                    <FormattedMessage id="inactive" />
                  </b>
                ),
            }}
          />
        </p>
      </Modal>
    </App>
  );
};

export default Users;
