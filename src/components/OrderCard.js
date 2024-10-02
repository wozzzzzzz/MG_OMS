import React from 'react';
import '/Users/banjax.index/oms/src/styles/styles.css';

function OrderCard({ order, onEdit, onDelete }) {
  return (
    <div className="order-card">

      <h3>{order.name}</h3>
      <p>전화번호: {order.phone}</p>
      <p>시간: {order.time}</p>
      <div className="order-items">
        {order.items.map((item, index) => (
          <div key={index} className="order-item">
            <span>{item.menu}:</span> 
            <span>{item.quantity}개</span>
          </div>
        ))}
      </div>
      <p>서비스 유형: {order.serviceType}</p>
      <p>결제 상태: {order.paymentStatus}</p>
      <p>주문 상태: {order.status}</p>

      <button onClick={() => onEdit(order)} className="btn btn-primary">수정</button>
      <button onClick={() => onDelete(order.id)} className="btn btn-danger">삭제</button>
    </div>
  );
}

export default OrderCard;