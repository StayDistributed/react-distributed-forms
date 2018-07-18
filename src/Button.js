import React, { Component } from "react";
import PropTypes from "prop-types";
import Field from "./Field";

class Button extends Component {
  state = {};

  getProps = () => {
    const { name, value, context } = this.props;

    return {
      onClick: e => {
        if (this.props.onClick) {
          this.props.onClick(e);
        }
        context.onSubmit({ name, value });
      },
      onFocus: e => {
        if (this.props.onFocus) {
          this.props.onFocus(e);
        }
        context.onFieldFocus({ name, value });
      },
      onBlur: e => {
        if (this.props.onBlur) {
          this.props.onBlur(e);
        }
        context.onFieldBlur({ name, value });
      }
    };
  };

  render() {
    return <button {...this.props} {...this.getProps()} />;
  }
}

export default class extends Component {
  render() {
    return (
      <Field
        render={contextValue => (
          <Button context={contextValue} {...this.props} />
        )}
      />
    );
  }

  static propTypes = {
    name: PropTypes.string
  };

  static defaultProps = {
    name: "submit"
  };
}
