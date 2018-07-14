# react-distributed-forms

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

react-distributed-forms

[build-badge]: https://img.shields.io/travis/StayDistributed/react-distributed-forms/master.png?style=flat-square
[build]: https://travis-ci.org/StayDistributed/react-distributed-forms
[npm-badge]: https://img.shields.io/npm/v/react-distributed-forms.png?style=flat-square
[npm]: https://www.npmjs.com/package/react-distributed-forms
[coveralls-badge]: https://img.shields.io/coveralls/StayDistributed/react-distributed-forms/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/StayDistributed/react-distributed-forms

## Installation

Add react-distributed-forms to your project.

```bash
npm i react-distributed-forms --save
```

## <Form> Props

### onFieldChange(name, value)

Triggered every time a field changes its value

- you can use it to update your state.

### onFieldFocus(name, value)

Triggered every time a field is focused

- you can use for changing styles of focused input

### onFieldBlur(name, value)

Triggered every time a field lose focused

- you can use for removing styles of focuesd input

### onFieldDidChanged(name, value)

Triggered every time a field has changed its value and user has finished editing it, for example when a <select> changes value or an input type="text" lose focus after editing

- you can use it to call your backend automatically on form editing.

### onSubmit(name, value)

Triggered every time a <Button> inside a from is clicked

## Create a basic form

```js
import React from 'react';
import { render } from "react-dom";
import { Form, Input, Selext, Textarea, Button } from 'react-distributed-forms';

// You can set a variable and check it if you want to auto-save when user finished editing a field
const AUTO_SAVE_ON_CHANGE_ENABLED = true;

class UserInfoForm extends React.Component {

  state = {
    first_name: 'John',
    last_name: 'Doe'
  };

  /**
   * onFieldChange
   */
  onFieldChange(name, value) {
    this.setState({
      [name]: value
    });
  },

  /**
   * onFieldDidChanged
   * called from Form's fields to indicate user has finished editing the input
   */
  onFieldDidChanged(name, value) {
    if (AUTO_SAVE_ON_CHANGE_ENABLED) {
      this.setState({
        [name]: value
      }, () => {
        // after state's updated, send new data to your API endpoint.
        ajaxPOST(YOUR_API_ENDPOINT, this.state);
      });
    }
  },

  /**
   * onSubmit
   * called from Form's fields when form has to be submitted
   */
  onSubmit(name, value) {
    if (name === 'submit') {
      ajaxPOST(YOUR_API_ENDPOINT, this.state);
    }
  },

  render () {
    return (
      <Form binding={this.state} onFieldChange={this.onFieldChange} onFieldDidChanged={this.onFieldDidChanged} onSubmit={this.onSubmit}>
        <div>
          <label for="first_name">First Name:</label>
          <Input type="text" id="first_name" name="first_name" />
        </div>
        <div>
          <label for="last_name">Last Name:</label>
          <Input type="text" id="last_name" name="last_name" />
        </div>
        <Button name="submit">Save</Button>
      </Form>
    );
  }
}

render(<UserInfoForm />, document.querySelector("#root"));
```
