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
      nameExistErr:undefined,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange = (e, {name, value}) => this.setState({ [name]: value });

  nameExistErr = 'Organization name already exists';

  handleSubmit = () => {
    const { name } = this.state;
    this.setState({nameExistErr: undefined});
    registerOrganization(name, req => this.props.history.push("/register"), err =>{
      if(err.response.status === 409) this.setState({nameExistErr: this.nameExistErr});
    });
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
