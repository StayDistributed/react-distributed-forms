import expect from "expect";
import React from "react";
import { create } from "react-test-renderer";

import { Form, Input, Select } from "src/";
import { Textarea } from "../src";

describe("General", () => {
  let tree;

  it("render a form", () => {
    tree = create(
      <Form>
        <fieldset>
          <legend>Personal Info</legend>
          <div>
            <label>
              First Name <Input type="text" name="firstname" />
            </label>
          </div>
          <div>
            <label>
              Last Name <Input type="text" name="lastname" />
            </label>
          </div>
          <div>
            <label>
              Gender
              <Select name="gender">
                <option>Male</option>
                <option>Female</option>
              </Select>
            </label>
          </div>
          <div>
            <label>
              Password <Input type="password" name="password" />
            </label>
          </div>
        </fieldset>
        <Form binding={{ city: "New York" }}>
          <fieldset>
            <legend>Address</legend>
            <div>
              <label>
                City <Input type="text" name="city" />
              </label>
            </div>
            <div>
              <label>
                Country <Input type="text" name="country" />
              </label>
            </div>
          </fieldset>
        </Form>
        <Form>
          <fieldset>
            <legend>Job</legend>
            <div>
              <label>
                Company <Input type="text" name="company" />
              </label>
            </div>
          </fieldset>
        </Form>
        <Form>
          <fieldset>
            <legend>Job</legend>
            <div>
              <label>
                Bio <Textarea name="bio" />
              </label>
            </div>
          </fieldset>
        </Form>
      </Form>
    ).toJSON();

    expect(tree[0].children).toBeTruthy();
  });
});
