import React, { Component } from 'react';
import classNames from 'classnames';

import './PageUrlInput.css';

const placeholder = 'Enter the page URL that contains the video you\'d like to watch';

class PageUrlInput extends Component {
  constructor(props) {
    super(props);
    this.state = { focused: false };
  }

  handleFocus = () => this.setState({ focused: true });

  handleBlur = () => this.setState({ focused: false });

  render() {
    let { onChange, onSubmit, requesting, value } = this.props;
    let { focused } = this.state;
    let formClassname = classNames({ 'PageUrlInput-form-focused': focused });

    return (
      <div className="PageUrlInput">
        <form className={`PageUrlInput-form ${formClassname}`} 
          onSubmit={onSubmit}>

          {/* page url input */}
          <input 
            className="PageUrlInput-url-input" 
            placeholder={placeholder}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={onChange}
            value={value}
            type="url" />

          {/* submit button */}
          <button
            className="PageUrlInput-submit"
            type="submit">
            {requesting ?
              (<i className="fas fa-spinner"></i>) : 
              (<i className="fas fa-arrow-right"></i>)}
          </button>
        </form>

        {/* down arrow hint */}
        <i className="fas fa-chevron-down PageUrlInput-arrow-hint"></i>
      </div>
    );
  }
}

export default PageUrlInput;
