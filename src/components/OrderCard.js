import React from 'react';
import styled from 'styled-components';


const OrderCardWrapper = styled.div`
  align-items: flex-start;
  background-color: #ffffff;
  border: 1.07px solid;
  border-color: #00000033;
  display: flex;
  flex-direction: column;
  gap: 19.41px;
  padding: 24.26px;
  position: relative;
`;

const Frame2 = styled.div`
  align-items: center;
  align-self: stretch;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const TextWrapper2 = styled.div`
  color: #2d2e30;
  font-family: 'Pretendard-SemiBold', Helvetica;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.4px;
  line-height: 28.5px;
`;

const Frame3 = styled.div`
  align-items: center;
  display: inline-flex;
  gap: 5.36px;
`;

const Frame4 = styled.div`
  align-items: center;
  background-color: #4e596829;
  border-radius: 11.8px;
  display: inline-flex;
  flex-direction: column;
  height: 23.6px;
  padding: 4.29px 8.58px;
`;

const TextWrapper3 = styled.div`
  color: #4e5968;
  font-family: 'Pretendard-SemiBold', Helvetica;
  font-size: 12.9px;
  font-weight: 600;
`;

const Frame5 = styled.div`
  align-items: center;
  background-color: #4e596829;
  border-radius: 11.8px;
  display: inline-flex;
  flex-direction: column;
  height: 23.6px;
  padding: 4.29px 8.58px;
`;

const TextWrapper4 = styled.div`
  color: #4e5968;
  font-family: 'Pretendard-SemiBold', Helvetica;
  font-size: 12.9px;
  font-weight: 600;
`;

const OrderItemWrapper = styled.div`
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex-wrap: wrap;
  gap: 18.6px 18.6px;
  justify-content: space-around;
  width: 100%;
`;

const Frame6 = styled.div`
  align-items: center;
  background-color: #fafafb;
  border: 1px solid;
  border-color: #d2d3d7;
  border-radius: 10.64px;
  display: flex;
  gap: 6.65px;
  padding: 16.17px;
  width: 359.86px;
`;

const TextWrapper5 = styled.div`
  color: #b7b9c0;
  font-family: 'Pretendard-Medium', Helvetica;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.32px;
  line-height: 22.8px;
`;

const Frame7 = styled.div`
  background-color: #2d2e3033;
  border-radius: 10.64px;
  height: 1px;
  width: 359.86px;
`;

const Frame8 = styled.div`
  align-items: flex-end;
  align-self: stretch;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Frame9 = styled.div`
  align-items: flex-start;
  display: inline-flex;
  flex-direction: column;
  gap: 6.47px;
`;

const TextWrapper6 = styled.div`
  color: #2d2e3080;
  font-family: 'Pretendard-Bold', Helvetica;
  font-size: 16.2px;
  font-weight: 700;
`;

const TextWrapper7 = styled.div`
  color: #2d2e3059;
  font-family: 'Pretendard-Medium', Helvetica;
  font-size: 12.9px;
  font-weight: 500;
`;

const Rectangle = styled.div`
  background-color: #d9d9d9;
  border-radius: 6.47px;
  height: 37.2px;
  width: 37.2px;
`;

function OrderCard({ order, onEdit, onDelete }) {
  return (
    <OrderCardWrapper>
      <Frame2>
        <TextWrapper2>{order.time}</TextWrapper2>
      </Frame2>

      <Frame3>
        <Frame4>
          <TextWrapper3>{order.paymentStatus}</TextWrapper3>
        </Frame4>
        <Frame5>
          <TextWrapper4>{order.serviceType}</TextWrapper4>
        </Frame5>
      </Frame3>

      <OrderItemWrapper>
        {order.items.map((item, index) => (
          <div key={index}>
            <span>{item.menu}: </span>
            <span>{item.quantity}개</span>
          </div>
        ))}
      </OrderItemWrapper>

      <Frame7 />

      <Frame8>
        <Frame9>
          <TextWrapper6>{order.name}</TextWrapper6>
          <TextWrapper7>{order.phone}</TextWrapper7>
        </Frame9>
        <Rectangle />
      </Frame8>

      <Frame2>
        <button onClick={() => onEdit(order)} className="btn btn-primary">수정</button>
        <button onClick={() => onDelete(order.id)} className="btn btn-danger">삭제</button>
      </Frame2>
    </OrderCardWrapper>
  );
}

export default OrderCard;