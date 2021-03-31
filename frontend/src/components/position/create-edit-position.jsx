import React from 'react';
import { Button, Input, Modal, Form, Table } from 'semantic-ui-react';
import PageWrap from '../header/page-wrap';
import { createPosition, updatePosition, getPositions } from '../../api/position-api';
import { withRouter } from 'react-router-dom';

class CreateEditPosition extends React.Component {
  constructor(props){
    super(props);
    this.state={};
    if(props.position){
      this.setStatePositionByProp();
      this.lastPosition = props.position;
    }else{
      this.state.name = '';
      this.state.description='';
    }
  }

  setStatePositionByProp(){
    this.state.name = this.props.position.name;
    this.state.description = this.props.position.description;
  }

  handleInputChange = (e, {name, value}) => this.setState({ [name]: value });

  handleSubmit = () => {
    const { name, description } = this.state;
    if(this.props.position){
      updatePosition(this.props.match.params.positionId, name, description,
        req => {
          this.props.onSubmit();   
        }, 
        err => {
        }
      );
    }else{
      createPosition(name, description, 
        req => {
          this.props.onSubmit();   
        }, 
        err => {
        }
      );
    }
  };

  render() {
    if(JSON.stringify(this.lastPosition) !== JSON.stringify(this.props.position)){
      this.setStatePositionByProp();
      this.lastPosition = this.props.position;
    }

    return (
      <Modal 
        closeIcon
        onClose={this.props.onClose}
        open={this.props.open}
      >
        <Modal.Header>Create position</Modal.Header>
          <Modal.Content>
            <Form 
              className='create-pos-form' 
              onSubmit={this.handleSubmit} 
              id='create-pos-form'>
              <Form.Input
                label='Position Name'
                name='name'
                onChange={this.handleInputChange}
                value={this.state.name}
                placeholder='Enter position name'
                required
              />
              <Form.TextArea
                name='description'
                label='Position Description'
                value={this.state.description}
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
    );
  }
}

export default withRouter(CreateEditPosition);
