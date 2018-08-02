import React, { Component } from "react";
import PropTypes from "prop-types";
import Field from "./Field";
import getDerivedStateFromProps from "./utils/getDerivedStateFromProps";

export class Select extends Component {
  state = {};

  static getDerivedStateFromProps = getDerivedStateFromProps;

  componentDidMount() {
    const { name, value, context } = this.props;
    const { values, setValues } = context;

    const optionSelected = this.props.children
      .filter(option => option && option.props && option.props.selected)
      .map(
        option =>
          "value" in option.props ? option.props.value : option.props.children
      );

    if ((!values || !(name in values)) && setValues) {
      if ("value" in this.props) {
        setValues({ [name]: value });
      } else if (optionSelected.length) {
        setValues({ [name]: optionSelected });
      }
    }
  }

  getValue = e =>
    this.props.multiple
      ? [].slice.call(e.target.selectedOptions).map(o => o.value)
      : e.target.value;

  getProps = () => {
    const { name, context, multiple } = this.props;
    const { setValues } = context;

    return {
      value: this.state.value || (multiple ? [] : ""),

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
