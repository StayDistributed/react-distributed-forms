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

  getValue = e =>
    this.props.multiple
      ? [].slice.call(e.target.selectedOptions).map(o => o.value)
      : e.target.value;

  getProps = () => {
    const { name, value, context, multiple } = this.props;
    const { values, setValues, initValues } = context || {};
    const hasValue = values && name in values;

    return {
      ...(initValues ? { value: value || (multiple ? [] : "") } : null),

      ...(hasValue ? { value: values[name] } : null),

      onChange: e => {
        const value = this.getValue(e);
        if (setValues) {
          setValues({ [name]: value });
        }
        context.onFieldChange({ name, value });
        context.onFieldDidChanged({ name, value });
      },
      onFocus: e => {
        const value = this.getValue(e);
        context.onFieldFocus({ name, value });
      },
      onBlur: e => {
        const value = this.getValue(e);
        context.onFieldBlur({ name, value });
      }
    };
  };

  render() {
    return <select {...this.props} {...this.getProps()} context={null} />;
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
      PropTypes.array,
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool
    ])
  };

  static defaultProps = {
    name: ""
  };
}
