import React, { Component } from "react";
import PropTypes from "prop-types";
import Field from "./Field";

class Textarea extends Component {
  didchanged = false;

  didChanged() {
    return this.didchanged;
  }

  getValue = e => e.target.value;

  getProps = () => {
    const { name, value, context } = this.props;
    const { values, setValues, initValues } = context || {};
    const hasValue = values && name in values;

    return {
      ...(initValues ? { value: value || "" } : null),

      ...(hasValue ? { value: values[name] } : null),

      onChange: e =>
        new Promise((resolve, reject) => {
          /**
           * Call external onChange,
           */
          if (this.props.onChange) {
            this.props.onChange(e);
          }

          this.didchanged = true;

          const value = this.getValue(e);
          context
            .onFieldChange({ name, value })
            .then(() => {
              if (setValues) {
                setValues({ [name]: value })
                  .then(() => resolve())
                  .catch(reject);
              } else {
                resolve();
              }
            })
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

          this.didchanged = false;

          const value = this.getValue(e);
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

          const value = this.getValue(e);
          context
            .onFieldBlur({ name, value })
            .then(() => {
              if (this.didChanged()) {
                context
                  .onFieldDidChanged({ name, value })
                  .then(() => resolve())
                  .catch(reject);
              } else {
                resolve();
              }
            })
            .catch(reject);
        })
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
