import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import OrderModal from './components/OrderModal';


function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Firestore에서 주문 가져오기
  useEffect(() => {
    const selectedDateString = selectedDate.toISOString().split('T')[0];

    const unsubscribe = onSnapshot(
      collection(db, 'orders', selectedDateString, 'orderList'),
      (snapshot) => {
        const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(fetchedOrders);
      },
      (error) => {
        console.error("주문을 불러오는 중 에러 발생: ", error);
      }
    );

    return () => unsubscribe();
  }, [selectedDate]);

  // 주문 수정 모달 열기
  const handleShowEditOrderModal = (order) => {
    setSelectedOrder(order);
    setIsEdit(true);
    setIsOrderModalVisible(true);
  };

  // 주문 삭제
  const handleDeleteOrder = async (orderId) => {
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    try {
      await deleteDoc(doc(db, 'orders', selectedDateString, 'orderList', orderId));
    } catch (error) {
      console.error("주문 삭제 중 에러 발생: ", error);
    }
  };

  // 주문 추가 모달 열기
  const handleShowAddOrderModal = () => {
    setSelectedOrder(null);
    setIsEdit(false);
    setIsOrderModalVisible(true);
  };

  // 주문을 시간대별로 그룹화
  const groupedOrdersByTime = orders.reduce((acc, order) => {
    const hour = order.time.split(':')[0]; // 시간대 그룹화
    const timeKey = `${hour}시`;

    if (!acc[timeKey]) acc[timeKey] = [];
    acc[timeKey].push(order);
    return acc;
  }, {});

  // 시간대별로 정렬된 키 가져오기
  const sortedTimes = Object.keys(groupedOrdersByTime).sort((a, b) => {
    const hourA = parseInt(a, 10);
    const hourB = parseInt(b, 10);
    return hourA - hourB;
  });

  return (
    <div className="order-management">
      <h1>주문 관리</h1>
      
      {/* 날짜 선택 */}
      <div className="date-picker-container">
        <h2>날짜 선택</h2>
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
        />
      </div>

      {/* 주문 추가 버튼 */}
      <button className="btn btn-primary" onClick={handleShowAddOrderModal}>주문 추가</button>

      {/* 시간대별로 주문 목록 보여주기 */}
      {sortedTimes.length === 0 ? (
        <p>주문이 없습니다.</p>
      ) : (
        sortedTimes.map(time => {
          const timeOrders = groupedOrdersByTime[time];

          return (
            <div key={time} className="time-group">
              <h2>{time} 주문 목록</h2>
              
              {timeOrders.map(order => (
                <div key={order.id} className="order-card">
                  <p><strong>{order.time}</strong></p>
                  <p>{order.name} - {order.phone}</p>
                  {order.items.map((item, index) => (
                    <p key={index}>{item.menu}: {item.quantity}개</p>
                  ))}
                  <button onClick={() => handleShowEditOrderModal(order)}>수정</button>
                  <button onClick={() => handleDeleteOrder(order.id)}>삭제</button>
                </div>
              ))}
            </div>
          );
        })
      )}

      {/* 주문 추가/수정 모달 */}
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