import React from 'react';
import { Button, Input, Modal, Form, Table, Grid, Label, Header, Container, Segment } from 'semantic-ui-react';
import PageWrap from '../header/page-wrap';
import { Card, Descriptions, Divider, PageHeader, Breadcrumb } from 'antd';
import './position.css';
import CreateInterview from '../interview/create-interview';
import { getInterviewsAllPosition } from '../../api/interview-api';
import { getPosition } from '../../api/position-api';
import { Link } from 'react-router-dom';

class PositionItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      createIntModal:false, 
      interviews:[],
      position:{},
    };
    this.setCreateIntModal = this.setCreateIntModal.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.fetchData();
  }

  fetchData = () => {
    getInterviewsAllPosition('', res => {
      this.setState({interviews: res.data});
    });
    getPosition(this.props.match.params.positionId, '', res => {
      this.setState({position: res.data});
    });
  };

  setCreateIntModal = (open) => this.setState({createIntModal: open});

  render() {   
    let interviews = this.state.interviews.map((interview) => {
      return (
        <Table.Row>
          <Table.Cell>{interview.candidate.name}</Table.Cell>
          <Table.Cell>{interview.time}</Table.Cell>
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
          <Link to='/position'>Position</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/position/${this.state.position._id}`}>{this.state.position.name}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
    );

    return (
      <PageWrap selected='position'>
        <PageHeader
          title={this.state.position.name}
          style={{backgroundColor:'white',marginTop:'5px'}}
          extra={[
            <Button color='green' onClick={() => this.setCreateIntModal(true)}>Create Interview</Button>,
          ]}
          breadcrumbRender = {() => routes}
        >
        </PageHeader>
        <div style={{backgroundColor:'white', padding:'50px', margin:'25px'}}>
          <Header>Basic Information</Header>
          <Descriptions>
            <Descriptions.Item label="Name" labelStyle={{fontWeight:'600'}}>{this.state.position.name}</Descriptions.Item>
          </Descriptions>
          <Divider/>
          <Header>Description</Header>
          <Descriptions>
            <p>{this.state.position.description}</p>
          </Descriptions>
          <Divider/>
          <Header>Interviews</Header>
            <Table striped basic='very'>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width='1'>Candidate</Table.HeaderCell>
                  <Table.HeaderCell width='1'>Time</Table.HeaderCell>
                  <Table.HeaderCell width='1'>Status</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {interviews}
              </Table.Body>
            </Table>
        </div>
        <CreateInterview
          open={this.state.createIntModal}
          onClose={() => this.setCreateIntModal(false)}
          positionId={this.props.match.params.positionId}
        >
        </CreateInterview>
      </PageWrap>
    );
  }
}



export default PositionItem;