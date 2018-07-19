import React, { Component } from "react";
import PropTypes from "prop-types";
import Field from "./Field";

class Select extends Component {
  state = {};

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

      onChange: e =>
        new Promise((resolve, reject) => {
          /**
           * Call external onChange,
           */
          if (this.props.onChange) {
            this.props.onChange(e);
          }

          const value = this.getValue(e);
          context
            .onFieldChange({ name, value })
            .then(() => {
              const onDidChanged = () => {
                context
                  .onFieldDidChanged({ name, value })
                  .then(() => resolve())
                  .catch(reject);
              };

              if (setValues) {
                setValues({ [name]: value })
                  .then(onDidChanged)
                  .catch(reject);
              } else {
                onDidChanged();
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
            .then(() => resolve())
            .catch(reject);
        })
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
