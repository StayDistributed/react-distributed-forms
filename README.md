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

### Live Demo

[Data Binding](https://codesandbox.io/s/4jy3x6xpx4)

[Context](https://codesandbox.io/s/7zw28x215q)

[Context + Data Binding](https://codesandbox.io/s/km4538r82r)

[Full Example](https://codesandbox.io/s/5k30y1x05k)

[Issues](https://github.com/StayDistributed/react-distributed-forms/issues)

## Installation

Add react-distributed-forms to your project.

```bash
npm i react-distributed-forms --save
```

## Includes

```js
import { Form, Input, Selext, Textarea, Button } from "react-distributed-forms";
```

## Getting Started

Basic `<Input>`

```js
<Input />

// <input type="text"></input>
```

Listen to `<Input>` changes

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

## Data Binding

You can pass a React Component to `<Form>`, this will be used to write every fields'change into the state of the component

[Live Demo of Data Binding](https://codesandbox.io/s/4jy3x6xpx4)

This is the simplest scenario, when you bind the state of the component:

```js
class SomeComponent extends React.Component {
  state = {
    first_name: "George"
  };

  render() {
    return (
      <Form binding={this}>
        <Input name="first_name" />
      </Form>
    );
  }
}
```

You can also bind Form values to a different key of the state:

```js
class SomeComponent extends React.Component {
  state = {
    formdata: {
      first_name: "George"
    }
  };

  render() {
    return (
      <Form binding={[this, "formdata"]}>
        <Input name="first_name" />
      </Form>
    );
  }
}
```

## Nested Forms

You can have a `<Form>` inside another `<Form>`, in this case the Forms will receive changes from all the fields contained in the Form itself or in a Form down in the hierarchy.

In the example Form with id="parent" will receive changes from all the fields inside: username, genre, and also "privacy". The Form with id="child" will receive only the changes of the field "privacy".

```js
<Form id="parent" onFieldChange={({ name, value }) => {}}>
  <Input name="username" />
  <Select name="genre">
    <option value="m">Male</option>
    <option value="f">Female</option>
  </Select>
  <Form id="child" onFieldChange={({ name, value }) => {}}>
    <label>Privacy Agreement</label>
    <Input type="checkbox" name="privacy" />
  </Form>
</Form>
```

If you don't want that a Form propagate changes to upper levels, use the prop "stopPropagation" prop. In the example the Form with id="parent" will receive changes only from "username" and "genre" because the nested Form has "stopPropagation" set

```js
<Form id="parent" onFieldChange={({ name, value }) => {}}>
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

## Unlock the power of React context API

**react-distributed-forms** is built on top of [react-distributed-context](https://github.com/StayDistributed/react-distributed-context) that implements React context API.

From [React Context](https://reactjs.org/docs/context.html) page:

> Context provides a way to pass data through the component tree without having to pass props down manually at every level.

This means that even if the **Fields** or the **Nested Form** you put inside a **Form** is elsewhere in your code, you don't have to wire it passing props, or building it in the same component.

You just create an `<Input>`, or `<Select>`, or `<Textarea>`, or `<Button>`, or a `<Form>` itself, wherever you need in your code, and if it has a `<Form>`as an ancestor in the tree, it will start to talk with him.

Demo:

[Context](https://codesandbox.io/s/7zw28x215q)

[Context + Data Binding](https://codesandbox.io/s/km4538r82r)

Example:

_Animal.js_

```js
const Animal = () => (
  <Form onFieldChange={({ name, value }) => {}}>
    <Select name="type">
      <option>Cat</option>
      <option>Fish</option>
      <option>Bird</option>
    </Select>

    {/* render the right animal component */}
  </Form>
);
```

_Cat.js_

```js
// you don't need a <Form>,
// because you will render <Cat>
// inside a component that already has a <Form>
// and it will receive this component fields changes
const Cat = () => (
  <div className="Cat">
    <Input type="number" name="number_of_legs" />

    <label>
      {`Is registered by law to cats'registry?`}
      <Input type="checkbox" name="cat_registration" />
    </label>
  </div>
);
```

_Fish.js_

```js
// same as Cat you don't need a <Form>,
const Fish = () => (
  <div className="Fish">
    <Input type="number" name="number_of_fins" />
  </div>
);
```

_Bird.js_

```js
// same as Cat you don't need a <Form>,
// but if you want you can have a Nested Form,
// in this case the Animal <Form> will receive all the changes,
// and the Bird <Form> only the changes of "number_of_legs" and "number_of_wings"
const Bird = () => (
  <div className="Bird">
    <Form onFieldChange={({ name, value }) => {}}>
      <Input type="number" name="number_of_legs" />
      <Input type="number" name="number_of_wings" />
    </Form>
  </div>
);
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

Triggered every time a field has changed its value and user has finished editing it, for example when a `<Select>` changes value or an `<Input type="text">` lose focus after editing

- you can use it to call your backend automatically on form editing.

### onSubmit({name, value})

Triggered every time a Button inside a from is clicked

### values

A Key-Value object to automatically set the value of the fields, based on their "name" attributes.

### binding

A React Component to bind state with, you can pass only the component like `binding={this}` or if you want to bind an internal key of state you can pass an array `binding={[this, 'the_state_key_to_bind']}`

### stopPropagation

if set `<Form stopPropagation>` the forms that are upper in the hierarchy won't receive data from fields inside this Form.

## Example

With binding set to `this`, every change in the Form will be written to the Component state.

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
        binding={this}
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
