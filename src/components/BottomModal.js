import React from 'react';
import { Modal } from 'react-bootstrap';
import '/Users/banjax.index/oms/src/styles/styles.css';

const BottomModal = ({ show, onClose, children }) => {
  return (
    <Modal show={show} onHide={onClose} dialogClassName="bottom-modal" centered>
      <Modal.Body>
        {children}
      </Modal.Body>
    </Modal>
  );
};

export default BottomModal;