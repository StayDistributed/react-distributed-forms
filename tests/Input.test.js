import React from "react";
import expect from "expect";
import { create } from "react-test-renderer";

import { Form, Input } from "../src/";

describe("Input", () => {
  let tree;
  let component;

  it("Props Support", () => {
    tree = create(
      <Form>
        <Input type="text" name="firstname" />
        <Input type="password" name="password" />
        <Input type="email" name="email" />
        <Input type="number" name="age" value="34" />
      </Form>
    ).toJSON();

    expect(tree.length).toBe(4);

    tree.forEach(child => {
      expect(child.children).toBeFalsy();
      expect(child.props.type).toBeA("string");
      expect(child.props.name).toBeA("string");
      expect(child.props.onChange).toBeA("function");
      expect(child.props.onFocus).toBeA("function");
      expect(child.props.onBlur).toBeA("function");
    });
  });

  it("Props Support value", async () => {
    let testValue;

    tree = create(
      <Form onFieldChange={({ value }) => (testValue = value)}>
        <Input type="number" name="age" value="34" />
      </Form>
    ).toJSON();

    expect(tree.children).toBeFalsy();
    expect(tree.props.type).toBeA("string");
    expect(tree.props.name).toBeA("string");
    expect(tree.props.value).toBe("34");
    expect(tree.props.onChange).toBeA("function");
    expect(tree.props.onFocus).toBeA("function");
    expect(tree.props.onBlur).toBeA("function");

    await tree.props.onChange({
      target: { value: "78" }
    });

    expect(testValue).toBe("78");
  });

  it("onFieldChange", async () => {
    let testValues;
    component = create(
      <Form
        onFieldChange={({ name, value }) => {
          testValues = { name, value };
        }}
      >
        <Input type="text" name="firstname" />
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

  it("onFieldDidChanged", async () => {
    let onFieldChangeValues;
    let testValues;
    component = create(
      <Form
        onFieldChange={({ name, value }) => {
          onFieldChangeValues = { name, value };
        }}
        onFieldDidChanged={({ name, value }) => {
          testValues = onFieldChangeValues;
        }}
      >
        <Input type="text" name="firstname" />
      </Form>
    );
    tree = component.toJSON();

    await tree.props.onFocus({ target: {} });

    await tree.props.onChange({
      target: { name: tree.props.name, value: "testValue" }
    });

    await tree.props.onBlur({ target: {} });

    expect(testValues).toBeTruthy();
    expect(testValues.name).toBe(tree.props.name);
    expect(testValues.value).toBe("testValue");
  });
});
