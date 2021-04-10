import React from 'react';
import { Button, Modal, Form } from 'semantic-ui-react';
import { createPosition, updatePosition } from '../../api/position-api';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';

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
    this.setState({nameExistErr: undefined});
    if(this.props.position){
      updatePosition(this.props.match.params.positionId, name, description,
        req => {
          this.props.onSubmit();   
          message.info('Position updated successfully');
        }, 
        err => {
          if(err.response.data === 'Position with this name already exists') this.setState({nameExistErr: 'Position with this name already exists'});
        }
      );
    }else{
      createPosition(name, description, 
        req => {
          this.props.onSubmit();   
          message.info('Position created successfully');
        }, 
        err => {
          if(err.response.data === 'Position with this name already exists') this.setState({nameExistErr: 'Position with this name already exists'});
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
        <Modal.Header>{this.props.position ? 'Edit Position' : 'Create Position'}</Modal.Header>
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
                error={this.state.nameExistErr}
                required
              />
              <Form.TextArea
                name='description'
                label='Position Description'
                value={this.state.description}
                rows='10'
                onChange={this.handleInputChange}
                required
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='green' form='create-pos-form'>
              {this.props.position ? 'Edit Position' : 'Create Position'}
            </Button>
          </Modal.Actions>
      </Modal>
    );
  }
}

export default withRouter(CreateEditPosition);
