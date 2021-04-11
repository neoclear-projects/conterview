import React from 'react';
import { Form, Button, Message, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { login } from '../api/auth-api';
import logo from '../static/images/logo.jpg';
import './auth.css';

class Login extends React.Component {
  constructor(){
    super();
    this.state = { username:"", password:"", error:false};
  } 

  handleInputChange = (e, {name, value}) => this.setState({ [name]: value });

  handleSubmit = () => {
    const { username, password } = this.state;
    login(username, password, req => this.props.history.push("/"), err => {
      if(err.response.status === 401) this.setState({error: true});
    });
  };

  render() {
    return (
      <div className='auth-page'>
        <Image src={logo} horizontal size='medium'/>
        <Form className='auth-form' onSubmit={this.handleSubmit} error={this.state.error}>
          <Form.Input
            icon='user'
            iconPosition='left'
            label='Username'
            name='username'
            onChange={this.handleInputChange}
            placeholder='Enter your username'
            required
          />
          <Form.Input
            icon='lock'
            iconPosition='left'
            name='password'
            label='Password'
            onChange={this.handleInputChange}
            type='password'
            required
          />
          <Form.Button
            fluid
            type='submit'
            color='facebook'
          >Login</Form.Button>
          <Form.Field>
            <Link to='/register'>
              <Button
                fluid
              >Register</Button>
            </Link>
          </Form.Field>
          <Message
            error
            header='Access denied'
            content='Your username or password is incorrect'
          />
        </Form>
      </div>
    );
  }
}

export default Login;
