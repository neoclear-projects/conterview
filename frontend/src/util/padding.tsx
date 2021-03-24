import React from 'react';

export interface StrictPaddingProps {
  height?: number;
  width?: number;
};

class Padding extends React.Component<StrictPaddingProps> {
  render() {
    return (
      <div style={{height: this.props.height || 0, width: this.props.width || 0}} />
    );
  }
};

export default Padding;
