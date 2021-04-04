import React from 'react';
import PageWrap from '../header/page-wrap';
import { getInterviews } from '../../api/interview-api';
import { Bar } from 'react-chartjs-2';
import { PageHeader, Breadcrumb } from 'antd';
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

  dynamicColors = function() {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      return "rgb(" + r + "," + g + "," + b + ")";
  };

  render() {
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
          <Link to={`/position/${this.props.match.params.positionId}`}>{this.state.interviews[0].position.name}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          Statistics
        </Breadcrumb.Item>
      </Breadcrumb>
    );

    let backgroundColor = [];
    for(let i=0;i<this.state.interviews.length;i++){
      backgroundColor.push(this.dynamicColors());
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
        <Table.Row>
          <Table.Cell>{interview.candidate.name}</Table.Cell>
          <Table.Cell>{interview.totalGrade}</Table.Cell>
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
          <div style={{width:'70%'}}>
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
          <div style={{display:'flex', flexDirection:'column', width:'30%', padding:'20px', alignItems:'center'}}>
            <Header>Total Grades of Candidates</Header>
            <Table striped basic='very'>
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