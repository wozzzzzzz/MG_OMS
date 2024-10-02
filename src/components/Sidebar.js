import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>메뉴</h2>
      <ul>
        <li>
          <Link to="/">주문 관리</Link>
        </li>
        <li>
          <Link to="/calculator">피 계산기</Link>
        </li>
        <li>
          <Link to="/customer-info">고객 정보</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;