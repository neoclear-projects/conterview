import React from 'react';
import PageWrap from '../header/page-wrap';
import { getInterviews } from '../../api/interview-api';
import { Bar } from 'react-chartjs-2';
import { PageHeader, Breadcrumb, Statistic } from 'antd';
import { Link } from 'react-router-dom';
import { Table, Header } from 'semantic-ui-react';

class PositionStat extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loading:true,
      interviews:{},
    }
    getInterviews(this.props.match.params.positionId, '', 'finished', res => {
      this.state.interviews = res.data.sort((i1,i2) => {return i2.totalGrade - i1.totalGrade});
      this.setState({loading: false});
    });
  } 

  render() {
    if(this.state.loading) return (<PageWrap selected='statistics' loading></PageWrap>);

    const routes = (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to='/'>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to='/position'>Position</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/position/${this.props.match.params.positionId}`}>{this.state.interviews[0].position.name}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          Statistics
        </Breadcrumb.Item>
      </Breadcrumb>
    );

    let backgroundColor = [];
    for(let i=0;i<this.state.interviews.length;i++){
      backgroundColor.push('rgb(134, 188, 235)');
    }

    const bardata = {
      labels: this.state.interviews.map(interview => {return interview.candidate.name}),
      datasets: [
        {
          backgroundColor,
          data: this.state.interviews.map(interview => {return interview.totalGrade})
        }
      ]
    };

    let tableContent = this.state.interviews.map(interview => {
      return (
        <Table.Row onClick={()=>{this.props.history.push('/position/'+interview.position._id+'/interview/'+interview._id+'/statistics')}}>
          <Table.Cell width='3'><Header style={{marginLeft:'10px'}}>{interview.candidate.name}</Header></Table.Cell>
          <Table.Cell width='1'><Statistic value={interview.totalGrade} suffix={'/ ' + interview.maxTotalGrade} /></Table.Cell>
        </Table.Row>
      )
    })

    return (
      <PageWrap selected='statistics'>
        <PageHeader
          title={this.state.interviews[0].position.name}
          subTitle='Statistics'
          style={{backgroundColor:'white',marginTop:'5px'}}
          breadcrumbRender = {() => routes}
        >
        </PageHeader>
        <div style={{backgroundColor:'white', padding:'50px', margin:'25px', display:'flex', flexDirection:'row'}}>
          <div style={{width:'65%'}}>
            <Bar
              style={{width:'70%'}}
              type='bar'
              data={bardata}
              options= {{
                legend: {
                  display: false
                },
                responsive: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }}
            />
          </div>
          <div style={{display:'flex', flexDirection:'column', width:'35%', paddingLeft:'40px', alignItems:'center'}}>
            <Header>Interview Statistics</Header>
            <Table selectable basic='very'>
              <Table.Body>
                {tableContent}
              </Table.Body>
            </Table>
          </div>
        </div>
      </PageWrap>
    );
  }
}

export default PositionStat;