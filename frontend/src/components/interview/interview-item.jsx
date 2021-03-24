import React from 'react';
import PageWrap from '../header/page-wrap';
import { PageHeader, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { getInterview } from '../../api/interview-api';
import { Button } from 'semantic-ui-react';

class InterviewItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loading:true,
      interview:{},
    }
    getInterview(this.props.match.params.positionId, this.props.match.params.interviewId, '', res => {
      this.state.interview = res.data;
      this.setState({loading: false});
    });
  }

	render() { 
    if(this.state.loading) return (<PageWrap selected='interview' loading></PageWrap>)
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
          title="Interview"
          style={{backgroundColor:'white',marginTop:'5px'}}
          extra={[
            <Button color='green' onClick={() => this.setCreateIntModal(true)}>Create Interview</Button>,
          ]}
          breadcrumbRender = {() => routes}
        >
        </PageHeader>
      </PageWrap>
		);
	};
}

export default InterviewItem;