import React, { Component } from "react";
import PropTypes from "prop-types";
import Field from "./Field";

class Select extends Component {
  state = {};

  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.value) {
      return {
        value: state.value
      };
    }

    return null;
  }

  getValue = e => e.target.value;

  getProps = () => {
    const { name, context } = this.props;
    const binding = name in context.binding;

    return {
      ...(binding ? { value: context.binding[name] } : null),

      onChange: e => {
        const value = this.getValue(e);
        context.onFieldChange(name, value);
        context.onFieldDidChanged(name, value);
      },
      onFocus: e => {
        const value = this.getValue(e);
        context.onFieldFocus(name, value);
      },
      onBlur: e => {
        const value = this.getValue(e);
        context.onFieldBlur(name, value);
      }
    };
  };

  render() {
    return <select {...this.props} {...this.getProps()} />;
  }
}

export default class extends Component {
  render() {
    return (
      <Field
        render={contextValue => (
          <Select context={contextValue} {...this.props} />
        )}
      />
    );
  }

  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool
    ])
  };

  static defaultProps = {
    name: ""
  };
}
