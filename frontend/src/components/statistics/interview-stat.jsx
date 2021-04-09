import React from 'react';
import PageWrap from '../header/page-wrap';
import { PageHeader, Breadcrumb, Statistic } from 'antd';
import { Link } from 'react-router-dom';
import { getInterview } from '../../api/interview-api';
import { Divider, Header } from 'semantic-ui-react';

class InterviewStat extends React.Component {
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
    if(this.state.loading) return (<PageWrap selected='statistics' loading></PageWrap>)
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
        <Breadcrumb.Item>
          Statistics
        </Breadcrumb.Item>
      </Breadcrumb>
    );

    let content = this.state.interview.problemsSnapshot.map((problem) => {
      return (
        <div>
          <Divider style={{marginBottom:'20px'}}/>
          <Header style={{marginBottom:'30px'}} as='h2' content={problem.problemName}/>
          <div style={{marginLeft:'20px'}}>
            {
              problem.problemRubric.map(rubric => {
                return (
                  <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'20px'}}>
                    <Header style={{width:'70%'}} content={rubric.name} subheader={rubric.desc}/>
                    <Statistic value={rubric.curRating} suffix={'/ ' + rubric.rating} />
                  </div>
                );
              })
            }
            <Header style={{marginBottom:'20px'}} content='Interviewer Comments' subheader={problem.comment}/>
          </div>
        </div>
      );
    });

    

    return (
      <PageWrap selected='statistics'>
        <PageHeader
          title={this.state.interview.candidate.name}
          subTitle={this.state.interview.position.name}
          style={{backgroundColor:'white',marginTop:'5px'}}
          breadcrumbRender = {() => routes}
        >
        </PageHeader>
        <div style={{backgroundColor:'white', padding:'50px', margin:'25px'}}>
          <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-end'}}>
            <Statistic title='Total Grade' value={this.state.interview.totalGrade} suffix={'/ ' + this.state.interview.maxTotalGrade} />
          </div>
          { content }
        </div>
      </PageWrap>
    );
  }
}

export default InterviewStat;