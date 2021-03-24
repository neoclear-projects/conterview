import React from 'react';
import './page-wrap.css';

export default function PageContent(props) {
  let className = 'page-content ' + (props.className ? props.className : '');
  return (
    <div className={className}>
      {props.children}
    </div>
  );
};