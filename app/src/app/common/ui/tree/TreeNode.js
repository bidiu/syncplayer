import React, { Component } from 'react';

import './TreeNode.css';

class TreeNode extends Component {
  constructor(props) {
    super(props);
    this.onTitleClicked = this.onTitleClicked.bind(this);
    this.state = { expanded: false };
  }

  onTitleClicked(e) {
    this.setState((prevState, props) => ({
      expanded: !prevState.expanded
    }));

    let customHandler = this.props.onClick;
    if (customHandler) {
      customHandler(this.props.root);
    }
  }

  render() {
    let root = this.props.root;
    let title = this.props.extractTitle(root);
    let children = this.props.extractChildren(root);
    let expanded = this.state.expanded;
    let nestLevel = this.props.nestLevel || 0;

    return (
      <div className="TreeNode">
        <div className={`TreeNode-title TreeNode-nest-${nestLevel}`}
          onClick={this.onTitleClicked}>
          {children && 
            <i className={
              `TreeNode-title-arrow material-icons md-18 ${expanded ? 'TreeNode-expanded' : ''}`
              }>
              chevron_right
            </i>
          }
          <div className="TreeNode-title-text">{title}</div>
        </div>
        {children && expanded && (
          <div className="TreeNode-children-container">
            {children.map(child => (
              <TreeNode key={this.props.genKey(child)}
                root={child}
                genKey={this.props.genKey}
                extractTitle={this.props.extractTitle}
                extractChildren={this.props.extractChildren}
                nestLevel={nestLevel + 1}
                onClick={this.props.onClick} />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default TreeNode;
