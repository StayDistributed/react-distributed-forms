import React from "react";
import expect from "expect";
import { create } from "react-test-renderer";

import { Form, Textarea } from "../src/";

describe("Textarea", () => {
  let tree;
  let component;

  it("Props Support", () => {
    tree = create(
      <Form>
        <Textarea name="title" />
        <Textarea name="story" />
      </Form>
    ).toJSON();

    expect(tree.length).toBe(2);

    tree.forEach(child => {
      expect(child.children).toBeFalsy();
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
        <Textarea name="bio" value="A short bio" />
      </Form>
    ).toJSON();

    expect(tree.children).toBeFalsy();
    expect(tree.props.name).toBeA("string");
    expect(tree.props.value).toBe("A short bio");
    expect(tree.props.onChange).toBeA("function");
    expect(tree.props.onFocus).toBeA("function");
    expect(tree.props.onBlur).toBeA("function");

    await tree.props.onChange({
      target: { value: "A long long bio..." }
    });

    expect(testValue).toBe("A long long bio...");
  });

  it("onFieldChange", async () => {
    let testValues;
    component = create(
      <Form
        onFieldChange={({ name, value }) => {
          testValues = { name, value };
        }}
      >
        <Textarea name="bio" />
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
        <Textarea name="bio" />
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

  it("onFocus onChange onBlur", async () => {
    let testValues;

    component = create(
      <Form>
        <Textarea
          name="bio"
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
