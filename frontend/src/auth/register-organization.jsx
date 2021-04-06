import React from 'react';
import { Form, Image } from 'semantic-ui-react';
import { registerOrganization } from '../api/organization-api';
import './auth.css';
import logo from '../static/images/logo.jpg';

class RegisterOrganization extends React.Component {
  constructor(){
    super();
    this.state = { 
      name:"", 
      passcode:"",
      passcodeConfirm:"",
      nameExistErr:undefined,
      passcodeMatchErr:undefined,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange = (e, {name, value}) => this.setState({ [name]: value });

  nameExistErr = 'Organization name already exists';
  passcodeMatchErr = 'Please enter the same passcode';

  handleSubmit = () => {
    const { name, passcode, passcodeConfirm } = this.state;
    let valid = true;
    this.setState({nameExistErr: undefined, passcodeMatchErr: undefined});
    if(passcode !== passcodeConfirm){
      this.setState({passcodeMatchErr: this.passcodeMatchErr});
      valid = false;
    }
    if(valid){
      registerOrganization(name, passcode, req => this.props.history.push("/register"), err =>{
        if(err.response.status === 409) this.setState({nameExistErr: this.nameExistErr});
      });
    }
  };

  render() {
    return (
      <div className='auth-page'>
        <Image src={logo} horizontal size='medium'/>
        <Form className='auth-form' onSubmit={this.handleSubmit} >
          <Form.Input
            icon='building'
            iconPosition='left'
            label='Organization name'
            placeholder='Enter your organization name'
            name='name'
            onChange = {this.handleInputChange}
            error={this.state.nameExistErr}
            required
          />
          <Form.Input
            icon='lock'
            iconPosition='left'
            type='password'
            label='Passcode'
            name='passcode'
            onChange = {this.handleInputChange}
            required
          />
          <Form.Input
            icon='lock'
            iconPosition='left'
            type='password'
            label='Passcode Confirmation'
            name='passcodeConfirm'
            onChange = {this.handleInputChange}
            error={this.state.passcodeMatchErr}
            required
          />
          <Form.Button
            fluid
            type='submit'
            color='facebook'
          >Register</Form.Button>
        </Form>
      </div>
    );
  }
}

export default RegisterOrganization;
