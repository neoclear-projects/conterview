import React from 'react';
import { Header, Divider, Pagination } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PageWrap from '../header/page-wrap';
import { PageHeader, Breadcrumb, Avatar, Empty } from 'antd';
import { getEvents } from '../../api/event-api';
import { getUser } from '../../api/user-api';
import { avatarProps } from '../../util/avatar-props';
import { toLocalTimeString } from '../../util/time';
import UserPopover from '../user/user-popover';

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loading:true,
      events:{},
      user:{},
      totalPage:1,
      page:1,
    };

    getUser(window.localStorage.getItem('userId'), res => {
      this.state.user = res.data;
      getEvents(this.state.page,
        res => {
          this.state.events = res.data.events;
          this.state.totalPage = res.data.totalPage;
          this.setState({loading: false});
        },
        err => {}
      );
    });
  }  

  onPageChange = (e, pageInfo) => {
    this.state.page = pageInfo.activePage;
  	getEvents(this.state.page,
      res => {
        this.state.totalPage = res.data.totalPage;
        this.setState({events: res.data.events});
      },
      err => {}
    );
  };

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
              <UserPopover user={event.user}/>
              {` ${actionWord} position `} 
              <Link to={`/position/${event.item1._id}`}>{event.item1.name}</Link>
            </div>
          );
          break;
        case 'interview':
          description = (
            <div>
              <UserPopover user={event.user}/>
              {` ${actionWord} interview with candidate `} 
              <Link to={`/position/${event.item2._id}/interview/${event.item1._id}`}>{event.item1.name}</Link> for position <Link to={`/position/${event.item2._id}`}>{event.item2.name}</Link>
            </div>
          );
          break;
        case 'problem':
          description = (
            <div>
              <UserPopover user={event.user}/>
              {` ${actionWord} problem <${event.item1.name}>`} 
            </div>
          );
          break;
      }

      return (
        <Header style={{margin:0}}>
          <Avatar {...avatarProps(event.user._id, event.user.username, 40)} style={{marginRight:'10px'}} />
          <Header.Content>
            {description}
            <Header.Subheader>{toLocalTimeString(event.time)}</Header.Subheader>
          </Header.Content>
          <Divider/>
        </Header>
      )
    });

    return (
      <PageWrap selected='home'>
        <PageHeader
          avatar={avatarProps(this.state.user._id, this.state.user.username, 50)}
          title={`Welcome, ${this.state.user.username}`}
          subTitle={this.state.user.title && this.state.user.department ? `${this.state.user.title} | ${this.state.user.department}` : 'Please complete your profile'}
          style={{backgroundColor:'white',marginTop:'5px'}}
          extra={[]}
          breadcrumbRender = {() => routes}
        >
        </PageHeader>
        <div style={{backgroundColor:'white', padding:'48px', margin:'25px'}}>
          {
            this.state.events.length === 0 ?
            <Empty
              description='No activities yet'
            />
            :
            <div style={{display:'flex', flexDirection:'column', alignItems:'stretch'}}>
              { content }
              <Pagination activePage={this.state.page} onPageChange={this.onPageChange} totalPages={this.state.totalPage} style={{margin:'auto'}}/>
            </div>
          }
        </div>
        
      </PageWrap>
    );
  };
}

export default Home;
