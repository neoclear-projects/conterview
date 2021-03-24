import React from 'react';
import { Container, Header, Message } from 'semantic-ui-react';
import Padding from '../util/padding';

class NotFoundPage extends React.Component {
  render() {
    return (
      <Container text>
        <Padding height={120} />
        <Message>
          <Header as='h1'>Page Not Found</Header>
          <p>
            Please check your url
          </p>
        </Message>
      </Container>
      
    );
  }
}

export default NotFoundPage;
