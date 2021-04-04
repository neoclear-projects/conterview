import React from 'react';
import PageWrap from '../header/page-wrap';
import { PageHeader, Breadcrumb, Descriptions, Divider, Result, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { getInterview, deleteInterview } from '../../api/interview-api';
import { Button, Header, List } from 'semantic-ui-react';
import CreateInterview from './create-interview';
import { toLocalTimeString } from '../../util/time';
import { avatarProps } from '../../util/avatar-props';
import UserPopover from '../user/user-popover';

class InterviewItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loading:true,
      editIntModal:false,
      interview:{},
      notFound:false,
    }
    getInterview(this.props.match.params.positionId, this.props.match.params.interviewId, '', 
      res => {
        this.state.interview = res.data;
        this.setState({loading: false});
      },
      err => {
        if(err.response.status === 404) this.setState({notFound:true});
      }
    );
  }

  fetchData(){
    getInterview(this.props.match.params.positionId, this.props.match.params.interviewId, '', res => {
      this.setState({interview: res.data});
    });
  }

  setEditIntModal = (open) => this.setState({editIntModal: open});

	render() { 
    if(this.state.notFound) return (<PageWrap selected='interview'><Result status="404" title="Interview not found" subTitle="This interview might have been deleted"/></PageWrap>);
    if(this.state.loading) return (<PageWrap selected='interview' loading></PageWrap>);
		const routes = (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to='/'>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to='/position'>Position</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/position/${this.props.match.params.positionId}`}>{this.state.interview.position.name}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          Interview
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/position/${this.props.match.params.positionId}/interview/${this.props.match.params.interviewId}`}>{this.state.interview.candidate.name}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
    );

		return (
			<PageWrap selected='interview'>
        <PageHeader
          title={this.state.interview.candidate.name}
          subTitle={this.state.interview.position.name}
          style={{backgroundColor:'white',marginTop:'5px'}}
          extra={[
            <Button color='green' onClick={() => this.props.history.push(`/position/${this.props.match.params.positionId}/interview/${this.props.match.params.interviewId}/running`)}>Go for it</Button>,
            <Button color='blue' onClick={() => this.setEditIntModal(true)}>Edit Interview</Button>,
            <Button color='blue' onClick={() => this.props.history.push('/position/'+this.state.interview.position._id+'/interview/'+this.state.interview._id+'/statistics')}>Statistics</Button>,
            <Button color='red' onClick={() => deleteInterview(this.props.match.params.positionId, this.props.match.params.interviewId, res => {this.props.history.push(`/position/${this.props.match.params.positionId}`)})}>Delete Interview</Button>
          ]}
          breadcrumbRender = {() => routes}
        >
        </PageHeader>
        <div style={{backgroundColor:'white', padding:'50px', margin:'25px'}}>
          <Header>Candidate Information</Header>
          <Descriptions>
            <Descriptions.Item label="Name" labelStyle={{fontWeight:'600'}}>{this.state.interview.candidate.name}</Descriptions.Item>
            <Descriptions.Item label="Email" labelStyle={{fontWeight:'600'}}>{this.state.interview.candidate.email}</Descriptions.Item>
          </Descriptions>
          <Divider/>
          <Header>Basic Information</Header>
          <Descriptions>
            <Descriptions.Item label="Status" labelStyle={{fontWeight:'600'}}>{this.state.interview.status}</Descriptions.Item>
            <Descriptions.Item label="Scheduled Time" labelStyle={{fontWeight:'600'}}>{toLocalTimeString(this.state.interview.scheduledTime)}</Descriptions.Item>
            <Descriptions.Item label="Scheduled Length" labelStyle={{fontWeight:'600'}}>{`${this.state.interview.scheduledLength} minutes`}</Descriptions.Item>
          </Descriptions>
          <Divider/>
          <Header>Interviewers</Header>
          <div>
            {this.state.interview.interviewers.map(interviewer => {return (
              <Header>
                <Avatar {...avatarProps(interviewer._id, interviewer.username, 25)} style={{marginRight:'10px'}} />
                <Header.Content>
                  <UserPopover user={interviewer}/>
                </Header.Content>
              </Header>
            )})}
          </div>
          <Divider/>
          <Header>Problems</Header>
          <List>
            {this.state.interview.problems.map(problem => {return <List.Item>{problem.problemName}</List.Item>})}
          </List>
        </div>

        <CreateInterview
          open={this.state.editIntModal}
          onClose={() => this.setEditIntModal(false)}
          onSubmit={() => {
            this.setEditIntModal(false);
            this.fetchData();
          }}
          interview={this.state.interview}
        >
        </CreateInterview>
      </PageWrap>
		);
	};
}

export default InterviewItem;