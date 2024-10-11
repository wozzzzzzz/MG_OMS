import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

function OrderModal({ show, onClose, selectedDate, order, isEdit }) {
  const [name, setName] = useState(order ? order.name : '');
  const [phone, setPhone] = useState(order ? order.phone : '');
  const [items, setItems] = useState(order ? order.items : []);
  const [serviceType, setServiceType] = useState(order ? order.serviceType : '픽업');
  const [paymentStatus, setPaymentStatus] = useState(order ? order.paymentStatus : '미결제');
  const [time, setTime] = useState(order ? { hour: order.time.split(':')[0], minute: order.time.split(':')[1] } : { hour: '10', minute: '00' });
  const [status, setStatus] = useState(order ? order.status : '준비중');
  const [note, setNote] = useState(order ? order.note : '');

  const menuOptions = [
    "망개떡세트 S", "망개떡세트 M", "망개떡세트 L", 
    "망굴세트 S", "망굴세트 M", "망굴세트 L", 
    "종합세트 M", "종합세트 L", 
    "함지선물세트 S", "함지선물세트 M", "함지선물세트 L", 
    "떡 케이크 S", "떡 케이크 M", "떡 케이크 L", 
    "연잎밥", "전통식혜 500ml", "전통식혜 1L", 
    "단호박식혜 500ml", "단호박식혜 1L"
  ];

  const handleSaveOrder = async () => {
    const formattedItems = items.map(item => ({
      menu: item.menu,
      quantity: item.quantity
    }));

    const selectedDateString = selectedDate.toISOString().split('T')[0];

    try {
      if (isEdit) {
        const orderRef = doc(db, 'orders', selectedDateString, 'orderList', order.id);
        await updateDoc(orderRef, {
          name, phone, items: formattedItems, serviceType, paymentStatus, time: `${time.hour}:${time.minute}`, status, note
        });
      } else {
        await addDoc(collection(db, 'orders', selectedDateString, 'orderList'), {
          name, phone, items: formattedItems, serviceType, paymentStatus, time: `${time.hour}:${time.minute}`, status, note, date: selectedDateString
        });
      }
      onClose();
    } catch (error) {
      console.error("주문 저장 중 오류 발생: ", error);
    }
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
    setItems(updatedItems);
  };

  const addNewItem = () => {
    setItems([...items, { menu: '', quantity: 1 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "주문 수정하기" : "새 주문 추가하기"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="custom-subtitle">주문자 이름과 전화번호는 꼭 남겨주세요!</p>
        <Form>
          {/* 이름 필드 */}
          <Form.Group controlId="formName">
            <Form.Label>이름</Form.Label>
            <Form.Control
              type="text"
              placeholder="이름 입력"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          {/* 전화번호 필드 */}
          <Form.Group controlId="formPhone">
            <Form.Label>전화번호</Form.Label>
            <Form.Control
              type="text"
              placeholder="전화번호 입력"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Group>

          {/* 시간 필드 */}
          <Form.Group controlId="formTime">
            <Form.Label>시간</Form.Label>
            <div className="time-select">
              <Form.Control
                as="select"
                value={time.hour}
                onChange={(e) => setTime({ ...time, hour: e.target.value })}
              >
                {[...Array(24).keys()].map(i => (
                  <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                ))}
              </Form.Control>
              :
              <Form.Control
                as="select"
                value={time.minute}
                onChange={(e) => setTime({ ...time, minute: e.target.value })}
              >
                {[...Array(60).keys()].filter(i => i % 10 === 0).map(i => (
                  <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                ))}
              </Form.Control>
            </div>
          </Form.Group>

          {/* 메뉴 항목 필드 */}
          <Form.Group controlId="formItems">
            <Form.Label>메뉴</Form.Label>
            {items.map((item, index) => (
              <div key={index} className="mb-2">
                <Form.Control
                  as="select"
                  name="menu"
                  value={item.menu}
                  onChange={(e) => handleItemChange(e, index)}
                >
                  <option value="">선택</option>
                  {menuOptions.map((menu, idx) => (
                    <option key={idx} value={menu}>{menu}</option>
                  ))}
                </Form.Control>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(e, index)}
                  min="1"
                />
                <Button variant="danger" onClick={() => removeItem(index)}>삭제</Button>
              </div>
            ))}
            <Button variant="secondary" onClick={addNewItem}>메뉴 추가</Button>
          </Form.Group>

          {/* 서비스 유형 필드 */}
          <Form.Group controlId="formServiceType">
            <Form.Label>서비스 유형</Form.Label>
            <Form.Control
              as="select"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            >
              <option value="픽업">픽업</option>
              <option value="퀵 서비스">퀵 서비스</option>
            </Form.Control>
          </Form.Group>

          {/* 결제 상태 필드 */}
          <Form.Group controlId="formPaymentStatus">
            <Form.Label>결제 상태</Form.Label>
            <Form.Control
              as="select"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="미결제">미결제</option>
              <option value="완불">완불</option>
            </Form.Control>
          </Form.Group>

          {/* 주문 상태 필드 */}
          <Form.Group controlId="formStatus">
            <Form.Label>주문 상태</Form.Label>
            <Form.Control
              as="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="준비중">준비중</option>
              <option value="완료">완료</option>
              <option value="취소">취소</option>
            </Form.Control>
          </Form.Group>

          {/* 기타 사항 필드 */}
          <Form.Group controlId="formNote">
            <Form.Label>기타 추가사항</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="기타 사항을 입력하세요"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>취소</Button>
        <Button variant="primary" onClick={handleSaveOrder}>
          {isEdit ? "수정" : "추가"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OrderModal;