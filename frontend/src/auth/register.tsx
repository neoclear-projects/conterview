import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Image, Modal } from 'semantic-ui-react';
import { register } from '../api/auth-api';
import './auth.css';
import logo from '../static/images/logo.jpg';
import TermPage from '../doc/term-page';

class Register extends React.Component {
  constructor(){
    super();
    this.state = { 
      organization:"",
      username:"", 
      password:"", 
      passwordConfirm:"", 
      email:"", 
      terms:false, 
      organizationNotExistErr:undefined,
      passwordMatchErr:undefined, 
      usernameExistErr:undefined, 
      termsNotAgreedErr:undefined,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleCheckboxChange = (e, {name}) => this.setState({[name]: this.state[name]?false:true});

  handleInputChange = (e, {name, value}) => this.setState({ [name]: value });

  organizationNotExistErr = 'Organization does not exist';
  passwordMatchErr = 'Please enter the same password';
  usernameExistErr = 'Username already exists';
  termsNotAgreedErr ='Please agree the terms and conditions';

  handleSubmit = () => {
    const { organization, username, password, passwordConfirm, email, terms } = this.state;
    let valid = true;
    this.setState({passwordMatchErr: undefined});
    this.setState({termsNotAgreedErr: undefined});
    this.setState({usernameExistErr: undefined});
    this.setState({organizationNotExistErr: undefined});
    if(password !== passwordConfirm){
      this.setState({passwordMatchErr: this.passwordMatchErr});
      valid = false;
    }
    if(!terms){
      this.setState({termsNotAgreedErr: this.termsNotAgreedErr});
      valid = false;
    }
    if(valid){
      register(organization, username, password, email, req => this.props.history.push("/"), err =>{
        if(err.response.status === 409) this.setState({usernameExistErr: this.usernameExistErr});
        if(err.response.status === 404) this.setState({organizationNotExistErr: this.organizationNotExistErr});
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
            label='Organization'
            placeholder='Enter your organization'
            name='organization'
            onChange = {this.handleInputChange}
            error={this.state.organizationNotExistErr}
            required
          />
          <Form.Input
            icon='user'
            iconPosition='left'
            label='Username'
            placeholder='Enter your username'
            name='username'
            onChange = {this.handleInputChange}
            error={this.state.usernameExistErr}
            required
          />
          <Form.Input
            icon='lock'
            iconPosition='left'
            label='Password'
            type='password'
            name='password'
            onChange = {this.handleInputChange}
            required
          />
          <Form.Input
            icon='lock'
            iconPosition='left'
            label='Password Confirmation'
            type='password'
            name='passwordConfirm'
            onChange = {this.handleInputChange}
            error={this.state.passwordMatchErr}
            required
          />
          <Form.Input
            icon='mail'
            iconPosition='left'
            label='Email Address'
            placeholder='Enter your email address'
            type='email'
            name='email'
            onChange = {this.handleInputChange}
            required
          />
          <Form.Checkbox
            label='I agree to the Terms and Conditions'
            name='terms'
            onChange = {this.handleCheckboxChange}
            error={this.state.termsNotAgreedErr}
            required
          />
          <Form.Button
            fluid
            type='submit'
            color='facebook'
          >Register</Form.Button>
          <Form.Field>
            <Link to='/register-organization'>
              <Button
                fluid
              >Register Organization</Button>
            </Link>
          </Form.Field>
          <Modal
            closeIcon
            trigger={<div className='clickable'>Terms and Conditions</div>}
          >
            <Modal.Header>Terms and Conditions</Modal.Header>
            <Modal.Content>
              <TermPage />
            </Modal.Content>
          </Modal>
        </Form>
      </div>
    );
  }
}

export default Register;
