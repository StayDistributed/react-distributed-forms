import React, { Component } from "react";
import PropTypes from "prop-types";
import { Provider, Consumer } from "react-distributed-context";

export default class Field extends Component {
  render() {
    const { render } = this.props;
    return <Consumer>{render}</Consumer>;
  }
}

Field.defaultProps = {
  render: contextValue => (
    <pre>{`You must implement 'render' prop to display Field's content`}</pre>
  )
};

Field.propTypes = {
  render: PropTypes.func
};
