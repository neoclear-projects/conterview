import React from 'react';
import './page-wrap.css';

export default function PageTopHeader(props) {
  let className = 'page-header-left-part ' + (props.className ? props.className : '');
  return (
    <div className={className}>
      {props.children}
    </div>
  );
};
