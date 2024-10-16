import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import '../styles/OrderModal.css';

function OrderModal({ show, onClose, selectedDate, order, isEdit }) {
  // State 설정
  const [name, setName] = useState(order ? order.name : '');
  const [phone, setPhone] = useState(order ? order.phone : '');
  const [items, setItems] = useState(order ? order.items : []);
  const [serviceType, setServiceType] = useState(order ? order.serviceType : '픽업');
  const [paymentStatus, setPaymentStatus] = useState(order ? order.paymentStatus : '미결제');
  const [time, setTime] = useState(order ? { hour: order.time.split(':')[0], minute: order.time.split(':')[1] } : { hour: '10', minute: '00' });
  const [status, setStatus] = useState(order ? order.status : '준비중');
  const [note, setNote] = useState(order ? order.note : '');
  const [selectedDatetime, setSelectedDatetime] = useState(new Date());

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
    const formattedTime = `${selectedDatetime.getHours()}:${selectedDatetime.getMinutes()}`;

    try {
      if (isEdit) {
        const orderRef = doc(db, 'orders', selectedDateString, 'orderList', order.id);
        await updateDoc(orderRef, {
          name, phone, items: formattedItems, serviceType, paymentStatus, time: formattedTime, status, note
        });
      } else {
        await addDoc(collection(db, 'orders', selectedDateString, 'orderList'), {
          name, phone, items: formattedItems, serviceType, paymentStatus, time: formattedTime, status, note, date: selectedDateString
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

  const handleDatetimeChange = (e) => {
    setSelectedDatetime(new Date(e.target.value));
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* 모달 상단 */}
        <div className="modal-header">
          <div>{isEdit ? "주문 수정하기" : "새 주문 추가하기"}</div>
          <button onClick={onClose} className="close-btn">
            {/* Close 버튼 아이콘 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="22.684" height="22.684" viewBox="0 0 24 24" fill="none">
              <path d="M14.5331 11.8759L14.3004 12.1085L14.5331 12.3412L22.858 20.6661L22.8581 20.6662C22.9919 20.7998 23.098 20.9585 23.1704 21.1332C23.2428 21.3078 23.2801 21.4951 23.2801 21.6842C23.2801 21.8732 23.2428 22.0605 23.1704 22.2351C23.098 22.4098 22.9919 22.5685 22.8581 22.7021L22.8576 22.7026C22.7242 22.8365 22.5657 22.9426 22.3912 23.0151C22.2167 23.0875 22.0296 23.1248 21.8406 23.1248C21.6516 23.1248 21.4645 23.0875 21.29 23.0151C21.1155 22.9426 20.957 22.8365 20.8236 22.7026L20.8233 22.7023L12.4984 14.3759L12.2657 14.1432L12.0331 14.3759L3.70672 22.7022C3.42639 22.9826 3.05913 23.1228 2.69058 23.123C2.40645 23.1219 2.12895 23.037 1.89294 22.8787C1.65677 22.7204 1.47269 22.4958 1.36385 22.2331C1.25501 21.9704 1.22627 21.6814 1.28124 21.4025C1.33619 21.1237 1.4723 20.8673 1.67247 20.6656C1.67258 20.6655 1.6727 20.6654 1.67281 20.6653L9.99836 12.3412L10.2311 12.1085L9.99836 11.8759L1.6761 3.5551C1.42323 3.2827 1.2854 2.92303 1.29157 2.55127C1.29778 2.17776 1.44886 1.82128 1.71293 1.55705C1.977 1.29283 2.33339 1.14154 2.7069 1.13511C3.07863 1.12872 3.43836 1.26632 3.71089 1.519L12.0331 9.84119L12.2657 10.0738L12.4984 9.84117L20.8232 1.51489C20.9569 1.38129 21.1156 1.27532 21.2902 1.20304C21.4648 1.13076 21.652 1.09358 21.841 1.09364C22.03 1.0937 22.2172 1.13098 22.3918 1.20336C22.5664 1.27574 22.725 1.3818 22.8586 1.51549C22.9922 1.64918 23.0982 1.80788 23.1705 1.98252C23.2428 2.15716 23.2799 2.34433 23.2799 2.53334C23.2798 2.72235 23.2425 2.9095 23.1702 3.0841C23.0978 3.25869 22.9917 3.41733 22.858 3.55094L22.858 3.55101L14.5331 11.8759Z" fill="#B4B6BB" stroke="white" stroke-width="0.657982"/>
            </svg>
          </button>
        </div>

        <div className='modal-subText'>주문자 이름과 전화번호는 꼭 남겨주세요!</div>
          <div className="modal-body">
          <form>

            {/* 주문자 이름 필드 */}
            <div className="form-group">
              <input
                type="text"
                placeholder="주문자 이름을 입력해주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>

            {/* 전화번호 필드 */}
            <div className="form-group">
              <input
                type="text"
                placeholder="휴대폰번호를 입력해주세요"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
              />
            </div>

            {/* 서비스 형태 및 시간 선택 */}
            <div className="form-group service-type-datetime">
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="input-field"
            >
              <option value="매장픽업">매장픽업</option>
              <option value="퀵 서비스">퀵 서비스</option>
            </select>
            <input
              type="datetime-local"
              value={selectedDatetime.toISOString().slice(0, 16)}
              onChange={handleDatetimeChange}
              className="input-field datetime-picker"
            />
          </div>


            {/* 메뉴 항목 필드 */}
            <div className="form-group">
              {items.map((item, index) => (
                <div key={index} className="menu-item">
                  <select
                    name="menu"
                    value={item.menu}
                    onChange={(e) => handleItemChange(e, index)}
                  >
                    <option value="">선택</option>
                    {menuOptions.map((menu, idx) => (
                      <option key={idx} value={menu}>
                        {menu}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(e, index)}
                    min="1"
                    className="quantity-input"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="remove-btn"
                  >
                    삭제
                  </button>
                </div>
              ))}
              <button type="button" onClick={addNewItem} className="add-btn">
                메뉴 추가
              </button>
            </div>

            {/* 기타 사항 필드 */}
            <div className="form-group">
              <textarea
                rows={3}
                placeholder="기타 사항을 입력하세요"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="input-field"
              />
            </div>
          </form>
        </div>

        {/* 모달 푸터 */}
        <div className="modal-footer">
          <button onClick={handleSaveOrder} className="modal-btn save-btn">
            {isEdit ? "수정" : "추가"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderModal;