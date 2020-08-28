import React from 'react';
import { Modal } from 'antd';

function ViewModal(prop) {
  return (
    <Modal
      title={prop.modalTitle}
      visible={prop.modalVisible}
      onCancel={prop.onCancel}
      footer={null}
      getContainer={prop.modalContainer}
      centered={true}
    >
      {prop.modalText}
    </Modal>
  )
}

export default ViewModal