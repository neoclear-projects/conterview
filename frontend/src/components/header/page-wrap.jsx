import React from 'react';
import './page-wrap.css';
import { Icon, Image, List } from 'semantic-ui-react';
import logo from '../../static/images/logo-dashboard.png';
import { logout } from '../../api/auth-api';
import { Spin, Popover, Space, Avatar } from 'antd';
import { withRouter } from 'react-router-dom';
import { avatarProps } from '../../util/avatar-props';

class PageWrap extends React.Component {
  render(){
    const content = (
      <List divided relaxed style={{width: '100px'}}>
        <List.Item 
          icon='user' 
          content='Profile'
          onClick={()=>{
            this.props.history.push('/profile');
          }}
        />
        <List.Item 
          icon='sign-out' 
          content='Logout' 
          onClick={()=>{
            logout(res => this.props.history.push('/login'));
          }}
        />
      </List>
    );
    return (
      <div className='c-page-wrap'>
        <div className='c-page-menu'>
          <div className='c-menu-logo'>
            <Image src={logo} horizontal size='small' />
          </div>
          <div className={this.props.selected === 'home' ? 'c-menu-item-selected' : 'c-menu-item'} onClick={() => this.props.history.push('/')}><Icon name='home' /> Home</div>
          <div className={this.props.selected === 'position' ? 'c-menu-item-selected' : 'c-menu-item'} onClick={() => this.props.history.push('/position')}><Icon name='suitcase' /> Position</div>
          <div className={this.props.selected === 'interview' ? 'c-menu-item-selected' : 'c-menu-item'} onClick={() => this.props.history.push('/interview')}><Icon name='film' /> Interview</div>
          <div className={this.props.selected === 'problem-set' ? 'c-menu-item-selected' : 'c-menu-item'} onClick={() => this.props.history.push('/problem-set')}><Icon name='pencil' /> Problem Set</div>
          <div className={this.props.selected === 'statistics' ? 'c-menu-item-selected' : 'c-menu-item'} onClick={() => this.props.history.push('/statistics')}><Icon name='chart pie' /> Statistics</div>
          <div className={this.props.selected === 'profile' ? 'c-menu-item-selected' : 'c-menu-item'} onClick={() => this.props.history.push('/profile')}><Icon name='user' /> Profile</div>
        </div>
        <div className='c-page-body'>
          <div className='c-page-header'>
            <Popover content={content}>
              <Space>
                <Avatar {...avatarProps(window.localStorage.getItem('userId'), window.localStorage.getItem('username'), 30)} />
                <span>{window.localStorage.getItem('username')}</span>
              </Space>
            </Popover>
          </div>
          <div className='c-page-content'>
            { this.props.loading ? 
              <Spin size='large' delay={50} style={{position:'relative',top:'calc(50% - 25px)',left:'calc(50% - 25px)'}} /> 
              : 
              this.props.children
            }
          </div>
        </div>
      </div>
    );
  };
}

export default withRouter(PageWrap);
