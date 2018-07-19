import React from "react";
import expect from "expect";
import { create } from "react-test-renderer";

import { Form, Button } from "../src/";

describe("Button", () => {
  let tree;
  let component;

  it("Mount", () => {
    tree = create(
      <div>
        <Button name="submit">Submit</Button>
        <Button name="cancel">Cancel</Button>
      </div>
    ).toJSON();

    expect(tree.children.length).toBe(2);

    tree.children.forEach(child => {
      expect(child.children).toBeTruthy();
      expect(child.props.name).toBeA("string");
      expect(child.props.onClick).toBeA("function");
      expect(child.props.onFocus).toBeA("function");
      expect(child.props.onBlur).toBeA("function");
    });
  });

  it("Form onSubmit onFieldFocus onFieldBlur", async () => {
    let testValues;

    component = create(
      <Form
        onSubmit={e => (testValues = e)}
        onFieldFocus={e => (testValues = e)}
        onFieldBlur={e => (testValues = e)}
      >
        <Button name="submit" />
      </Form>
    );
    tree = component.toJSON();

    await tree.props.onClick({
      target: { name: tree.props.name }
    });

    expect(testValues).toBeTruthy();
    expect(testValues.name).toBe("submit");

    await tree.props.onFocus({
      target: { name: tree.props.name }
    });

    expect(testValues).toBeTruthy();
    expect(testValues.name).toBe("submit");

    await tree.props.onBlur({
      target: { name: tree.props.name }
    });

    expect(testValues).toBeTruthy();
    expect(testValues.name).toBe("submit");
  });

  it("onFocus onClick onBlur", async () => {
    let testValues;

    component = create(
      <Form>
        <Button
          name="submit"
          onClick={e => (testValues = e)}
          onFocus={e => (testValues = e)}
          onBlur={e => (testValues = e)}
        />
      </Form>
    );
    tree = component.toJSON();

    await tree.props.onClick({
      target: { name: tree.props.name }
    });

    expect(testValues).toBeTruthy();
    expect(testValues.target).toBeTruthy();
    expect(testValues.target.name).toBe("submit");

    await tree.props.onFocus({
      target: { name: tree.props.name }
    });

    expect(testValues).toBeTruthy();
    expect(testValues.target).toBeTruthy();
    expect(testValues.target.name).toBe("submit");

    await tree.props.onBlur({
      target: { name: tree.props.name }
    });

    expect(testValues).toBeTruthy();
    expect(testValues.target).toBeTruthy();
    expect(testValues.target.name).toBe("submit");
  });
});
