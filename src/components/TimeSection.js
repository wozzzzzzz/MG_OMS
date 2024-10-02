import React from 'react';
import OrderCard from './OrderCard';
import '/Users/banjax.index/oms/src/styles/styles.css';

function TimeSection({ orders, onDeleteOrder, onEditOrder }) {
  // 주문을 시간대별로 그룹화
  const groupedOrdersByTime = orders.reduce((acc, order) => {
    const hour = order.time.split(':')[0]; // 주문 시간을 기준으로 시간대 그룹화
    const timeKey = `${hour}시`;
    
    if (!acc[timeKey]) acc[timeKey] = []; // 해당 시간대가 없으면 초기화
    acc[timeKey].push(order); // 시간대별로 주문 추가
    return acc;
  }, {});

  // 시간대별로 정렬된 키를 가져옴
  const sortedTimes = Object.keys(groupedOrdersByTime).sort((a, b) => {
    const hourA = parseInt(a, 10);
    const hourB = parseInt(b, 10);
    return hourA - hourB;
  });

  // 시간대별로 총 메뉴 수를 계산하는 함수
  const getMenuCountForTime = (orders) => {
    const menuCount = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        // 메뉴와 수량이 존재하는지 확인하고, 수량은 숫자로 변환
        if (item.menu && item.quantity) {
          const quantity = parseInt(item.quantity, 10);
          if (!isNaN(quantity)) {
            if (menuCount[item.menu]) {
              menuCount[item.menu] += quantity;
            } else {
              menuCount[item.menu] = quantity;
            }
          }
        }
      });
    });
    return menuCount;
  };

  return (
    <div className="time-section">
      {sortedTimes.length === 0 ? (
        <p>주문이 없습니다.</p>
      ) : (
        <>
          {sortedTimes.map(time => {
            const timeOrders = groupedOrdersByTime[time];

            // 시간대 내의 주문들을 시간 순으로 정렬
            const sortedOrders = timeOrders.sort((a, b) => new Date(`1970-01-01T${a.time}:00Z`) - new Date(`1970-01-01T${b.time}:00Z`));

            // 해당 시간대의 메뉴 요약 계산
            const menuCount = getMenuCountForTime(timeOrders);

            return (
              <div key={time} className="time-group">
                <h2>{time} 주문</h2>
                <div className="order-cards">
                  {sortedOrders.map(order => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onDelete={onDeleteOrder}
                      onEdit={onEditOrder}
                    />
                  ))}
                </div>
                <div className="menu-summary">
                  <h3>메뉴 요약</h3>
                  {Object.entries(menuCount).length > 0 ? (
                    Object.entries(menuCount).map(([menu, count]) => (
                      <p key={menu}>{menu}: {count}개</p>
                    ))
                  ) : (
                    <p>메뉴 없음</p>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default TimeSection;