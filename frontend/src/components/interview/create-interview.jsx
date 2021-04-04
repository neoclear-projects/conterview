import React from 'react';
import { Button, Modal, Form } from 'semantic-ui-react';
import { getUsers } from '../../api/user-api';
import { createInterview, updateInterview } from '../../api/interview-api';
import { getPositions } from '../../api/position-api';
import { getProblemSet } from '../../api/problem-set-api';
import { toLocalTimeISOString } from '../../util/time';

class CreateInterview extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      interviewerOptions:[],
      problemOptions:[],
    };
    if(props.positionId === undefined){
      this.state.positionId = '';
      this.state.positionOptions = [];
    }
    if(props.interview && props.interview.candidateName){
      this.setStateInterviewByProp();
      this.lastInterview = props.interview;
    }else{
      this.state.candidateName = '';
      this.state.candidateEmail = '';
      this.state.scheduledTime = toLocalTimeISOString(new Date().toISOString());
      this.state.scheduledLength = 0;
      this.state.interviewerIds = [];
      this.state.problemIds = [];
    }
    this.fetchData();
  }

  setStateInterviewByProp(){
    this.state.candidateName = this.props.interview.candidate.name;
    this.state.candidateEmail = this.props.interview.candidate.email;
    this.state.scheduledTime = toLocalTimeISOString(this.props.interview.scheduledTime);
    this.state.scheduledLength = this.props.interview.scheduledLength;
    this.state.interviewerIds = this.props.interview.interviewers.map(interviewer => {return interviewer._id});
    this.state.problemIds = this.props.interview.problems.map(problem => {return problem._id});
  }

  handleInputChange = (e, {name, value}) => this.setState({ [name]: value });

  handleSubmit = () => {
    const { candidateName, candidateEmail, scheduledTime, interviewerIds, problemIds, scheduledLength } = this.state;
    let scheduledTimeUTC = new Date(scheduledTime).toISOString();
    if(this.props.interview){
      updateInterview(this.props.interview.position._id, this.props.interview._id, candidateName, candidateEmail, scheduledTimeUTC, scheduledLength, interviewerIds, problemIds, 
        req => {
          this.props.onSubmit();              
        },
        err => {
        }
      );
    }else{
      let positionId = this.props.positionId === undefined ? this.state.positionId : this.props.positionId;
      createInterview(positionId, candidateName, candidateEmail, scheduledTimeUTC, scheduledLength, interviewerIds, problemIds, 
        req => {
          this.props.onSubmit();              
        }, 
        err => {

        }
      );
    }
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
      getPositions('name', 0, '', res => {
        this.setState({positionOptions:res.data.positions.map(position => {
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
    if(JSON.stringify(this.lastInterview) !== JSON.stringify(this.props.interview)){
      this.setStateInterviewByProp();
      this.lastInterview = this.props.interview;
    }
    
    return (
      <Modal 
        closeIcon
        onClose={this.props.onClose}
        open={this.props.open}
      >
        <Modal.Header>{this.props.interview ? 'Edit Interview' : 'Create Interview'}</Modal.Header>
        <Modal.Content>
          <Form 
            className='create-pos-form' 
            onSubmit={this.handleSubmit} 
            id='create-int-form'>
            {
              this.props.positionId || this.props.interview ?
              undefined :
              <Form.Dropdown
                label='Position'
                fluid
                search
                selection
                name='positionId'
                value={this.state.positionId}
                onChange={this.handleInputChange}
                options={this.state.positionOptions}
                placeholder='Select position'
                required
              >
              </Form.Dropdown>
            }
            <Form.Input
              label='Candidate Name'
              name='candidateName'
              onChange={this.handleInputChange}
              value={this.state.candidateName}
              placeholder='Enter candidate name'
              required
            />
            <Form.Input
              label='Candidate Email'
              name='candidateEmail'
              type='email'
              onChange={this.handleInputChange}
              value={this.state.candidateEmail}
              placeholder='Enter candidate email'
              required
            />
            <Form.Input
              label='Scheduled Time'
              name='scheduledTime'
              onChange={this.handleInputChange}
              value={this.state.scheduledTime}
              placeholder='Enter scheduled time'
              type='datetime-local'
              required
            />
            <Form.Input
              label='Length (minutes)'
              name='scheduledLength'
              type='number'
              onChange={this.handleInputChange}
              value={this.state.scheduledLength}
              placeholder='Enter interview length'
              required
            />
            <Form.Dropdown
              label='Interviewers'
              fluid
              multiple
              search
              selection
              name='interviewerIds'
              value={this.state.interviewerIds}
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
              name='problemIds'
              value={this.state.problemIds}
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
            {this.props.interview ? 'Edit Interview' : 'Create Interview'}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default CreateInterview;