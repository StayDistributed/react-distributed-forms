import React, { Component } from "react";
import PropTypes from "prop-types";
import Field from "./Field";

class Input extends Component {
  state = {
    didchanged: false
  };

  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.value) {
      return {
        value: state.value
      };
    }

    return null;
  }

  didChanged() {
    return this.state.didchanged;
  }

  getValue = e =>
    this.props.type === "checkbox" || this.props.type === "radio"
      ? e.target.checked
        ? e.target.value
        : ""
      : e.target.value;

  didChangedOnChange = () =>
    this.props.type === "checkbox" ||
    this.props.type === "radio" ||
    this.props.type === "select";

  didChangedOnBlur = () => !this.didChangedOnChange();

  getProps = () => {
    const { name, type, value, context } = this.props;
    const { values, setValues, initValues } = context || {};
    const hasValue = values && name in values;

    return {
      ...(initValues
        ? type === "checkbox"
          ? { checked: value || false }
          : type === "radio"
            ? { checked: false }
            : { value: value || "" }
        : null),

      ...(hasValue
        ? type === "checkbox"
          ? { checked: values[name] ? true : false }
          : type === "radio"
            ? { checked: values[name] === value ? true : false }
            : { value: values[name] }
        : null),

      onChange: e => {
        const value = this.getValue(e);
        this.setState(
          {
            didchanged: true
          },
          () => {
            if (setValues) {
              setValues({ [name]: value });
            }

            context.onFieldChange({ name, value });

            if (this.didChanged() && this.didChangedOnChange()) {
              context.onFieldDidChanged({ name, value });
            }
          }
        );
      },
      onFocus: e => {
        const value = this.getValue(e);
        this.setState(
          {
            didchanged: false
          },
          () => {
            context.onFieldFocus({ name, value });
          }
        );
      },
      onBlur: e => {
        const value = this.getValue(e);
        context.onFieldBlur({ name, value });
        if (this.didChanged() && this.didChangedOnBlur()) {
          context.onFieldDidChanged({ name, value });
        }
      }
    };
  };

  render() {
    return <input {...this.props} {...this.getProps()} />;
  }
}

export default class extends Component {
  render() {
    return (
      <Field
        render={contextValue => (
          <Input context={contextValue} {...this.props} />
        )}
      />
    );
  }

  static propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool
    ])
  };

  static defaultProps = {
    name: "",
    type: "text"
  };
}
