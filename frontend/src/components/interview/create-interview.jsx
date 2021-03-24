import React from 'react';
import { Button, Input, Modal, Form, Table } from 'semantic-ui-react';
import PageWrap from '../header/page-wrap';
import PageContent from '../header/page-content';
import { getUsers } from '../../api/user-api';
import { createInterview } from '../../api/interview-api';
import { getPositions } from '../../api/position-api';
import { getProblemSet } from '../../api/problem-set-api';

class CreateInterview extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      createIntCandidateName:'',
      createIntCandidateEmail:'',
      createIntTime:new Date(),
      createIntInterviewerIds:[],
      createIntProblemIds:[],
      interviewerOptions:[],
      problemOptions:[],
    };
    if(props.positionId === undefined){
      this.state.positionId = '';
      this.state.positionOptions = [];
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchData();
  }

  handleInputChange = (e, {name, value}) => this.setState({ [name]: value });

  handleSubmit = () => {
    const { createIntCandidateName, createIntCandidateEmail, createIntTime, createIntInterviewerIds, createIntProblemIds } = this.state;
    let positionId = this.props.positionId === undefined ? this.state.createIntPosition : this.props.positionId;
    createInterview(positionId, createIntCandidateName, createIntCandidateEmail, createIntTime, createIntInterviewerIds, createIntProblemIds, req => {}, err => {
      
    });
  };

  fetchData = () => {
    getUsers('username', res => {
      this.setState({interviewerOptions:res.data.map(user => {
          return {
            key: user.username,
            text: user.username,
            value: user._id
          };
        })
      });
    });
    getProblemSet(res => {
      this.setState({problemOptions:res.data.map(problem => {
          return {
            key: problem.problemName,
            text: problem.problemName,
            value: problem._id
          };
        })
      });
    });
    if(this.props.positionId === undefined){
      getPositions('name', res => {
        this.setState({positionOptions:res.data.map(position => {
            return {
              key: position.name,
              text: position.name,
              value: position._id
            };
          })
        });
      });
    }
  };

  render() {
    return (
      <Modal 
        closeIcon
        onClose={this.props.onClose}
        open={this.props.open}
      >
        <Modal.Header>Create Interview</Modal.Header>
        <Modal.Content>
          <Form 
            className='create-pos-form' 
            onSubmit={this.handleSubmit} 
            id='create-int-form'>
            {
              this.props.positionId !== undefined ?
              undefined :
              <Form.Dropdown
                label='Position'
                fluid
                search
                selection
                name='createIntPosition'
                onChange={this.handleInputChange}
                options={this.state.positionOptions}
                placeholder='Select position'
                required
              >
              </Form.Dropdown>
            }
            <Form.Input
              label='Candidate Name'
              name='createIntCandidateName'
              onChange={this.handleInputChange}
              placeholder='Enter candidate name'
              required
            />
            <Form.Input
              label='Candidate Email'
              name='createIntCandidateEmail'
              onChange={this.handleInputChange}
              placeholder='Enter candidate email'
              required
            />
            <Form.Input
              label='Scheduled Time'
              name='createIntTime'
              onChange={this.handleInputChange}
              placeholder='Enter scheduled time'
              type='datetime-local'
              required
            />
            <Form.Dropdown
              label='Interviewers'
              fluid
              multiple
              search
              selection
              name='createIntInterviewerIds'
              onChange={this.handleInputChange}
              options={this.state.interviewerOptions}
              placeholder='Select interviewers'
              required
            >
            </Form.Dropdown>
            <Form.Dropdown
              label='Problems'
              fluid
              multiple
              search
              selection
              name='createIntProblemIds'
              onChange={this.handleInputChange}
              options={this.state.problemOptions}
              placeholder='Select interview problems'
              required
            >
            </Form.Dropdown>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' form='create-int-form'>
            Create Interview
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default CreateInterview;