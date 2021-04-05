import React from 'react';
import { Button, Table, Pagination, Header, Input } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PageWrap from '../header/page-wrap';
import CreateInterview from './create-interview';
import './interview.css';
import { getInterviewsAllPosition } from '../../api/interview-api';
import { PageHeader, Breadcrumb, Space } from 'antd';
import { toLocalTimeString } from '../../util/time';

class Interview extends React.Component {
  constructor(){
    super();
    this.state = {
      createIntModal:false, 
      interviews:[],
      totalPage:1,
      page:1,
      positionContains:'',
      candidateContains:'',
    };
    this.fetchData();
  }
  
  handleInputChange = (e, {name, value}) => this.setState({ [name]: value });

  fetchData = () => {
    const { page, positionContains, candidateContains } = this.state;
    getInterviewsAllPosition({ page, positionContains, candidateContains }, res => {
      this.setState({totalPage: res.data.totalPage, interviews: res.data.interviews});
    });
  };

  onSearch = (e) => {
    this.state.page = 1;
    this.fetchData();
  };

  onClear = () => {
    this.state.page = 1;
    this.state.positionContains = '';
    this.state.candidateContains = '';
    this.fetchData();
  }

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
          <Table.Cell>{toLocalTimeString(interview.scheduledTime)}</Table.Cell>
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
        <div style={{backgroundColor:'white', padding:'20px', margin:'25px', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
          <Space>
            <Header>Position:</Header>
            <Input 
              name='positionContains'
              value={this.state.positionContains}
              onChange={this.handleInputChange}
              placeholder='Search by position'
            />
          </Space>
          <Space>
            <Header>Candidate:</Header>
            <Input 
              name='candidateContains'
              value={this.state.candidateContains}
              onChange={this.handleInputChange}
              placeholder='Search by candidate'
            />
          </Space>
          <Space>
            <Button color='white' onClick={this.onClear}>Clear</Button>
            <Button color='blue' onClick={this.onSearch}>Search</Button>
          </Space>
        </div>
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
