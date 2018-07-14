import React, { Component } from "react";
import PropTypes from "prop-types";
import Field from "./Field";

class Textarea extends Component {
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

  getValue = e => e.target.value;

  getProps = () => {
    const { name, context } = this.props;
    const binding = name in context.binding;

    return {
      ...(binding ? { value: context.binding[name] } : null),

      onChange: e => {
        const value = this.getValue(e);
        this.setState(
          {
            didchanged: true
          },
          () => {
            context.onFieldChange({ name, value });
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
        if (this.didChanged()) {
          context.onFieldDidChanged({ name, value });
        }
      }
    };
  };

  render() {
    return <textarea {...this.props} {...this.getProps()} />;
  }
}

export default class extends Component {
  render() {
    return (
      <Field
        render={contextValue => (
          <Textarea context={contextValue} {...this.props} />
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
