import React from "react";
import expect from "expect";
import { create } from "react-test-renderer";

import { Form, Field, Input, Textarea, Select } from "../src/";
import { Input as BaseInput } from "../src/Input";
import { Textarea as BaseTextarea } from "../src/Textarea";
import { Select as BaseSelect } from "../src/Select";

describe("Form", () => {
  let tree;
  let component;

  class TestInput extends React.Component {
    render() {
      return (
        <Field
          render={contextValue => (
            <BaseInput
              context={contextValue}
              testableContext={contextValue}
              {...this.props}
            />
          )}
        />
      );
    }
  }

  class TestTextarea extends React.Component {
    render() {
      return (
        <Field
          render={contextValue => (
            <BaseTextarea
              context={contextValue}
              testableContext={contextValue}
              {...this.props}
            />
          )}
        />
      );
    }
  }

  class TestSelect extends React.Component {
    render() {
      return (
        <Field
          render={contextValue => (
            <BaseSelect
              context={contextValue}
              testableContext={contextValue}
              {...this.props}
            />
          )}
        />
      );
    }
  }

  it("Field", () => {
    component = create(<Field />);
    tree = component.toJSON();

    expect(tree.type).toBeTruthy();
    expect(tree.type).toBe("pre");
    expect(tree.children[0]).toContain("You must implement");
  });

  it("binding", async () => {
    class TestForm extends React.Component {
      state = {
        firstname: "George"
      };

      render() {
        return (
          <Form binding={this}>
            <TestInput type="text" name="firstname" />
            <TestTextarea name="bio" />
            <TestSelect name="genre">
              <option>Male</option>
              <option>Female</option>
            </TestSelect>
          </Form>
        );
      }
    }

    component = create(<TestForm />);
    let testableContext;

    tree = component.toJSON();

    /**
     * Input Context
     */
    testableContext = tree[0].props.testableContext;

    expect(testableContext).toBeTruthy();
    expect(testableContext.values).toBeTruthy();
    expect(testableContext.values[tree[0].props.name]).toBeTruthy();
    expect(testableContext.values[tree[0].props.name]).toBe("George");
    expect(testableContext.setValues).toBeTruthy();

    await testableContext.setValues({ firstname: "Luke" });

    tree = component.toJSON();
    testableContext = tree[0].props.testableContext;

    expect(testableContext.values).toBeTruthy();
    expect(testableContext.values[tree[0].props.name]).toBeTruthy();
    expect(testableContext.values[tree[0].props.name]).toBe("Luke");

    await tree[0].props.onChange({ target: { value: "Mark" } });

    tree = component.toJSON();
    testableContext = tree[0].props.testableContext;

    expect(testableContext.values).toBeTruthy();
    expect(testableContext.values[tree[0].props.name]).toBeTruthy();
    expect(testableContext.values[tree[0].props.name]).toBe("Mark");

    /**
     * Textarea Context
     */
    testableContext = tree[1].props.testableContext;
    await testableContext.setValues({ bio: "This is my bio" });

    tree = component.toJSON();
    testableContext = tree[1].props.testableContext;

    expect(testableContext.values).toBeTruthy();
    expect(testableContext.values[tree[1].props.name]).toBeTruthy();
    expect(testableContext.values[tree[1].props.name]).toBe("This is my bio");

    await tree[1].props.onChange({ target: { value: "That was my bio" } });

    tree = component.toJSON();
    testableContext = tree[1].props.testableContext;

    expect(testableContext.values).toBeTruthy();
    expect(testableContext.values[tree[1].props.name]).toBeTruthy();
    expect(testableContext.values[tree[1].props.name]).toBe("That was my bio");

    /**
     * Select Context
     */
    testableContext = tree[2].props.testableContext;
    await testableContext.setValues({ genre: "Male" });

    tree = component.toJSON();
    testableContext = tree[2].props.testableContext;

    expect(testableContext.values).toBeTruthy();
    expect(testableContext.values[tree[2].props.name]).toBeTruthy();
    expect(testableContext.values[tree[2].props.name]).toBe("Male");

    await tree[2].props.onChange({ target: { value: "Female" } });

    tree = component.toJSON();
    testableContext = tree[2].props.testableContext;

    expect(testableContext.values).toBeTruthy();
    expect(testableContext.values[tree[2].props.name]).toBeTruthy();
    expect(testableContext.values[tree[2].props.name]).toBe("Female");
  });

  it("binding defaultValue", async () => {
    class TestForm extends React.Component {
      state = {};

      render() {
        return (
          <Form binding={this}>
            <TestInput type="text" name="firstname" value="Michael" />
            <Textarea name="short_bio" />
            <Textarea name="long_bio" value="Long Long Bio" />
          </Form>
        );
      }
    }

    component = create(<TestForm />);
    tree = component.toJSON();

    const testableContext = tree[0].props.testableContext;

    expect(testableContext).toBeTruthy();
    expect(testableContext.values).toBeTruthy();
    expect(testableContext.values[tree[0].props.name]).toBeTruthy();
    expect(testableContext.values[tree[0].props.name]).toBe("Michael");
    expect(testableContext.values[tree[1].props.name]).toBeFalsy();
    expect(testableContext.values[tree[2].props.name]).toBeTruthy();
    expect(testableContext.values[tree[2].props.name]).toBe("Long Long Bio");
  });

  it("binding initValues", async () => {
    class TestForm extends React.Component {
      state = {
        age: "34",
        developer: "on",
        manager: ""
      };

      render() {
        return (
          <Form binding={this}>
            <Input type="checkbox" name="manager" />
            <Input type="checkbox" name="developer" />
            <Input type="radio" name="age" value="34" />
            <Input type="radio" name="age" value="78" />
            <Select name="country" multiple>
              <option value="IT" selected>
                Italy
              </option>
              <option selected>Germany</option>
              <option value="FR">France</option>
            </Select>
            <Select name="languages" multiple value={["Italian"]}>
              <option>Italian</option>
              <option>German</option>
              <option>French</option>
            </Select>
            <Select name="genre">
              <option>Unknown</option>
              <option>Male</option>
              <option>Female</option>
            </Select>
          </Form>
        );
      }
    }

    component = create(<TestForm />);

    await new Promise(res => setTimeout(res, 100));

    tree = component.toJSON();

    expect(tree[0].props.checked).toBeFalsy();
    expect(tree[1].props.checked).toBeTruthy();
    expect(tree[2].props.checked).toBeTruthy();
    expect(tree[2].props.value).toBe("34");
    expect(tree[3].props.checked).toBeFalsy();
    expect(tree[3].props.value).toBe("78");
    expect(tree[4].props.value).toEqual(["IT", "Germany"]);
    expect(tree[5].props.value).toEqual(["Italian"]);
    expect(tree[6].props.value).toBe("");
  });

  it("binding state child", async () => {
    class TestForm extends React.Component {
      state = {
        user: {
          firstname: "George"
        }
      };

      render() {
        return (
          <Form binding={[this, "user"]}>
            <TestInput type="text" name="firstname" />
          </Form>
        );
      }
    }

    component = create(<TestForm />);
    tree = component.toJSON();

    expect(tree.props.testableContext).toBeTruthy();
    expect(tree.props.testableContext.values).toBeTruthy();
    expect(tree.props.testableContext.values[tree.props.name]).toBeTruthy();
    expect(tree.props.testableContext.values[tree.props.name]).toBe("George");
    expect(tree.props.testableContext.setValues).toBeTruthy();

    await tree.props.testableContext.setValues({ firstname: "Luke" });

    tree = component.toJSON();
    expect(tree.props.testableContext.values).toBeTruthy();
    expect(tree.props.testableContext.values[tree.props.name]).toBeTruthy();
    expect(tree.props.testableContext.values[tree.props.name]).toBe("Luke");
  });

  it("parentMethod trigger", async () => {
    let testValues;
    component = create(
      <Form onFieldChange={changes => (testValues = changes)}>
        <Form
          binding={this}
          onFieldChange={() => {
            return null;
          }}
        >
          <TestInput type="text" name="firstname" />
        </Form>
      </Form>
    );
    tree = component.toJSON();

    await tree.props.onChange({
      target: { name: tree.props.name, value: "testValue" }
    });

    expect(testValues).toBeTruthy();
    expect(testValues.name).toBe(tree.props.name);
    expect(testValues.value).toBe("testValue");
  });

  it("parentMethod stopPropagation", async () => {
    let testValues;
    component = create(
      <Form onFieldChange={changes => (testValues = changes)}>
        <Form
          binding={this}
          onFieldChange={({ stopPropagation }) => {
            stopPropagation();
            return null;
          }}
        >
          <TestInput type="text" name="firstname" />
        </Form>
      </Form>
    );
    tree = component.toJSON();

    await tree.props.onChange({
      target: { name: tree.props.name, value: "testValue" }
    });

    expect(testValues).toBeFalsy();
  });
});
