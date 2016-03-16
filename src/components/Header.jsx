import React from 'react';

let {Component, PropTypes} = React;

export default class Header extends Component {
  static defaultProps = {
    items: []
  };
  static PropTypes = {
    items: PropTypes.array.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
        windowHeight: 0
    };
  }
  render() {
    return (
      <span>{'Hello'}</span>
    );
  }
}
