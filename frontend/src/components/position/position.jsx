import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import PageWrap from '../header/page-wrap';
import PageContent from '../header/page-content';
import './position.css';
import { getPositions } from '../../api/position-api';
import { Link } from 'react-router-dom';
import { PageHeader, Breadcrumb } from 'antd';
import CreateEditPosition from './create-edit-position';

class Position extends React.Component {
  constructor(){
    super();
    this.state = {
      createPosModal:false, 
      positions:[],
    };
    this.setCreatePosModal = this.setCreatePosModal.bind(this);
    this.fetchPositions = this.fetchPositions.bind(this);
    this.fetchPositions();
  }

  fetchPositions = () => {
    getPositions('', res => {
      this.setState({positions: res.data});
    });
  };

  setCreatePosModal = (open) => this.setState({createPosModal: open});

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
        <CreateEditPosition
          open={this.state.createPosModal}
          onClose={() => this.setCreatePosModal(false)}
          onCreate={() => {
            this.setCreatePosModal(false);
            this.fetchPositions();
          }}
        >
        </CreateEditPosition>
      </PageWrap>
    );
  }
}

export default Position;