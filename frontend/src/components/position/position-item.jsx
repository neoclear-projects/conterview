import React from 'react';
import { Button, Table, Header } from 'semantic-ui-react';
import PageWrap from '../header/page-wrap';
import { Descriptions, Divider, PageHeader, Breadcrumb, Result } from 'antd';
import './position.css';
import CreateInterview from '../interview/create-interview';
import { getInterviews } from '../../api/interview-api';
import { getPosition, deletePosition } from '../../api/position-api';
import { Link } from 'react-router-dom';
import CreateEditPosition from './create-edit-position';
import { toLocalTimeString } from '../../util/time';

class PositionItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      createIntModal:false, 
      editPosModal:false,
      interviews:[],
      position:{},
      loading:true,
      notFound:false,
    };
    getPosition(this.props.match.params.positionId, '', 
      res => {
        this.state.position = res.data;
        getInterviews(this.props.match.params.positionId, '', '', res => {
          this.state.interviews = res.data;
          this.setState({loading:false});
        });
      },
      err => {
        if(err.response.status === 404) this.setState({notFound:true});
      }
    );
  }

  fetchData = () => {
    getPosition(this.props.match.params.positionId, '', res => {
      this.state.position = res.data;
      getInterviews(this.props.match.params.positionId, '', '', res => {
        this.setState({interviews: res.data});
      });
    });
  };

  setCreateIntModal = (open) => this.setState({createIntModal: open});

  setEditPosModal = (open) => this.setState({editPosModal: open});

  render() {   
    if(this.state.notFound) return (<PageWrap selected='position'><Result status="404" title="Position not found" subTitle="This position might have been deleted"/></PageWrap>);
    if(this.state.loading) return (<PageWrap selected='position' loading></PageWrap>);

    let interviews = this.state.interviews.map((interview) => {
      return (
        <Table.Row>
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
            <Button color='blue' onClick={() => this.props.history.push(`/position/${this.props.match.params.positionId}/statistics`)}>Statistics</Button>,
            <Button color='blue' onClick={() => this.setEditPosModal(true)}>Edit Position</Button>,
            <Button color='red' onClick={() => deletePosition(this.props.match.params.positionId, res => {this.props.history.push('/position')})}>Delete Position</Button>
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
          onSubmit={() => {
            this.setCreateIntModal(false);
            this.fetchData();
          }}
          positionId={this.props.match.params.positionId}
        >
        </CreateInterview>

        <CreateEditPosition
          open={this.state.editPosModal}
          onClose={() => this.setEditPosModal(false)}
          onSubmit={() => {
            this.setEditPosModal(false);
            this.fetchData();
          }}
          position={this.state.position}
        >
        </CreateEditPosition>
      </PageWrap>
    );
  }
}



export default PositionItem;