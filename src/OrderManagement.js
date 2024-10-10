import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import OrderModal from './components/OrderModal';
import OrderCard from './components/OrderCard'; // OrderCard 컴포넌트 import
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/OrderManagement.css';
import './styles/CustomDatePicker.css';

function CustomDatePicker({ selectedDate, setSelectedDate }) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const formatDate = (date) => {
    const options = { month: 'long', day: 'numeric', weekday: 'long' };
    return date.toLocaleDateString('ko-KR', options);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
    localStorage.setItem('selectedDate', date.toISOString()); // 선택한 날짜를 로컬 스토리지에 저장
  };

  return (
    <div className="custom-date-picker">
      <button
        className="date-picker-button"
        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
      >
        <div className="date-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="21" viewBox="0 0 22 21" fill="none">
          <g clip-path="url(#clip0_938_345)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.1746 9.1168L10.3001 13.9912C10.1364 14.1549 9.91445 14.2468 9.68298 14.2468C9.45152 14.2468 9.22952 14.1549 9.06582 13.9912L6.08392 11.0084C6.00287 10.9274 5.93858 10.8312 5.89472 10.7253C5.85086 10.6194 5.82828 10.5059 5.82828 10.3913C5.82828 10.2767 5.85086 10.1632 5.89472 10.0573C5.93858 9.95138 6.00287 9.85516 6.08392 9.77412C6.16496 9.69307 6.26118 9.62878 6.36707 9.58492C6.47296 9.54106 6.58646 9.51848 6.70107 9.51848C6.81569 9.51848 6.92918 9.54105 7.03508 9.58492C7.14097 9.62878 7.23718 9.69307 7.31823 9.77412L9.68298 12.1389L13.9402 7.88249C14.0213 7.80144 14.1175 7.73715 14.2234 7.69329C14.3293 7.64943 14.4428 7.62685 14.5574 7.62685C14.672 7.62685 14.7855 7.64943 14.8914 7.69329C14.9973 7.73715 15.0935 7.80144 15.1746 7.88249C15.2556 7.96353 15.3199 8.05975 15.3637 8.16564C15.4076 8.27153 15.4302 8.38503 15.4302 8.49965C15.4302 8.61426 15.4076 8.72776 15.3637 8.83365C15.3199 8.93954 15.2556 9.03576 15.1746 9.1168ZM17.3508 2.46948H15.9279V1.59656C15.9279 1.36504 15.8359 1.14301 15.6722 0.979307C15.5085 0.815601 15.2865 0.723633 15.055 0.723633C14.8234 0.723633 14.6014 0.815601 14.4377 0.979307C14.274 1.14301 14.182 1.36504 14.182 1.59656V2.46948H7.07643V1.59656C7.07643 1.36504 6.98446 1.14301 6.82076 0.979307C6.65705 0.815601 6.43502 0.723633 6.20351 0.723633C5.97199 0.723633 5.74996 0.815601 5.58626 0.979307C5.42255 1.14301 5.33058 1.36504 5.33058 1.59656V2.46948H3.90771C3.44469 2.46948 3.00062 2.65342 2.67321 2.98083C2.3458 3.30824 2.16187 3.7523 2.16187 4.21533V17.6584C2.16187 18.1214 2.3458 18.5655 2.67321 18.8929C3.00062 19.2203 3.44469 19.4042 3.90771 19.4042H17.3508C17.8138 19.4042 18.2578 19.2203 18.5853 18.8929C18.9127 18.5655 19.0966 18.1214 19.0966 17.6584V4.21533C19.0966 3.7523 18.9127 3.30824 18.5853 2.98083C18.2578 2.65342 17.8138 2.46948 17.3508 2.46948Z" fill="#77E3AB"/>
          </g>
          <defs>
            <clipPath id="clip0_938_345">
              <rect width="20.9502" height="20.9502" fill="white" transform="translate(0.154053 0.0253906)"/>
            </clipPath>
          </defs>
        </svg>
        </div>
        <span>{formatDate(selectedDate)}</span>
        <span className="arrow-down">▼</span>
      </button>

      {/* isDatePickerOpen이 true일 때만 캘린더 표시 */}
      {isDatePickerOpen && (
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          inline // 캘린더가 인라인으로 표시됩니다.
        />
      )}
    </div>
  );
}

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const savedDate = localStorage.getItem('selectedDate');
    return savedDate ? new Date(savedDate) : new Date(); // 로컬 스토리지에 저장된 날짜가 있으면 로드하고, 없으면 오늘 날짜로 설정
  });
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const selectedDateString = selectedDate.toISOString().split('T')[0];

    const unsubscribe = onSnapshot(
      collection(db, 'orders', selectedDateString, 'orderList'),
      (snapshot) => {
        const fetchedOrders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOrders(fetchedOrders);
      },
      (error) => {
        console.error('주문을 불러오는 중 에러 발생: ', error);
      }
    );

    return () => unsubscribe();
  }, [selectedDate]);

  const handleShowEditOrderModal = (order) => {
    setSelectedOrder(order);
    setIsEdit(true);
    setIsOrderModalVisible(true);
  };

  const handleDeleteOrder = async (orderId) => {
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    try {
      await deleteDoc(doc(db, 'orders', selectedDateString, 'orderList', orderId));
    } catch (error) {
      console.error('주문 삭제 중 에러 발생: ', error);
    }
  };

  const handleShowAddOrderModal = () => {
    setSelectedOrder(null);
    setIsEdit(false);
    setIsOrderModalVisible(true);
  };

  const groupedOrdersByTime = orders.reduce((acc, order) => {
    const hour = order.time.split(':')[0];
    const timeKey = `${hour}시`;

    if (!acc[timeKey]) acc[timeKey] = [];
    acc[timeKey].push(order);
    return acc;
  }, {});

  const sortedTimes = Object.keys(groupedOrdersByTime).sort((a, b) => {
    const hourA = parseInt(a, 10);
    const hourB = parseInt(b, 10);
    return hourA - hourB;
  });

  return (
    <div className="order-management">
      <header className="div_sticky_104">
        <div className="Frame72">
          <h1 className="div_sticky_h1">주문 관리</h1>
          <CustomDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>

        <div className="div_flexGap_16">
          <button className="btn-add-order" onClick={handleShowAddOrderModal}>
            완료 주문 확인
          </button>

          <button className="btn-add-order" onClick={handleShowAddOrderModal}>
            + 주문 추가
          </button>
        </div>

        
      </header>

      <section className="orders-container">
        {sortedTimes.length === 0 ? (
          <p>주문이 없습니다.</p>
        ) : (
          sortedTimes.map((time) => {
            const timeOrders = groupedOrdersByTime[time];

            return (
              <div key={time} className="time-group">
                <h2 className="time-group-title">{time} 주문 목록</h2>
                <div className="orders-list">
                  {timeOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onEdit={handleShowEditOrderModal}
                      onDelete={handleDeleteOrder}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>

      {isOrderModalVisible && (
        <OrderModal
          show={isOrderModalVisible}
          onClose={() => setIsOrderModalVisible(false)}
          selectedDate={selectedDate}
          order={selectedOrder}
          isEdit={isEdit}
        />
      )}
    </div>
  );
}

export default OrderManagement;