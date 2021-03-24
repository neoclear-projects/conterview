import React from 'react';
import './terminal.css';

export class Terminal extends React.Component {
  constructor(props) {
    super(props);
    this.xterm = React.createRef(null);
  }

  render() {
    return (
      <div
        id='terminal'
        style={{
          height: 'calc(100vh - 120px)',
          fontSize: this.props.fontSize - 4,
          backgroundColor: this.props.colorMode ? '#222' : 'white',
          color: this.props.colorMode ? '#ddd' : 'black',
          fontWeight: this.props.bold ? 'bold' : 'normal'
        }}
      >
        {this.props.text}
      </div>
    );
  }
};
