import React from 'react';
import { Button, Modal, Form } from 'semantic-ui-react';
import { getUsers } from '../../api/user-api';
import { createInterview, updateInterview } from '../../api/interview-api';
import { getPositions } from '../../api/position-api';
import { getProblemSet } from '../../api/problem-set-api';
import { toLocalTimeISOString } from '../../util/time';
import { message } from 'antd';

class CreateInterview extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      interviewerOptions:[],
      problemOptions:[],
      problemsNoResult:'Search for problems',
      interviewsNoResult:'Search for interviews',
    };
    if(props.positionId === undefined){
      this.state.positionNoResult = 'Search for position';
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
      this.state.interviewerIdsSelected = [];
      this.state.problemIdsSelected = [];
      this.state.problemsDic = {};
      this.state.interviewersDic = {};
    }
  }

  setStateInterviewByProp(){
    this.state.candidateName = this.props.interview.candidate.name;
    this.state.candidateEmail = this.props.interview.candidate.email;
    this.state.scheduledTime = toLocalTimeISOString(this.props.interview.scheduledTime);
    this.state.scheduledLength = this.props.interview.scheduledLength;
    this.state.interviewerIds = this.props.interview.interviewers.map(interviewer => {return interviewer._id});
    this.state.problemIds = this.props.interview.problems.map(problem => {return problem._id});
    let problemsSelected = this.props.interview.problems.map(problem => {
      return {
        key: problem.problemName,
        text: problem.problemName,
        value: problem._id
      };
    });
    this.state.problemIdsSelected = problemsSelected;
    problemsSelected.forEach(problem => {
      this.state.problemsDic[problem.value] = problem;
    })
    let interviewersSelected = this.props.interview.interviewers.map(interviewer => {
      return {
        key: interviewer.username,
        text: interviewer.username,
        value: interviewer._id
      };
    });
    this.state.interviewerIdsSelected = interviewersSelected;
    interviewersSelected.forEach(interviewer => {
      this.state.interviewersDic[interviewer.value] = interviewer;
    })
  }

  handleInputChange = (e, {name, value}) => this.setState({ [name]: value });

  handleProblemsSelectionChange = (e, {value}) => {
    this.setState({ problemIds: value, problemOptions:[], problemsNoResult:'Search for problems', problemIdsSelected: value.map(problemId => {
      return this.state.problemsDic[problemId];
    })});
  }

  handleInterviewersSelectionChange = (e, {value}) => {
    this.setState({ interviewerIds: value, interviewerOptions:[], interviewsNoResult:'Search for interviewers', interviewerIdsSelected: value.map(interviewerId => {
      return this.state.interviewersDic[interviewerId];
    })});
  }

  handlePositionSearch = (e, {searchQuery}) => {
    if(searchQuery){
      getPositions({fields:'name', nameContains:searchQuery}, res => {
        this.setState({positionNoResult:'No position found', positionOptions:res.data.positions.map(position => {
            return {
              key: position.name,
              text: position.name,
              value: position._id
            };
          })
        });
      });
    }else{
      this.setState({positionOptions:[], positionNoResult:'Search for position'});
    }
  }

  handleProblemsSearch = (e, {searchQuery}) => {
    if(searchQuery){
      getProblemSet(searchQuery, 1, res => {
        let options = res.data.map(problem => {
          return {
            key: problem.problemName,
            text: problem.problemName,
            value: problem._id
          };
        });
        options.forEach(option => {
          this.state.problemsDic[option.value] = option;
        });
        this.setState({problemOptions:options, problemsNoResult:'No problems found'});
      });
    }else{
      this.setState({problemOptions:[], problemsNoResult:'Search for problems'});
    }
  }

  handleInterviewersSearch = (e, {searchQuery}) => {
    if(searchQuery){
      getUsers('username', 1, searchQuery, res => {
        let options = res.data.map(user => {
          return {
            key: user.username,
            text: user.username,
            value: user._id
          };
        });
        options.forEach(option => {
          this.state.interviewersDic[option.value] = option;
        });
        this.setState({interviewerOptions:options, interviewsNoResult:'No interviewers found'});
      });
    }else{
      this.setState({interviewerOptions:[], interviewsNoResult:'Search for interviewers'});
    }
  }

  handleSubmit = () => {
    const { candidateName, candidateEmail, scheduledTime, interviewerIds, problemIds, scheduledLength } = this.state;
    let scheduledTimeUTC = new Date(scheduledTime).toISOString();
    this.setState({ emailFormatErr: undefined, lengthNotPositiveErr: undefined, interviewerIdsEmptyErr: undefined, problemIdsEmptyErr: undefined });
    let valid = true;
    if(interviewerIds.length === 0){
      this.setState({ interviewerIdsEmptyErr: 'Interviewers cannot be empty' });
      valid = false;
    }
    if(problemIds.length === 0){
      this.setState({ problemIdsEmptyErr: 'Problems cannot be empty' });
      valid = false;
    }
    if(valid){
      if(this.props.interview){
        updateInterview(this.props.interview.position._id, this.props.interview._id, candidateName, candidateEmail, scheduledTimeUTC, scheduledLength, interviewerIds, problemIds, 
          req => {
            this.props.onSubmit();      
            message.info('Interview updated successfully');        
          },
          err => {
            if(err.response.data === 'candidate email should be email formatted') this.setState({ emailFormatErr: 'Invalid email address' });
            if(err.response.data === 'scheduledLength should be positive integer') this.setState({ lengthNotPositiveErr: 'Scheduled length should be positive integer' });
          }
        );
      }else{
        let positionId = this.props.positionId === undefined ? this.state.positionId : this.props.positionId;
        createInterview(positionId, candidateName, candidateEmail, scheduledTimeUTC, scheduledLength, interviewerIds, problemIds, 
          req => {
            this.props.onSubmit();    
            message.info('Interview created successfully');             
          }, 
          err => {
            if(err.response.data === 'candidate email is needed and should be email formatted') this.setState({ emailFormatErr: 'Invalid email address' });
            if(err.response.data === 'scheduledLength is needed and should be positive integer') this.setState({ lengthNotPositiveErr: 'Scheduled length should be positive integer' });
          }
        );
      }
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
                onSearchChange={this.handlePositionSearch}
                options={this.state.positionOptions}
                placeholder='Select position'
                noResultsMessage={this.state.positionNoResult}
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
              onChange={this.handleInputChange}
              value={this.state.candidateEmail}
              placeholder='Enter candidate email'
              error={this.state.emailFormatErr}
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
              error={this.state.lengthNotPositiveErr}
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
              onChange={this.handleInterviewersSelectionChange}
              options={this.state.interviewerOptions.concat(this.state.interviewerIdsSelected)}
              placeholder='Select interviewers'
              error={this.state.interviewerIdsEmptyErr}
              onSearchChange={this.handleInterviewersSearch}
              noResultsMessage={this.state.interviewsNoResult}
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
              onChange={this.handleProblemsSelectionChange}
              options={this.state.problemOptions.concat(this.state.problemIdsSelected)}
              placeholder='Select interview problems'
              error={this.state.problemIdsEmptyErr}
              onSearchChange={this.handleProblemsSearch}
              noResultsMessage={this.state.problemsNoResult}
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