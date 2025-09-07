import { useQuery } from "@tanstack/react-query";
import {
  Descriptions,
  Spin,
  Button,
  Tooltip,
  Image,
  Modal,
  message,
  Select,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import RollerLoading from "components/loading/roller";
import { FormattedMessage, useIntl } from "react-intl";
import { FaCheckSquare, FaPlus } from "react-icons/fa";
import axios from "utlis/library/helpers/axios";
import { IoEyeOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { AiOutlineContainer } from "react-icons/ai";
import { CgCloseR } from "react-icons/cg";

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
  delivery_method: number;
  created_at: string;
  cancel_reason: string | null;
  cancel_other_text: string | null;
  order_details: orderDetails[];
  cash_delivery_fee: number | string;
  coupon_price: number | string;
  delivery_fee: string;
  coupon_code: string;
  duration: string;
  is_remote_shipping: number;
}

function OrderDetails() {
  const intl = useIntl();
  const { locale } = useIntl();

  const location = useLocation();
  const navigate = useNavigate();
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
  const orderId = location.state?.orderId;

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

  const fetchOrderDetailsFunc = async () => {
    const { data } = await axios.get(`admin/orders/${orderId}`, {
      headers: {
        "Accept-Language": intl.locale === "ar" ? "ar" : "en",
      },
    });
    return {
      id: data?.data?.id,
      user_id: data?.data?.user_id,
      user_name: data?.data?.user_name,
      status: data?.data?.status,
      total_price: data?.data?.total_price,
      created_at: data?.data?.created_at,
      cancel_reason: data?.data?.cancel_reason,
      cancel_other_text: data?.data?.cancel_other_text,
      delivery_method: data?.data?.delivery_method,
      order_details: data?.data?.order_details,
      cash_delivery_fee: data?.data?.cash_delivery_fee,
      coupon_price: data?.data?.coupon_price,
      offer: data?.data?.offer,
      coupon_code: data?.data?.coupon_code,
      delivery_fee: data?.data?.delivery_fee,
      is_remote_shipping: data?.data?.is_remote_shipping,
      duration: data?.data?.duration,
    };
  };

  const { data, isLoading, isFetching, refetch } = useQuery<DataType, Error>({
    queryKey: ["fetchOrderDetails", orderId, locale],
    queryFn: fetchOrderDetailsFunc,
    // keepPreviousData: true,
  });

  return (
    <div className="container mx-auto">
      {isLoading ? (
        <RollerLoading />
      ) : (
        <>
          {/* Order Details */}
          <Descriptions
            bordered
            title={
              <div className="flex justify-between items-center">
                <h2 className="text-[20px] sm:text-[23px] text-primary hover:text-[#1b8ab2] transition-colors duration-[0.5s]">
                  <FormattedMessage id="order-details" />
                </h2>
                <div className="flex justify-center items-center gap-2">
                  {data.delivery_method === 1 &&
                    data.status !== 3 &&
                    data.status !== 4 &&
                    data.status !== 5 &&
                    data.status !== 6 &&
                    data.status !== 7 && (
                      <>
                        <Tooltip
                          title={<FormattedMessage id="completeOrder" />}
                          color="#03b89e"
                        >
                          <FaCheckSquare
                            className="text-[#03b89e] cursor-pointer text-2xl"
                            onClick={() => handleOpenModal("complete", data.id)}
                          />
                        </Tooltip>

                        <Tooltip
                          title={<FormattedMessage id="cancelOrder" />}
                          color="rgb(185 28 28)"
                        >
                          <CgCloseR
                            className="text-red-700 cursor-pointer text-2xl"
                            onClick={() => handleOpenModal("cancel", data.id)}
                          />
                        </Tooltip>
                      </>
                    )}
                  <Tooltip
                    title={<FormattedMessage id="add" />}
                    color="#03b89e"
                  >
                    <Button
                      type="primary"
                      className=" shadow-none bg-[#03b89e] hover:!bg-[#03b89e]"
                      icon={<FaPlus />}
                      shape="circle"
                      onClick={() => navigate("/admin/orders/add-order")}
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

            <Descriptions.Item
              label={<FormattedMessage id="is_remote_shipping" />}
            >
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

            <Descriptions.Item
              label={<FormattedMessage id="cash_delivery_fee" />}
            >
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
            <Descriptions.Item
              label={<FormattedMessage id="cancel_other_text" />}
            >
              {data?.cancel_other_text || <FormattedMessage id="noData" />}
            </Descriptions.Item>
          </Descriptions>

          {/* Divider */}
          <h2 className="text-[20px] sm:text-[23px] text-primary hover:text-[#1b8ab2] transition-colors duration-[0.5s] mb-2 sm:mb-[7px]">
            <FormattedMessage id="order-products" />
          </h2>

          {/* Order Products */}
          {data?.order_details?.map((item, index) => (
            <Descriptions
              key={index}
              bordered
              size="small"
              title={
                <h3 className="subTitle text-[18px] sm:text-[20px] text-[#1383ad] hover:text-primary transition-colors duration-[0.5s]">{`${intl.formatMessage(
                  { id: "product" }
                )} ${index + 1}`}</h3>
              }
              className="mb-6"
            >
              {/* <Descriptions.Item label={<FormattedMessage id="product-name" />}>
                {isFetching ? (
                  <Spin size="small" tip={<FormattedMessage id="loading" />} />
                ) : (
                  item.product_name || <FormattedMessage id="noData" />
                )}
              </Descriptions.Item> */}

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
              <Descriptions.Item
                label={<FormattedMessage id="price" />}
                span={3}
              >
                {item.price}
              </Descriptions.Item>

              <Descriptions.Item
                label={<FormattedMessage id="offer" />}
                span={3}
              >
                {item.offer && item.offer.length > 0 ? (
                  item.offer.join(", ")
                ) : (
                  <FormattedMessage id="noData" />
                )}
              </Descriptions.Item>

              <Descriptions.Item
                label={<FormattedMessage id="product-image" />}
              >
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
        </>
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
    </div>
  );
}

export default OrderDetails;
