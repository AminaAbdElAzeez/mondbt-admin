import React from "react";
import { Modal } from "antd";
import { FormattedMessage, useIntl } from "react-intl";

interface ConfirmationModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isFeatured: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onCancel,
  onConfirm,
  isFeatured,
}) => {
  const intel = useIntl();

  return (
    <Modal
      title={intel.formatMessage({ id: "ConfirmAction" })}
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={intel.formatMessage({ id: "confirm" })}
      cancelText={intel.formatMessage({ id: "cancel" })}
    >
      <p>
        {isFeatured ? (
          <FormattedMessage id="unFeature" />
        ) : (
          <FormattedMessage id="Feature" />
        )}
      </p>
    </Modal>
  );
};

export default ConfirmationModal;
