import React, { Component } from "react";
import PropTypes from "prop-types";
import Field from "./Field";

class Input extends Component {
  state = {
    didchanged: false
  };

  componentDidMount() {
    const { name, value, context } = this.props;
    const { values, setValues } = context || {};
    if ("value" in this.props && !(name in values) && setValues) {
      setValues({ [name]: value });
    }
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

      onChange: e =>
        new Promise((resolve, reject) => {
          /**
           * Call external onChange,
           */
          if (this.props.onChange) {
            this.props.onChange(e);
          }

          const value = this.getValue(e);
          this.setState(
            {
              didchanged: true
            },
            () => {
              context
                .onFieldChange({ name, value })
                .then(() => {
                  const onDidChanged = () => {
                    if (this.didChanged() && this.didChangedOnChange()) {
                      context
                        .onFieldDidChanged({ name, value })
                        .then(() => resolve())
                        .catch(e => reject());
                    } else {
                      resolve();
                    }
                  };

                  if (setValues) {
                    setValues({ [name]: value })
                      .then(onDidChanged)
                      .catch(e => reject());
                  } else {
                    onDidChanged();
                  }
                })
                .catch(e => reject(e));
            }
          );
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
          this.setState(
            {
              didchanged: false
            },
            () => {
              context
                .onFieldFocus({ name, value })
                .then(() => resolve())
                .catch(e => reject(e));
            }
          );
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
                  .catch(e => reject(e));
              } else {
                resolve();
              }
            })
            .catch(e => reject(e));
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
