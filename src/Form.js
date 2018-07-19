import React, { Component } from "react";
import PropTypes from "prop-types";
import { Provider, Consumer } from "react-distributed-context";

export default class Form extends Component {
  canPropagate = () => !this.props.stopPropagation;

  getContextValue(parentValue, props) {
    const executeMethod = methodName => event =>
      new Promise((resolve, reject) => {
        let isStopped = false;
        const stopPropagation = () => (isStopped = true);

        if (props[methodName]) {
          props[methodName]({ ...event, stopPropagation });
        }

        if (!this.canPropagate() || isStopped) {
          resolve();
          return;
        }

        /**
         * parentValue[methodName] is a Promise
         */
        if (parentValue[methodName]) {
          parentValue[methodName](event)
            .then(() => resolve())
            .catch(reject);
        } else {
          resolve();
        }
      });

    const hasValues = "values" in props;

    let values = hasValues
      ? props.values
      : "values" in parentValue
        ? parentValue.values
        : null;

    let setValues =
      !hasValues && !("binding" in props) ? parentValue.setValues : null;

    /**
     * If `values` is set, binding is ignored and nullified
     */
    if (!hasValues && props.binding) {
      if (props.binding.setState && props.binding.state) {
        values = props.binding.state;
        setValues = changes =>
          new Promise(resolve => {
            props.binding.setState(changes, () => resolve());
          });
      } else if (
        props.binding[0] &&
        props.binding[0].setState &&
        props.binding[1]
      ) {
        values = props.binding[0].state[props.binding[1]];
        setValues = changes =>
          new Promise(resolve => {
            props.binding[0].setState(
              {
                ...props.binding[0].state,
                [props.binding[1]]: {
                  ...props.binding[0].state[props.binding[1]],
                  ...changes
                }
              },
              () => resolve()
            );
          });
      }
    }

    return {
      /**
       * Getter and Setter for values
       */
      values,
      setValues,

      /**
       * Init values, force value to be !== null
       * to avoid warning about switching to controlled component
       */
      initValues: values && props.initValues,

      /**
       * onFieldChange
       * onFieldFocus
       * onFieldBlur
       * called from Form's fields when input events are triggered
       */
      onFieldChange: executeMethod("onFieldChange"),
      onFieldFocus: executeMethod("onFieldFocus"),
      onFieldBlur: executeMethod("onFieldBlur"),

      /**
       * onFieldDidChanged
       * called from Form's fields to indicate user has finished editing the input
       */
      onFieldDidChanged: executeMethod("onFieldDidChanged"),

      /**
       * onSubmit
       * called from Form's fields when form has to be submitted
       */
      onSubmit: executeMethod("onSubmit")
    };
  }

  render() {
    return (
      <Consumer>
        {parentValue => (
          <Provider value={this.getContextValue(parentValue, this.props)}>
            {this.props.children}
          </Provider>
        )}
      </Consumer>
    );
  }
}

Form.defaultProps = {
  stopPropagation: false,
  initValues: true
};

Form.propTypes = {
  stopPropagation: PropTypes.bool,
  initValues: PropTypes.bool,
  values: PropTypes.object,
  binding: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onFieldChange: PropTypes.func,
  onFieldFocus: PropTypes.func,
  onFieldBlur: PropTypes.func,
  onFieldDidChanged: PropTypes.func,
  onSubmit: PropTypes.func
};
