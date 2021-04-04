import React from 'react';
import { Button, Header, Image, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PageWrap from '../header/page-wrap';
import { PageHeader, Breadcrumb } from 'antd';
import { getEvents } from '../../api/event-api';
import { avatarUrl } from '../../api/avatar-url';
import { getUser } from '../../api/user-api';
import { getCookie } from '../../util/get-cookie';

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loading:true,
      events:{},
      user:{},
    };

    getUser(getCookie('user-id'), res => {
      this.state.user = res.data;
      getEvents(
        res => {
          this.state.events = res.data;
          this.setState({loading: false});
        },
        err => {}
      );
    });
  }  

  render(){
    if(this.state.loading) return (<PageWrap selected='interview' loading></PageWrap>)

    const routes = (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to='/'>Home</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
    );

    let content = this.state.events.map(event => {
      let actionWord;
      switch(event.action){
        case 'create':
          actionWord = 'created';
          break;
        case 'update':
          actionWord = 'updated';
          break;
        case 'delete':
          actionWord = 'deleted';
          break;
        case 'watch':
          actionWord = 'started watching';
          break;
      }

      let description;
      switch(event.itemType){
        case 'position':
          description = (
            <div>
              {`${event.user.username} ${actionWord} position `} 
              <Link to={`/position/${event.item1._id}`}>{event.item1.name}</Link>
            </div>
          );
          break;
        case 'interview':
          description = (
            <div>
              {`${event.user.username} ${actionWord} interview with candidate `} 
              <Link to={`/position/${event.item2._id}/interview/${event.item1._id}`}>{event.item1.name}</Link> for position <Link to={`/position/${event.item2._id}`}>{event.item2.name}</Link>
            </div>
          );
          break;
        case 'problem':
          description = (
            <div>
              {console.log(event.item1)}
              {`${event.user.username} ${actionWord} problem <${event.item1.name}>`} 
            </div>
          );
          break;
      }

      return (
        <Header>
          <Image circular src={avatarUrl(event.user._id)} />
          <Header.Content>
            {description}
            <Header.Subheader>{event.time}</Header.Subheader>
          </Header.Content>
          <Divider/>
        </Header>
      )
    });

    return (
      <PageWrap selected='home'>
        <PageHeader
          avatar={{src:avatarUrl(this.state.user._id)}}
          title={`Welcome, ${this.state.user.username}`}
          subTitle={this.state.user.title && this.state.user.department ? `${this.state.user.title} | ${this.state.user.department}` : 'Please complete your profile'}
          style={{backgroundColor:'white',marginTop:'5px'}}
          extra={[
            <Button basic color='blue' onClick={() => this.props.history.push('/editor')}>
              Try Editor!
            </Button>,
            <Button basic color='green' onClick={() => this.props.history.push('/note')}>
              View Notes
            </Button>,
          ]}
          breadcrumbRender = {() => routes}
        >
        </PageHeader>

        <div style={{backgroundColor:'white', padding:'50px', margin:'25px', }}>
          { content }
        </div>

      </PageWrap>
    );
  };
}

export default Home;
