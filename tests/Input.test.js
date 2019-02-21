import React from "react";
import expect from "expect";
import { create } from "react-test-renderer";

import { Form, Input } from "../src/";

describe("Input", () => {
  let tree;
  let component;

  it("Mount", () => {
    tree = create(
      <div>
        <Input type="text" name="firstname" />
        <Input type="password" name="password" />
      </div>
    ).toJSON();

    expect(tree.children.length).toBe(2);

    tree.children.forEach(child => {
      expect(child.children).toBeFalsy();
      expect(child.props.type).toBeA("string");
      expect(child.props.name).toBeA("string");
      expect(child.props.onChange).toBeA("function");
      expect(child.props.onFocus).toBeA("function");
      expect(child.props.onBlur).toBeA("function");
    });
  });

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

  it("Props Support type='checkbox'", async () => {
    let testValue;

    tree = create(
      <Form onFieldChange={({ value }) => (testValue = value)}>
        <Input type="checkbox" name="age" value="34" />
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
      target: { checked: false, value: "34" }
    });

    expect(testValue).toBe("");

    await tree.props.onChange({
      target: { checked: true, value: "34" }
    });

    expect(testValue).toBe("34");
  });

  it("Props Support type='radio'", async () => {
    let testValue;

    tree = create(
      <Form onFieldChange={({ value }) => (testValue = value)}>
        <Input type="radio" name="age" value="34" />
        <Input type="radio" name="age" value="78" />
      </Form>
    ).toJSON();

    expect(tree[1]).toBeTruthy();
    expect(tree[0].props.type).toBeA("string");
    expect(tree[0].props.name).toBeA("string");
    expect(tree[0].props.value).toBe("34");
    expect(tree[0].props.onChange).toBeA("function");
    expect(tree[0].props.onFocus).toBeA("function");
    expect(tree[0].props.onBlur).toBeA("function");

    await tree[1].props.onChange({
      target: { checked: false, value: tree[1].props.value }
    });

    expect(testValue).toBe("");

    await tree[1].props.onChange({
      target: { checked: true, value: tree[1].props.value }
    });

    expect(testValue).toBe("78");
  });

  it("onKeyPress", async () => {
    let testValues;

    component = create(
      <Form
        onSubmit={({ name, value }) => {
          testValues = { name, value };
        }}
      >
        <Input type="text" name="firstname" />
      </Form>
    );
    tree = component.toJSON();

    await tree.props.onKeyPress({
      target: { name: tree.props.name, value: "testValue" },
      key: "Escape"
    });

    expect(testValues).toBeFalsy();

    await tree.props.onKeyPress({
      target: { name: tree.props.name, value: "testValue" },
      key: "Enter"
    });

    expect(testValues).toBeTruthy();
    expect(testValues.name).toBe(tree.props.name);
    expect(testValues.value).toBe("testValue");
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

  it("onFocus onKeyPress onChange onBlur", async () => {
    let testValues;

    component = create(
      <Form>
        <Input
          type="text"
          name="firstname"
          onKeyPress={e => (testValues = e)}
          onChange={e => (testValues = e)}
          onFocus={e => (testValues = e)}
          onBlur={e => (testValues = e)}
        />
      </Form>
    );
    tree = component.toJSON();

    await tree.props.onChange({
      target: { name: tree.props.name, value: "testValue" }
    });

    expect(testValues).toBeTruthy();
    expect(testValues.target).toBeTruthy();
    expect(testValues.target.value).toBeTruthy();
    expect(testValues.target.value).toBe("testValue");

    await tree.props.onKeyPress({
      target: { name: tree.props.name, value: "testValue" }
    });

    expect(testValues).toBeTruthy();
    expect(testValues.target).toBeTruthy();
    expect(testValues.target.value).toBeTruthy();
    expect(testValues.target.value).toBe("testValue");

    await tree.props.onFocus({
      target: { name: tree.props.name, value: "testValue" }
    });

    expect(testValues).toBeTruthy();
    expect(testValues.target).toBeTruthy();
    expect(testValues.target.value).toBeTruthy();
    expect(testValues.target.value).toBe("testValue");

    await tree.props.onBlur({
      target: { name: tree.props.name, value: "testValue" }
    });

    expect(testValues).toBeTruthy();
    expect(testValues.target).toBeTruthy();
    expect(testValues.target.value).toBeTruthy();
    expect(testValues.target.value).toBe("testValue");
  });
});
