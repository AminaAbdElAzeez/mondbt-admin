import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Descriptions,
  Table,
  Button,
  Tooltip,
  Space,
  Image,
  Spin,
  Modal,
  Form,
  Select,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import RollerLoading from "components/loading/roller";
import { FormattedMessage, useIntl } from "react-intl";
import { IoEyeOutline } from "react-icons/io5";
import axios from "utlis/library/helpers/axios";
import { FaPlus, FaPrescriptionBottle } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import toast from "react-hot-toast";
import { useForm } from "antd/es/form/Form";

type prescription = {
  id: number;
  url: string;
};

type orderDetails = {
  product_id: number;
  product_name: string;
  quantity: number;
  price: string;
  image?: string;
  offer?: string[];
};

export interface DataType {
  user_id: number;
  user_name: string;
  total_price: string;
  status: number;
  id: number;
  order_details: orderDetails[];
  prescriptions: prescription[];
  created_at: string;
  cancel_reason: string | null;
  cancel_other_text: string | null;
  cash_delivery_fee: number | string;
  coupon_price: number | string;
  delivery_fee: string;
  coupon_code: string;
  duration: string;
  is_remote_shipping: number;
}

function PrescriptionOrderDetails() {
  const [prescriptionStatus, setPrescriptionStatus] = useState(undefined);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [prescriptionId, setPrescriptionId] = useState(undefined);
  const [editPrescriptionOpen, setEditPrescriptionOpen] = useState(false);

  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  const [form] = useForm();

  const statusObj = {
    1: <FormattedMessage id="pending" />,
    2: <FormattedMessage id="accepted" />,
    3: <FormattedMessage id="away" />,
    4: <FormattedMessage id="completed" />,
    5: <FormattedMessage id="canceled" />,
    6: <FormattedMessage id="rejected" />,
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

  const fetchOrderDetailsFunc = async () => {
    const { data } = await axios.get(`admin/prescription-orders/${orderId}`, {
      headers: {
        "Accept-Language": intl.locale === "ar" ? "ar" : "en",
      },
    });
    return data?.data;
  };

  const { data, isLoading, error, refetch } = useQuery<DataType>({
    queryKey: ["fetchOrderDetails", orderId],
    queryFn: fetchOrderDetailsFunc,
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

  if (isLoading) return <RollerLoading />;

  return (
    <div className="container mx-auto">
      {/* Order Details */}
      <Descriptions
        bordered
        title={
          <div className="flex justify-between items-center">
            <h2 className="text-[20px] sm:text-[23px] text-primary hover:text-[#1383ad] transition-colors duration-[0.5s]">
              <FormattedMessage id="order-details" />
            </h2>
            <div className="flex justify-center items-center">
              <Tooltip
                title={<FormattedMessage id="prescriptions" />}
                color="#ecb53d"
              >
                <FaPrescriptionBottle
                  className="text-[#ecb53d] cursor-pointer mx-[5px] text-xl"
                  onClick={() => {
                    //console.log(row?.prescriptions)
                    setPrescriptions(data?.prescriptions);
                    setPrescriptionModalOpen(true);
                  }}
                />
              </Tooltip>
              <Tooltip title={<FormattedMessage id="edit" />} color="#03b89e">
                <FiEdit
                  className="text-primary cursor-pointer mx-[5px] text-xl"
                  onClick={() => {
                    setPrescriptionStatus(data?.status);
                    setPrescriptionId(orderId);
                    setEditPrescriptionOpen(true);
                  }}
                />
              </Tooltip>
            </div>
          </div>
        }
        column={1}
        size="middle"
        className="mb-8"
      >
        <Descriptions.Item label={<FormattedMessage id="order-id" />}>
          {data?.id || <FormattedMessage id="noData" />}
        </Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="user-name" />}>
          {data?.user_name || <FormattedMessage id="noData" />}
        </Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="status" />}>
          {statusObj[data?.status] || <FormattedMessage id="noData" />}
        </Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="total_price" />}>
          {data?.total_price || <FormattedMessage id="noData" />}
        </Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="created_at" />}>
          {data?.created_at || <FormattedMessage id="noData" />}
        </Descriptions.Item>

        <Descriptions.Item label={<FormattedMessage id="is_remote_shipping" />}>
          {data?.is_remote_shipping === 0 ? (
            <FormattedMessage id="OutletPlus" />
          ) : data?.is_remote_shipping === 1 ? (
            <FormattedMessage id="SAMSA" />
          ) : (
            <span className="text-gray-300">
              <FormattedMessage id="noData" />
            </span>
          )}
        </Descriptions.Item>

        <Descriptions.Item label={<FormattedMessage id="duration" />}>
          {renderDuration(data?.duration)}
        </Descriptions.Item>

        <Descriptions.Item label={<FormattedMessage id="cash_delivery_fee" />}>
          {data?.cash_delivery_fee || <FormattedMessage id="noData" />}
        </Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="coupon_price" />}>
          {data?.coupon_price || <FormattedMessage id="noData" />}
        </Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="coupon_code" />}>
          {data?.coupon_code || <FormattedMessage id="noData" />}
        </Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="delivery_fee" />}>
          {data?.delivery_fee || <FormattedMessage id="noData" />}
        </Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="cancel_reason" />}>
          {data?.cancel_reason || <FormattedMessage id="noData" />}
        </Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="cancel_other_text" />}>
          {data?.cancel_other_text || <FormattedMessage id="noData" />}
        </Descriptions.Item>
      </Descriptions>

      {/* Order Products */}
      <h2 className="text-[20px] sm:text-[23px] text-primary hover:text-[#1383ad] transition-colors duration-[0.5s] mb-2">
        <FormattedMessage id="order-products" />
      </h2>
      {data?.order_details?.map((item, index) => (
        <Descriptions
          key={index}
          bordered
          size="small"
          title={
            <h3 className="subTitle subTitle text-[18px] sm:text-[20px] text-[#1383ad] hover:text-primary transition-colors duration-[0.5s]">{`${intl.formatMessage(
              { id: "product" }
            )} ${index + 1}`}</h3>
          }
          className="mb-6"
        >
          <Descriptions.Item
            label={<FormattedMessage id="product-name" />}
            span={10}
          >
            {item.product_name || <FormattedMessage id="noData" />}
          </Descriptions.Item>
          <Descriptions.Item
            label={<FormattedMessage id="quantity" />}
            span={3}
          >
            {item.quantity}
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="price" />} span={3}>
            {item.price}
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="offer" />} span={3}>
            {item.offer && item.offer.length > 0 ? (
              item.offer.join(", ")
            ) : (
              <FormattedMessage id="noData" />
            )}
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="product-image" />}>
            {item.image ? (
              <Image
                key={item.product_id}
                src={item.image}
                alt={item.product_name}
                width={120}
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
            ) : (
              <FormattedMessage id="noData" />
            )}
          </Descriptions.Item>
        </Descriptions>
      ))}

      {/* Prescriptions
      // <h2 className="mb-4 text-xl sm:text-2xl text-primary">
      //   <FormattedMessage id="prescriptions" />
      // </h2>
      // {data?.prescriptions?.length > 0 ? (
      //   <Space wrap>
      //     {data.prescriptions.map((item) => (
      //       <Image
      //         key={item.id}
      //         src={item.url}
      //         alt="prescription"
      //         width={120}
      //         style={{ objectFit: "cover", borderRadius: 4 }}
      //         preview={{
      //           mask: (
      //             <span className="flex items-center p-2 text-[14px]">
      //               <IoEyeOutline className="text-[16px] mx-1" />
      //               <FormattedMessage id="perview" />
      //             </span>
      //           ),
      //         }}
      //       />
      //     ))}
      //   </Space>
      // ) : (
      //   <p className="text-gray-300">
      //     <FormattedMessage id="noData" />
      //   </p>
      // )} */}

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
                className="!w-[120px] !h-[100px] object-contain border-solid border-[1px] border-[#d9d9d9] rounded-[5px]"
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
                      label: intl.formatMessage({ id: "accepted" }),
                    },
                    {
                      value: 6,
                      label: intl.formatMessage({ id: "rejected" }),
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
    </div>
  );
}

export default PrescriptionOrderDetails;
