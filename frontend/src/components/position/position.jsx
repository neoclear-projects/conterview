import React from 'react';
import { Button, Input, Modal, Form, Table } from 'semantic-ui-react';
import PageWrap from '../header/page-wrap';
import PageContent from '../header/page-content';
import './position.css';
import { createPosition, getPositions } from '../../api/position-api';
import { Link } from 'react-router-dom';
import { PageHeader, Breadcrumb } from 'antd';

class Position extends React.Component {
  constructor(){
    super();
    this.state = {
      createPosModal:false, 
      createPositionName:'', 
      createPositionDescription:'',
      positions:[],
    };
    this.query = new URLSearchParams(window.location.search);
    this.setCreatePosModal = this.setCreatePosModal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchPositions = this.fetchPositions.bind(this);
    this.fetchPositions();
  }

  fetchPositions = () => {
    getPositions('', res => {
      this.setState({positions: res.data});
    });
  };

  setCreatePosModal = (open) => this.setState({createPosModal: open});

  handleInputChange = (e, {name, value}) => this.setState({ [name]: value });

  handleSubmit = () => {
    const { createPositionName, createPositionDescription } = this.state;
    createPosition(createPositionName, createPositionDescription, req => {}, err => {
      
    });
  };

  render() {   
    let tableBody = this.state.positions.map((position) => {
      return (
        <Table.Row onClick={()=>{this.props.history.push('/position/'+position._id)}}>
          <Table.Cell>{position.name}</Table.Cell>
          <Table.Cell>{position.pendingInterviewNum}</Table.Cell>
          <Table.Cell>{position.finishedInterviewNum}</Table.Cell>
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
      </Breadcrumb>
    );
    
    return (
      <PageWrap selected='position'>
        <PageHeader
          title="Position"
          style={{backgroundColor:'white',marginTop:'5px'}}
          extra={[
            <Button color='green' onClick={() => this.setCreatePosModal(true)}>Create Position</Button>,
          ]}
          breadcrumbRender = {() => routes}
        >
        </PageHeader>
        <div style={{backgroundColor:'white', padding:'50px', margin:'25px'}}>
          <Table striped basic='very'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width='8'>Name</Table.HeaderCell>
                <Table.HeaderCell width='1'>Pending</Table.HeaderCell>
                <Table.HeaderCell width='1'>Finished</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tableBody}
            </Table.Body>
          </Table>
        </div>
        <Modal 
          closeIcon
          onClose={() => this.setCreatePosModal(false)}
          open={this.state.createPosModal}
        >
          <Modal.Header>Create position</Modal.Header>
          <Modal.Content>
            <Form 
              className='create-pos-form' 
              onSubmit={this.handleSubmit} 
              error={this.state.error}
              id='create-pos-form'>
              <Form.Input
                label='Position Name'
                name='createPositionName'
                onChange={this.handleInputChange}
                placeholder='Enter position name'
                required
              />
              <Form.TextArea
                name='createPositionDescription'
                label='Position Description'
                rows='10'
                onChange={this.handleInputChange}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='green' form='create-pos-form'>
              Create Position
            </Button>
          </Modal.Actions>
        </Modal>
      </PageWrap>
    );
  }
}

export default Position;