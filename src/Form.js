import React, { Component } from "react";
import PropTypes from "prop-types";
import { Provider, Consumer } from "react-distributed-context";

export default class Form extends Component {
  canPropagate = () => !this.props.stopPropagation;

  getContextValue(parentValue, props) {
    const executeMethod = methodName => (...args) => {
      if (props[methodName]) {
        props[methodName](...args);
      }

      if (!this.canPropagate() || args[0].isStopped) return;

      if (parentValue[methodName]) {
        parentValue[methodName](...args);
      }
    };

    return {
      binding: { ...props.binding },

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
  binding: {}
};

Form.propTypes = {
  stopPropagation: PropTypes.bool,
  binding: PropTypes.object
};
