import React from 'react';
import PageWrap from '../header/page-wrap';
import { Space, Upload, Avatar } from 'antd';
import { Form, Image, Button, Modal } from 'semantic-ui-react';
import { getUser, updateUser } from '../../api/user-api';
import ImgCrop from 'antd-img-crop';
import { PlusOutlined } from '@ant-design/icons';
import { avatarProps } from '../../util/avatar-props';

class Profile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loading:true,
      changeAvatarModal:false,
    }
    getUser(window.localStorage.getItem('userId'),
      res => {
        let user = res.data;
        this.state.username = user.username;
        this.state.email = user.email;
        this.state.department = user.department;
        this.state.title = user.title;
        this.state.personalStatement = user.personalStatement;
        this.state._id = user._id;
        this.setState({loading: false});
      },
    );
  }

  handleInputChange = (e, {name, value}) => this.setState({ [name]: value });

  setChangeAvatarModal = (open) => this.setState({changeAvatarModal: open});

  handleSubmit = () => {
    const { _id, username, email, department, title, personalStatement } = this.state;
    updateUser(_id, username, email, department, title, personalStatement,
      res => {
        
      }
    );
  };
  
  render() {
    if(this.state.loading) return (<PageWrap selected='interview' loading></PageWrap>);

    return (
      <PageWrap selected='profile'>
        <div style={{backgroundColor:'white', padding:'50px', margin:'25px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Space align='center' direction='vertical'>
            <Avatar {...avatarProps(this.state._id, this.state.username, 130)} key={new Date()}/>
            <Button color='green' onClick={() => this.setChangeAvatarModal(true)}>Change Avatar</Button>
            <Form style={{width: '480px'}} onSubmit={this.handleSubmit}>
              <Form.Input
                label='Username'
                name='username'
                onChange={this.handleInputChange}
                placeholder='Enter your username'
                value={this.state.username}
                required
              />
              <Form.Input
                label='Email'
                name='email'
                type='email'
                onChange={this.handleInputChange}
                placeholder='Enter your email'
                value={this.state.email}
                required
              />
              <Form.Input
                label='Department'
                name='department'
                onChange={this.handleInputChange}
                placeholder='Enter your department'
                value={this.state.department}
              />
              <Form.Input
                label='Title'
                name='title'
                onChange={this.handleInputChange}
                placeholder='Enter your title'
                value={this.state.title}
              />
              <Form.TextArea
                label='Personal Statement'
                name='personalStatement'
                onChange={this.handleInputChange}
                rows='10'
                value={this.state.personalStatement}
              />
              <Form.Button
                fluid
                type='submit'
                color='facebook'
              >Change Profile</Form.Button>
            </Form>
          </Space>
        </div>

        <Modal
          closeIcon
          onClose={() => this.setChangeAvatarModal(false)}
          open={this.state.changeAvatarModal}>
          <Modal.Header>Change Avatar</Modal.Header>
          <Modal.Content>
            <ImgCrop shape='round'>
              <Upload
                method='PATCH'
                name='avatar'
                action={process.env.REACT_APP_SERVER+'/api/organization/'+window.localStorage.getItem('organizationId')+'/user/'+this.state._id+'/avatar'}
                listType="picture-card"
                showUploadList={false}
                withCredentials={true}
                onChange={info => {
                  if(info.file.status === 'done'){
                    this.setChangeAvatarModal(false);
                  }
                }}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </ImgCrop>
          </Modal.Content>
        </Modal>
      </PageWrap>
    );
  }
}

export default Profile;
