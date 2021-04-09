import React from 'react';
import PageWrap from '../header/page-wrap';
import { PageHeader, Breadcrumb, Empty } from 'antd';
import { Link } from 'react-router-dom';
import { Header, List } from 'semantic-ui-react';
import { getInterviewsAllPosition } from '../../api/interview-api';
import { getPositions } from '../../api/position-api';

class Statistics extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loading:true,
      positions:[],
      interviews:[],
    }
    getInterviewsAllPosition({status:'finished'}, res => {
      this.state.interviews = res.data.interviews;
      getPositions({allFinished:true}, res => {
        this.state.positions = res.data.positions;
        this.setState({loading: false});
      });
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
          <Link to='/statistics'>Statistics</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
    );

    return (
      <PageWrap selected='statistics'>
        <PageHeader
          title='Statistics'
          style={{backgroundColor:'white',marginTop:'5px'}}
          breadcrumbRender = {() => routes}
        >
        </PageHeader>
        <div style={{margin:'25px', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
          <div style={{backgroundColor:'white', width:'calc(50% - 10px)', padding:'20px'}}>
            <Header>Positions Ready</Header>
            { 
              this.state.positions.length === 0 ?
              <Empty
                description='No positions ready yet'
              />
              :
              <List divided selection style={{marginLeft:'20px'}}>
                {
                  this.state.positions.map(position => {
                    return (
                      <List.Item onClick={() => this.props.history.push(`/position/${position._id}/statistics`)}>
                        <Header>{position.name}</Header>
                      </List.Item>
                    );
                  })
                }
              </List>
            }
          </div>
          <div style={{backgroundColor:'white', width:'calc(50% - 10px)', padding:'20px'}}>
            <Header>Interviews Ready</Header>
            {
              this.state.interviews.length === 0 ?
              <Empty
                description='No interviews ready yet'
              />
              :
              <List divided selection style={{marginLeft:'20px'}}>
                {
                  this.state.interviews.map(interview => {
                    return (
                      <List.Item onClick={() => this.props.history.push(`/position/${interview.position._id}/interview/${interview._id}/statistics`)}>
                        <Header>{`${interview.candidate.name} for ${interview.position.name}`}</Header>
                      </List.Item>
                    );
                  })
                }
              </List>
            }
          </div>
        </div>
      </PageWrap>
    );
  }
}

export default Statistics;
