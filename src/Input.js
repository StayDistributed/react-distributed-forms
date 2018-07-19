import React, { Component } from "react";
import PropTypes from "prop-types";
import Field from "./Field";

class Input extends Component {
  didchanged = false;

  componentDidMount() {
    const { name, value, context } = this.props;
    const { values, setValues } = context || {};
    if ("value" in this.props && !(name in values) && setValues) {
      setValues({ [name]: value });
    }
  }

  didChanged() {
    return this.didchanged;
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
              console.log(name, value);
              const onDidChanged = () => {
                if (this.didChanged() && this.didChangedOnChange()) {
                  context
                    .onFieldDidChanged({ name, value })
                    .then(() => resolve())
                    .catch(reject);
                } else {
                  resolve();
                }
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
              if (this.didChanged() && this.didChangedOnBlur()) {
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
    return <input {...{ ...this.props, context: null }} {...this.getProps()} />;
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
