import React, { useEffect, useState, useRef } from "react";

import { Input, Form, Button, Dropdown, Select } from "antd";
import { Modal, Image, Descriptions } from "antd";
import type { FormInstance } from "antd/es/form";

import { FormattedMessage, useIntl } from "react-intl";
export interface DataType {
  id: number;
  name: string;
  email: string;
  phone: string;
  profile_image: string;
  is_verified: number;
}
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
// type Props = {
//    setValue: SetState<string>;
//  };

type Props = {
  open: boolean;
  // setOpen: SetState<boolean>;
  cancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
  //cancel: () => void;
  ok: (values: any) => void;
  data?: DataType;
  form?: FormInstance;
  loading: boolean;
};
{
  /***********edit User modal********* */
}
export const EditUserModal: React.FC<Props> = ({
  open,
  cancel,
  ok,
  data,
  form,
  loading,
}) => {
  const intl = useIntl();
  // console.log(data);
  useEffect(() => {
    if (form && data) {
      form.setFieldsValue({
        name: data?.name || "",
        email: data?.email || "",
        phone: data?.phone || "",
        password: "",
        password_confirmation: "",
      });
    }
  }, [data, form]);

  return (
    <>
      {/** edit user** */}
      <Modal
        title={
          <p className="text-[18px]">
            <FormattedMessage id="edit-user" />
          </p>
        }
        open={open}
        onCancel={cancel}
        footer={null}
      >
        <Form
          layout="vertical"
          form={form}
          onFieldsChange={(changedFields, allFields) => {}}
          onFinish={ok}

          // autoComplete="off"
        >
          <div className="my-0 px-2 py-1">
            <Form.Item
              label={<FormattedMessage id="name" />}
              name="name"
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="name-required" />,
                },
                {
                  min: 2,
                  message: <FormattedMessage id="name-min-2-char" />,
                },
                {
                  max: 100,
                  message: <FormattedMessage id="name-max-100-char" />,
                },
              ]}
            >
              <Input
                size="large"
                placeholder={intl.formatMessage({ id: "nameMsg" })}
              />
            </Form.Item>
            <Form.Item
              label={<FormattedMessage id="email" />}
              name="email"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: "emailMsg2" }),
                },
                {
                  type: "email",
                  message: intl.formatMessage({ id: "invalidEmailMsg" }),
                },
              ]}
            >
              <Input placeholder={intl.formatMessage({ id: "emailMsg" })} />
            </Form.Item>
            <Form.Item
              name="phone"
              label={<FormattedMessage id="phone" />}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: "phoneMsg4" }),
                },
                {
                  pattern: /^0?5\d{8}$/,
                  message: intl.formatMessage({ id: "invalidPhoneMsg" }),
                },
              ]}
            >
              <div className="relative">
                <Input
                  className="ltr:pl-[95px] rtl:pr-[95px] py-2"
                  maxLength={10}
                  placeholder={intl.formatMessage({ id: "phoneMsg3" })}
                />
                <img
                  src="/phone.png"
                  alt="phone"
                  className="absolute ltr:left-2 rtl:right-2 top-[50%] translate-y-[-50%] rounded-[5px]"
                />
                <p className="absolute ltr:left-[45px] rtl:right-[45px] top-[50%] translate-y-[-50%] text-[#777]">
                  <FormattedMessage id="codephone" />
                </p>
              </div>
            </Form.Item>
            <Form.Item
              name="password"
              label={<FormattedMessage id="Password" />}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: "PasswordMsg2" }),
                },
              ]}
            >
              <Input.Password
                placeholder={intl.formatMessage({ id: "PasswordMsg" })}
              />
            </Form.Item>
            <Form.Item
              name="password_confirmation"
              label={<FormattedMessage id="Password2" />}
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: "PasswordConfirmMsg2" }),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value)
                      return Promise.resolve();
                    return Promise.reject(
                      new Error(intl.formatMessage({ id: "Password3" }))
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder={intl.formatMessage({ id: "PasswordConfirmMsg" })}
              />
            </Form.Item>
          </div>
          <Form.Item className="modals-btns update-user-modal-btns flex justify-end items-center sticky bottom-0 bg-white z-[1000] pt-2">
            <Button
              // type="primary"

              size="large"
              className="modals-cancel-btn min-w-[65px] me-1 text-black inline-block hover:text-black hover:border-black"
              onClick={cancel}
            >
              <FormattedMessage id="cancel" />
            </Button>
            <Button
              // type="primary"

              size="large"
              className="modals-confirm-btn text-white min-w-[65px] ms-1 bg-primary hover:bg-primary inline-block"
              htmlType="submit"
              loading={loading}
            >
              <FormattedMessage id="edit" />
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

{
  /*******add User modal******** */
}

export const AddUserModal: React.FC<Props> = ({
  open,
  cancel,
  ok,
  form,
  loading,
}) => {
  const intl = useIntl();
  return (
    <>
      {/** add FAQ** */}

      <Modal
        title={
          <p className="text-[18px]">
            <FormattedMessage id="add-User" />
          </p>
        }
        open={open}
        // onOk={() => {
        //   setIsAddFaqOpen(false);
        //   form.resetFields();
        // }}
        onCancel={cancel}
        footer={null}
      >
        <Form
          layout="vertical"
          form={form}
          onFieldsChange={(changedFields, allFields) => {}}
          onFinish={ok}

          // autoComplete="off"
        >
          <div
            className="my-0 px-2 py-1 
           
            "
          >
            <Form.Item
              label={<FormattedMessage id="name" />}
              name="name"
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="name-required" />,
                },
                {
                  min: 2,
                  message: <FormattedMessage id="name-min-2-char" />,
                },
                {
                  max: 100,
                  message: <FormattedMessage id="name-max-100-char" />,
                },
              ]}
            >
              <Input
                // size="large"
                className="py-2"
                placeholder={intl.formatMessage({ id: "nameMsg" })}
              />
            </Form.Item>
            <Form.Item
              label={<FormattedMessage id="email" />}
              name="email"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: "emailMsg2" }),
                },
                {
                  type: "email",
                  message: intl.formatMessage({ id: "invalidEmailMsg" }),
                },
              ]}
            >
              <Input
                placeholder={intl.formatMessage({ id: "emailMsg" })}
                className="py-2"
              />
            </Form.Item>
            <Form.Item
              name="phone"
              label={<FormattedMessage id="phone" />}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: "phoneMsg4" }),
                },
                {
                  pattern: /^0?5\d{8}$/,
                  message: intl.formatMessage({ id: "invalidPhoneMsg" }),
                },
              ]}
            >
              <div className="relative">
                <Input
                  className="ltr:pl-[95px] rtl:pr-[95px] py-2"
                  maxLength={10}
                  placeholder={intl.formatMessage({ id: "phoneMsg3" })}
                />
                <img
                  src="/phone.png"
                  alt="phone"
                  className="absolute ltr:left-2 rtl:right-2 top-[50%] translate-y-[-50%] rounded-[5px]"
                />
                <p className="absolute ltr:left-[45px] rtl:right-[45px] top-[50%] translate-y-[-50%] text-[#777]">
                  <FormattedMessage id="codephone" />
                </p>
              </div>
            </Form.Item>
            <Form.Item
              name="password"
              label={<FormattedMessage id="Password" />}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: "PasswordMsg2" }),
                },
              ]}
            >
              <Input.Password
                className="py-2"
                placeholder={intl.formatMessage({ id: "PasswordMsg" })}
              />
            </Form.Item>
            <Form.Item
              className="py-2"
              name="password_confirmation"
              label={<FormattedMessage id="Password2" />}
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: "PasswordConfirmMsg2" }),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value)
                      return Promise.resolve();
                    return Promise.reject(
                      new Error(intl.formatMessage({ id: "Password3" }))
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                className="py-2"
                placeholder={intl.formatMessage({ id: "PasswordConfirmMsg" })}
              />
            </Form.Item>
          </div>
          <Form.Item className="modals-btns update-user-modal-btns flex justify-end items-center sticky bottom-0 bg-white z-[1000] pt-4">
            <Button
              // type="primary"

              size="large"
              className="modals-cancel-btn min-w-[65px] me-1 text-black inline-block hover:text-black hover:border-black"
              onClick={cancel}
            >
              <FormattedMessage id="cancel" />
            </Button>
            <Button
              // type="primary"

              size="large"
              className="modals-confirm-btn text-white min-w-[65px] ms-1 bg-primary hover:bg-primary inline-block"
              htmlType="submit"
              loading={loading}
            >
              <FormattedMessage id="add" />
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

{
  /******delete modal****** */
}
export const DeleteUserModal: React.FC<Props> = ({
  open,
  cancel,
  ok,

  loading,
}) => {
  return (
    <>
      <Modal
        title={
          <p className="text-[18px]">
            <FormattedMessage id="delete-faq" />
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
          {<FormattedMessage id="sure-delete-faq" />}
        </p>
      </Modal>
    </>
  );
};

// View
interface UserModalProps {
  visible: boolean;
  onClose: () => void;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    profile_image: string;
    is_verified: number;
  } | null;
}

const ViewModal: React.FC<UserModalProps> = ({ visible, onClose, user }) => {
  //   console.log("User received in ViewModal:", user);
  const intl = useIntl();

  return (
    <Modal
      title={<FormattedMessage id="user-details" />}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      {user ? (
        <Descriptions bordered column={1}>
          <Descriptions.Item label={<FormattedMessage id="name" />}>
            {user.name}
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="email" />}>
            {user.email}
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="phone" />}>
            {user.phone}
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="profile-image" />}>
            <Image
              src={user.profile_image}
              alt={intl.formatMessage({ id: "profileImage" })}
              width={100}
            />
          </Descriptions.Item>
          <Descriptions.Item label={<FormattedMessage id="is-verified" />}>
            {user.is_verified === 1 ? (
              <FormattedMessage id="yes" />
            ) : (
              <FormattedMessage id="no" />
            )}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Loading...</p>
      )}
    </Modal>
  );
};

export default ViewModal;
