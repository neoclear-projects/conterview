import React from 'react';
import { Button, Input, Modal, Form, Table } from 'semantic-ui-react';
import PageWrap from '../header/page-wrap';
import PageContent from '../header/page-content';
import { createPosition, getPositions } from '../../api/position-api';

class CreateEditPosition extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      createPositionName:'', 
      createPositionDescription:'',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange = (e, {name, value}) => this.setState({ [name]: value });

  handleSubmit = () => {
    const { createPositionName, createPositionDescription } = this.state;
    createPosition(createPositionName, createPositionDescription, 
      req => {
        this.props.onCreate();   
      }, err => {
      
    });
  };

  render() {
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
    );
  }
}

export default CreateEditPosition;
