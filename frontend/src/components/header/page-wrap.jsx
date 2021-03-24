import React from 'react';
import './page-wrap.css';
import { useHistory } from 'react-router-dom';
import { Icon, Image, Button } from 'semantic-ui-react';
import logo from '../../static/images/logo-dashboard.png';
import { logout } from '../../api/auth-api';
import PageTopHeader from './page-header';
import PageContent from './page-content';
import { Spin } from 'antd';

export default function PageWrap(props) {
  const history = useHistory();
  return (
    <div className='c-page-wrap'>
      <div className='c-page-menu'>
        <div className='c-menu-logo'>
          <Image src={logo} horizontal size='small' />
        </div>
        <div className={props.selected == 'home' ? 'c-menu-item-selected' : 'c-menu-item'} onClick={() => history.push('/')}><Icon name='home' /> Home</div>
        <div className={props.selected == 'position' ? 'c-menu-item-selected' : 'c-menu-item'} onClick={() => history.push('/position')}><Icon name='suitcase' /> Position</div>
        <div className={props.selected == 'interview' ? 'c-menu-item-selected' : 'c-menu-item'} onClick={() => history.push('/interview')}><Icon name='film' /> Interview</div>
        <div className={props.selected == 'problem-set' ? 'c-menu-item-selected' : 'c-menu-item'} onClick={() => history.push('/problem-set')}><Icon name='pencil' /> Problem Set</div>
        <div className={props.selected == 'statistics' ? 'c-menu-item-selected' : 'c-menu-item'} onClick={() => history.push('/statistics')}><Icon name='chart pie' /> Statistics</div>
        <div className={props.selected == 'profile' ? 'c-menu-item-selected' : 'c-menu-item'} onClick={() => history.push('/profile')}><Icon name='database' /> Profile</div>
      </div>
      <div className='c-page-body'>
        <div className='c-page-header'>
          <Button
            color='red'
            onClick={()=>{
              logout(res => history.push('/login'));
            }}
          >
            Logout
          </Button>
        </div>
        <div className='c-page-content'>
          { props.loading ? 
            <Spin size='large' delay={50} style={{position:'relative',top:'calc(50% - 25px)',left:'calc(50% - 25px)'}} /> 
            : 
            props.children
          }
        </div>
      </div>
    </div>
  );
};
