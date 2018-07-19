import React, { Component } from "react";
import PropTypes from "prop-types";
import Field from "./Field";

class Button extends Component {
  state = {};

  getProps = () => {
    const { name, value, context } = this.props;

    return {
      onClick: e =>
        new Promise((resolve, reject) => {
          /**
           * Call external onClick,
           */
          if (this.props.onClick) {
            this.props.onClick(e);
          }

          context
            .onSubmit({ name, value })
            .then(() => resolve())
            .catch(reject);
        }),

      onFocus: e =>
        new Promise((resolve, reject) => {
          /**
           * Call external onFocus,
           */
          if (this.props.onFocus) {
            this.props.onFocus(e);
          }

          context
            .onFieldFocus({ name, value })
            .then(() => resolve())
            .catch(reject);
        }),

      onBlur: e =>
        new Promise((resolve, reject) => {
          /**
           * Call external onBlur,
           */
          if (this.props.onBlur) {
            this.props.onBlur(e);
          }

          context
            .onFieldBlur({ name, value })
            .then(() => resolve())
            .catch(reject);
        })
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
