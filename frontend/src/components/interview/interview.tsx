import React from 'react';
import { Button, Input, Table, Pagination } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PageWrap from '../header/page-wrap';
import CreateInterview from './create-interview';
import './interview.css';
import { getInterviewsAllPosition } from '../../api/interview-api';
import { PageHeader, Breadcrumb } from 'antd';

class Interview extends React.Component {
  constructor(){
    super();
    this.state = {
      createIntModal:false, 
      interviews:[],
      totalPage:1,
      page:1,
    };
    this.fetchData();
  }
  
  fetchData = () => {
    getInterviewsAllPosition('', this.state.page, res => {
      this.setState({totalPage: res.data.totalPage, interviews: res.data.interviews});
    });
  };

  setCreateIntModal = (open) => this.setState({createIntModal: open});

  onPageChange = (e, pageInfo) => {
    this.state.page = pageInfo.activePage;
  	this.fetchData();
  };

  render() {
    let tableBody = this.state.interviews.map((interview) => {
      return (
        <Table.Row onClick={()=>{this.props.history.push('/position/'+interview.position._id+'/interview/'+interview._id)}}>
          <Table.Cell>{interview.position.name}</Table.Cell>
          <Table.Cell>{interview.candidate.name}</Table.Cell>
          <Table.Cell>{interview.scheduledTime}</Table.Cell>
          <Table.Cell>{interview.status}</Table.Cell>
        </Table.Row>
      );
    });

    const routes = (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to='/'>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to='/interview'>Interview</Link>
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
        <div style={{backgroundColor:'white', padding:'50px', margin:'25px'}}>
          <Table striped basic='very'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width='1'>Position</Table.HeaderCell>
                <Table.HeaderCell width='1'>Candidate</Table.HeaderCell>
                <Table.HeaderCell width='1'>Time</Table.HeaderCell>
                <Table.HeaderCell width='1'>Status</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tableBody}
            </Table.Body>
          </Table>
          <Pagination activePage={this.state.page} onPageChange={this.onPageChange} totalPages={this.state.totalPage} />
        </div>
        <CreateInterview
          open={this.state.createIntModal}
          onClose={() => this.setCreateIntModal(false)}
          onSubmit={() => {
            this.setCreateIntModal(false);
            this.fetchData();
          }}
        >
        </CreateInterview>
      </PageWrap>
    );
  }
}

export default Interview;
