# react-distributed-forms

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

[build-badge]: https://img.shields.io/travis/StayDistributed/react-distributed-forms/master.png?style=flat-square
[build]: https://travis-ci.org/StayDistributed/react-distributed-forms
[npm-badge]: https://img.shields.io/npm/v/react-distributed-forms.png?style=flat-square
[npm]: https://www.npmjs.com/package/react-distributed-forms
[coveralls-badge]: https://img.shields.io/coveralls/StayDistributed/react-distributed-forms/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/StayDistributed/react-distributed-forms

Every input is inside a form, _react-distributed-forms_ let you write the html you want and listen to the fields changes from the Form that contains them. HTML is cleaner, changes control is centralized. You can also build awesome _nested forms_ (see below).

## Installation

Add react-distributed-forms to your project.

```bash
npm i react-distributed-forms --save
```

## Use in your modules

```js
import { Form, Input, Selext, Textarea, Button } from "react-distributed-forms";
```

## Getting Started

Basic Input

```js
<Input />

// <input type="text"></input>
```

Listen to Input's changes

```js
<Form onFieldChange={({ name, value }) => {}}>
  <Input name="username" />
</Form>

// <input type="text" name="username"></input>
```

Get notified when user remove focus from field, if the field value is changed

```js
<Form onFieldDidChanged={({ name, value }) => {}}>
  <Input name="username" />
  <Select name="genre">
    <option value="m">Male</option>
    <option value="f">Female</option>
  </Select>
</Form>

// <input type="text" name="username"></input>
// <select name="genre">
//   <option value="m">Male</option>
//   <option value="f">Female</option>
// </select>
```

## Nested Forms

```js
// this Form will receive changes from all the fields inside:
//username, genre, and also "privacy"
<Form onFieldChange={({ name, value }) => {}}>
  <Input name="username" />
  <Select name="genre">
    <option value="m">Male</option>
    <option value="f">Female</option>
  </Select>
  // this Form will receive changes only from the field "privacy"
  <Form onFieldChange={({ name, value }) => {}}>
    <label>Privacy Agreement</label>
    <Input type="checkbox" name="privacy" />
  </Form>
</Form>
```

```js
// if you don't want that a Form propagate changes
// to upper levels, use the prop "stopPropagation"
// now this Form will receive changes only from "username"
// and "genre" because the nested Form has "stopPropagation"
<Form onFieldChange={({ name, value }) => {}}>
  <Input name="username" />
  <Select name="genre">
    <option value="m">Male</option>
    <option value="f">Female</option>
  </Select>

  <Form onFieldChange={({ name, value }) => {}} stopPropagation>
    <label>Privacy Agreement</label>
    <Input type="checkbox" name="privacy" />
  </Form>
</Form>
```

## <Form> Props

### onFieldChange({name, value})

Triggered every time a field changes its value

- you can use it to update your state.

### onFieldFocus({name, value})

Triggered every time a field is focused

- you can use for changing styles of focused input

### onFieldBlur({name, value})

Triggered every time a field lose focused

- you can use for removing styles of focuesd input

### onFieldDidChanged({name, value})

Triggered every time a field has changed its value and user has finished editing it, for example when a Select changes value or an Input type="text" lose focus after editing

- you can use it to call your backend automatically on form editing.

### onSubmit({name, value})

Triggered every time a Button inside a from is clicked

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
  onFieldChange({name, value}) {
    this.setState({
      [name]: value
    });
  },

  /**
   * onFieldDidChanged
   * called from Form's fields to indicate user has finished editing the input
   */
  onFieldDidChanged({name, value}) {
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
  onSubmit({name, value}) {
    if (name === 'submit') {
      ajaxPOST(YOUR_API_ENDPOINT, this.state);
    }
  },

  render () {
    return (
      <Form
        binding={this.state}
        onFieldChange={this.onFieldChange}
        onFieldDidChanged={this.onFieldDidChanged}
        onSubmit={this.onSubmit}
      >
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
