import React, { Component } from 'react';

import './Textarea.css';

class Textarea extends Component {
  constructor(props) {
    super(props);
    this.state = { focused: false };
  }

  handleFocus = () => {
    this.setState({ focused: true });
  };

  render() {
    let { className, ...props } = this.props;
    let { focused } = this.state;

    return (
      <textarea
        className={`Textarea ${focused ? 'Textarea-focused' : ''} ${className || ''}`} 
        onFocus={this.handleFocus}
        {...props} />
    );
  }
}

export default Textarea;
