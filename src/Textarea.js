import React, { Component } from "react";
import PropTypes from "prop-types";
import Field from "./Field";
import getDerivedStateFromProps from "./utils/getDerivedStateFromProps";

export class Textarea extends Component {
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

  getValue = e => e.target.value;

  getProps() {
    const { name, context } = this.props;
    const { setValues } = context;

    return {
      value: this.state.value,

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
                  if (setValues) {
                    setValues({ [name]: value })
                      .then(() => resolve())
                      .catch(reject);
                  } else {
                    resolve();
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
  }

  render() {
    return (
      <textarea {...{ ...this.props, context: null }} {...this.getProps()} />
    );
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
