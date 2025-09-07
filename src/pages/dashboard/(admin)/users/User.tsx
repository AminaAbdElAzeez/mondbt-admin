import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Descriptions,
  Card,
  Image,
  Button,
  Form,
  Tooltip,
  message,
  Modal,
} from "antd";
import RollerLoading from "components/loading/roller";
import { FormattedMessage, useIntl } from "react-intl";
import axios from "utlis/library/helpers/axios";
import { FiEdit } from "react-icons/fi";
import { useState } from "react";
import { AddUserModal, EditUserModal } from "./modal";
import { FaPlus } from "react-icons/fa";

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: number;
  is_verified: number;
  profile_image?: string;
}

const UserDetails = () => {
  const [UserId, setUserId] = useState(undefined);
  const [selectedUserEdit, setSelectedUserEdit] = useState(null);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<number>(1);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const navigate = useNavigate();

  const location = useLocation();
  const userId = location.state?.userId;
  const intl = useIntl();
  // const lang = intl.locale;
  const [form] = Form.useForm();

  const fetchUserDetails = async () => {
    const { data } = await axios.get(`admin/users/${userId}`, {
      headers: {
        "Accept-Language": intl.locale === "ar" ? "ar" : "en",
      },
    });
    return data.data;
  };

  const { data, isLoading, error, refetch } = useQuery<UserData>({
    queryKey: ["userDetails", userId],
    queryFn: fetchUserDetails,
  });

  const editUsersMutation = useMutation({
    mutationFn: (values: any) => axios["put"](`admin/users/${userId}`, values),
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

  const addUsersMutation = useMutation({
    mutationFn: (values: any) => axios["post"](`admin/users`, values),
    onSuccess: (res) => {
      setAddUserOpen(false);
      refetch();
      message.success(res?.data?.message, 3);
      form.resetFields();
      navigate(-1);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const addUserFunc = (values: any) => {
    addUsersMutation.mutate(values);
  };

  // change status
  const changeStatusMutation = useMutation({
    mutationFn: () =>
      axios.post(`admin/users/${userId}/change-status`, {
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

  if (isLoading) return <RollerLoading />;

  return (
    <div className="container mx-auto my-10">
      <Descriptions
        bordered
        column={1}
        size="middle"
        title={
          <div className="flex justify-between items-center">
            <h2 className="text-[22px] sm:text-[23px] text-primary hover:text-[#1383ad] transition-colors duration-[0.5s]">
              <FormattedMessage id="client-details" />
            </h2>
            <div className="flex items-center gap-3">
              <Tooltip title={<FormattedMessage id="edit" />} color="#03b89e">
                <span>
                  <FiEdit
                    className="text-primary cursor-pointer text-xl"
                    onClick={() => {
                      setUserId(userId);
                      setSelectedUserEdit(userId);
                      form.setFieldsValue({
                        name: data?.name,
                        email: data?.email,
                        phone: data?.phone,
                        profile_image: data?.profile_image,
                        is_verified: data?.is_verified,
                      });
                      setEditUserOpen(true);
                    }}
                  />
                </span>
              </Tooltip>
              <Tooltip title={<FormattedMessage id="add" />} color="#03b89e">
                <Button
                  type="primary"
                  className=" shadow-none bg-[#03b89e] hover:!bg-[#03b89e]"
                  icon={<FaPlus />}
                  shape="circle"
                  // loading={loading}
                  onClick={() => {
                    form.resetFields();
                    setAddUserOpen(true);
                  }}
                />
              </Tooltip>
            </div>
          </div>
        }
      >
        <Descriptions.Item label={<FormattedMessage id="name" />}>
          {data?.name || <FormattedMessage id="noData" />}
        </Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="email" />}>
          {data?.email || <FormattedMessage id="noData" />}
        </Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="phone" />}>
          {data?.phone || <FormattedMessage id="noData" />}
        </Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="status" />}>
          <Tooltip title={<FormattedMessage id="changeStatusTooltip" />}>
            <Button
              type={data?.status === 1 ? "primary" : "default"}
              danger={data?.status === 0}
              onClick={() => handleStatusChange(userId, data?.status ?? 0)}
            >
              <FormattedMessage
                id={data?.status === 1 ? "active" : "inactive"}
              />
            </Button>
          </Tooltip>
        </Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="is-verified" />}>
          {data?.is_verified === 1 ? (
            <FormattedMessage id="yes" />
          ) : (
            <FormattedMessage id="no" />
          )}
        </Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="profileImage" />}>
          {data?.profile_image?.trim() ? (
            <Image
              src={data.profile_image}
              alt="Profile"
              width={100}
              height={100}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />
          ) : (
            <FormattedMessage id="noData" />
          )}
        </Descriptions.Item>
      </Descriptions>

      <EditUserModal
        open={editUserOpen}
        cancel={() => setEditUserOpen(false)}
        form={form}
        ok={editUserFunc}
        loading={editUsersMutation.isPending}
      />
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
    </div>
  );
};

export default UserDetails;
