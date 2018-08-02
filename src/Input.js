import React, { Component } from "react";
import PropTypes from "prop-types";
import Field from "./Field";
import getDerivedStateFromProps from "./utils/getDerivedStateFromProps";

export class Input extends Component {
  state = {};

  static getDerivedStateFromProps = getDerivedStateFromProps;

  componentDidMount() {
    const { name, value, context } = this.props;
    const { values, setValues } = context;
    if ("value" in this.props && (!values || !(name in values)) && setValues) {
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

  getProps() {
    const { value, name, type, context } = this.props;
    const { setValues } = context;

    return {
      ...(type === "checkbox"
        ? { checked: this.state.value ? true : false }
        : type === "radio"
          ? { checked: this.state.value === value ? true : false }
          : { value: this.state.value }),

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
            () => ({
              value,
              didchanged: true
            }),
            () => {
              context
                .onFieldChange({ name, value })
                .then(() => {
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
            () => ({
              didchanged: false
            }),
            () => {
              context
                .onFieldFocus({ name, value })
                .then(() => resolve())
                .catch(reject);
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
                  .catch(reject);
              } else {
                resolve();
              }
            })
            .catch(reject);
        })
    };
  }

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
