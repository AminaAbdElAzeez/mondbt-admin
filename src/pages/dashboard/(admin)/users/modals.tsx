import React, { useEffect, useState, useRef } from "react";

import { Input, Form, Modal, Button, Dropdown, Select, DatePicker } from "antd";
import type { FormInstance } from "antd/es/form";
import type { DatePickerProps } from "antd";
import { FormattedMessage, useIntl } from "react-intl";

import { DataType } from "./page";
type Props = {
  open: boolean;
  // setOpen: SetState<boolean>;
  cancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
  //cancel: () => void;
  loading?: boolean;
  ok: (values: any) => void;
  data?: DataType;
  form?: FormInstance;
};
{
  /****add modal*** */
}
export const AddClientModal: React.FC<Props> = ({
  open,
  cancel,
  ok,
  data,
  form,
  loading,
}) => {
  const intl = useIntl();
  const onStartDateChange: DatePickerProps["onChange"] = (date, dateString) => {
    form.setFieldsValue({ start_date: dateString });
  };
  return (
    <>
      <Modal
        title={
          <p className="text-[18px]">
            <FormattedMessage id="add-client" />
          </p>
        }
        open={open}
        onCancel={cancel}
        footer={null}
      >
        <Form
          className="pt-[50px] flex flex-col w-full"
          layout="vertical"
          form={form}
          //initialValues={{ remember: true }}
          onFinish={ok}
          autoComplete="off"
        >
          <Form.Item
            // label={<FormattedMessage id="email" />}
            name="name"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="name-required" />,
              },
              // {
              //   type: "email",
              //   message: <FormattedMessage id="invalid-email" />,
              // },
            ]}
          >
            <Input size="large" placeholder="user name" />
          </Form.Item>

          <div className="relative h-16">
            <Form.Item
              // label={<FormattedMessage id="email" />}
              name="email"
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="email-required" />,
                },
                {
                  type: "email",
                  message: <FormattedMessage id="invalid-email" />,
                },
              ]}
            >
              <Input size="large" placeholder="email" />
            </Form.Item>
            {/* <IoMail
                  className={`text-[20px] md:text-[25px] text-primary absolute start-4 top-1/2 -translate-y-[60%]`}
                /> */}
          </div>
          <div className="relative h-16">
            <Form.Item
              // label={<FormattedMessage id="email" />}
              name="phone"
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="phone-required" />,
                },
              ]}
            >
              <Input size="large" placeholder="phone number" />
            </Form.Item>
            {/* <IoCall
                  className={`text-[20px] md:text-[25px] text-primary absolute start-4 top-1/2 -translate-y-[60%]`}
                /> */}
          </div>
          <div className="relative h-16">
            <Form.Item
              // label={<FormattedMessage id="password" />}
              name="password"
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="password-required" />,
                },
              ]}
              className="!mb-0"
            >
              <Input.Password size="large" placeholder="password" />
            </Form.Item>
            {/* <RiLockPasswordFill
                  className={`text-[20px] md:text-[25px] !text-primary absolute start-4 top-1/2 -translate-y-[60%] z-[99999]`}
                /> */}
          </div>
          <div className="relative h-16">
            <Form.Item
              // label={<FormattedMessage id="password" />}
              name="password_confirmation"
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="password-required" />,
                },
              ]}
              className="!mb-0"
            >
              <Input.Password size="large" placeholder="confirm password" />
            </Form.Item>
            {/* <RiLockPasswordFill
                  className={`text-[20px] md:text-[25px] text-primary absolute start-4 top-1/2 -translate-y-[60%] z-[9999]`}
                /> */}
          </div>
          {/* Submit Button */}
          <div className="mt-[20px] flex items-center justify-end">
            <Button
              htmlType="submit"
              className={`px-4   min-h-[30px] !border-none !outline-none !text-gray-800 !bg-gray-300 min-w-[80px] me-2 rounded-md text-[14px] sm:text-[16px] font-[600]  border  transition-colors duration-500 group`}
            >
              {<FormattedMessage id="cancel" />}
            </Button>
            <Button
              htmlType="submit"
              loading={loading}
              className={`px-4   min-h-[30px] !border-none !outline-none !text-white !bg-[#03B89E] min-w-[80px] rounded-md text-[14px] sm:text-[16px] font-[600]  border  transition-colors duration-500 group`}
            >
              {<FormattedMessage id="add" />}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

{
  /****edit modal*** */
}
export const EditCouponStatusModal: React.FC<Props> = ({
  open,
  cancel,
  ok,
  data,
  form,
  loading,
}) => {
  return (
    <>
      <Modal
        title={
          <p className="text-[18px]">
            <FormattedMessage id="edit-coupon-status" />
          </p>
        }
        open={open}
        onCancel={cancel}
        footer={
          <>
            <div className="flex justify-end items-center">
              <Button
                className="cursor-pointer py-2 px-3 b text-black shadow-md mx-2 rounded-md border-none"
                onClick={cancel}
              >
                <FormattedMessage id="cancel" />
              </Button>
              <Button
                className="cursor-pointer py-2 px-3 bg-primary text-white hover:!bg-primary hover:!text-white  mx-2 rounded-md border-none"
                onClick={ok}
                loading={loading}
              >
                <FormattedMessage id="edit" />
              </Button>
            </div>
          </>
        }
      >
        <p className="text-[16px] py-8">
          {<FormattedMessage id="sure-edit-coupon-status" />}
        </p>
      </Modal>
    </>
  );
};

{
  /******delete modal****** */
}
export const DeleteCouponModal: React.FC<Props> = ({
  open,
  cancel,
  ok,
  data,
  form,
  loading,
}) => {
  return (
    <>
      <Modal
        title={
          <p className="text-[18px]">
            <FormattedMessage id="delet-coupon" />
          </p>
        }
        open={open}
        onCancel={cancel}
        footer={
          <>
            <div className="flex justify-end items-center">
              <Button
                className="cursor-pointer py-2 px-3 b text-black shadow-md mx-2 rounded-md border-none"
                onClick={cancel}
              >
                <FormattedMessage id="cancel" />
              </Button>
              <Button
                className="cursor-pointer py-2 px-3 bg-red-700 text-white hover:!bg-red-700 hover:!text-white  mx-2 rounded-md border-none"
                onClick={ok}
                loading={loading}
              >
                <FormattedMessage id="delete" />
              </Button>
            </div>
          </>
        }
      >
        <p className="text-[16px] py-8">
          {<FormattedMessage id="sure-delete-coupon" />}
        </p>
      </Modal>
    </>
  );
};
