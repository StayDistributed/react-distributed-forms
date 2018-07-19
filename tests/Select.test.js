import React from "react";
import expect from "expect";
import { create } from "react-test-renderer";

import { Form, Select } from "../src/";

describe("Select", () => {
  let tree;
  let component;

  it("Props Support", () => {
    tree = create(
      <Form>
        <Select name="genre">
          <option>Unknown</option>
          <option>Male</option>
          <option>Female</option>
        </Select>
        <Select name="country">
          <option>Italy</option>
          <option>Germany</option>
          <option>France</option>
        </Select>
        <Select name="languages" multiple>
          <option>Italian</option>
          <option>German</option>
          <option>French</option>
        </Select>
      </Form>
    ).toJSON();

    expect(tree.length).toBe(3);

    tree.forEach(child => {
      expect(child.children.length).toBe(3);
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
        <Select name="country" value="Italy">
          <option>Italy</option>
          <option>Germany</option>
          <option>France</option>
        </Select>
      </Form>
    ).toJSON();

    expect(tree.props.name).toBeA("string");
    expect(tree.props.value).toBe("Italy");
    expect(tree.props.onChange).toBeA("function");
    expect(tree.props.onFocus).toBeA("function");
    expect(tree.props.onBlur).toBeA("function");

    await tree.props.onChange({
      target: { value: "France" }
    });

    expect(testValue).toBe("France");
  });

  it("Props Support multiple", async () => {
    let testValue;

    tree = create(
      <Form onFieldChange={({ value }) => (testValue = value)}>
        <Select name="country" multiple value={["Italy"]}>
          <option>Italy</option>
          <option>Germany</option>
          <option>France</option>
        </Select>
      </Form>
    ).toJSON();

    expect(tree.props.name).toBeA("string");
    expect(tree.props.value).toEqual(["Italy"]);
    expect(tree.props.onChange).toBeA("function");
    expect(tree.props.onFocus).toBeA("function");
    expect(tree.props.onBlur).toBeA("function");

    await tree.props.onChange({
      target: { selectedOptions: [{ value: "France" }, { value: "Italy" }] }
    });

    expect(testValue).toEqual(["France", "Italy"]);
  });

  it("onFieldChange", async () => {
    let testValues;
    component = create(
      <Form
        onFieldChange={({ name, value }) => {
          testValues = { name, value };
        }}
      >
        <Select name="country">
          <option>Italy</option>
          <option>Germany</option>
          <option>France</option>
        </Select>
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
        <Select name="country">
          <option>Italy</option>
          <option>Germany</option>
          <option>France</option>
        </Select>
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
        <Select
          name="genre"
          onChange={e => (testValues = e)}
          onFocus={e => (testValues = e)}
          onBlur={e => (testValues = e)}
        >
          <option>Unknown</option>
          <option>Male</option>
          <option>Female</option>
        </Select>
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
