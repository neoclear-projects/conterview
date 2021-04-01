import React from 'react';
import PageWrap from '../header/page-wrap';
import { Space } from 'antd';
import { Form, Image, Button } from 'semantic-ui-react';

class Profile extends React.Component {
  render() {
    return (
      <PageWrap selected='profile'>
        <div style={{backgroundColor:'white', padding:'50px', margin:'25px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Space align='center' direction='vertical'>
            <Image src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' size='small' circular/>
            <Button color='green'>Change Avatar</Button>
            <Form style={{width: '480px'}}>
              <Form.Input
                label='Username'
                name='username'
                onChange={this.handleInputChange}
                placeholder='Enter your username'
                required
              />
              <Form.Input
                label='Email'
                name='email'
                type='email'
                onChange={this.handleInputChange}
                placeholder='Enter your email'
                required
              />
              <Form.Input
                label='Department'
                name='department'
                onChange={this.handleInputChange}
                placeholder='Enter your department'
              />
              <Form.Input
                label='Title'
                name='title'
                onChange={this.handleInputChange}
                placeholder='Enter your title'
              />
              <Form.TextArea
                label='Personal Statement'
                name='title'
                onChange={this.handleInputChange}
                rows='10'
              />
            </Form>
          </Space>
        </div>
      </PageWrap>
    );
  }
}

export default Profile;
