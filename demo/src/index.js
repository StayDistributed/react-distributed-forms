import React, { Component } from "react";
import { render } from "react-dom";

import { Form, Input, Select, Textarea, Button } from "../../src";
import "./index.css";

class Demo extends Component {
  state = {
    firstname: "George",
    job: {
      developer: 1,
      company: "Google"
    },
    privacy: {
      privacy_agreement_type: "partially"
    }
  };

  autoSave = () => {
    this.setState({ callingServer: true }, () =>
      setTimeout(() => {
        this.setState({ callingServer: false });
      }, 800)
    );
  };

  render() {
    return (
      <div>
        <h1>react-distributed-forms Demo</h1>
        <Form
          onFieldDidChanged={this.autoSave}
          onSubmit={this.autoSave}
          binding={this}
        >
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
          <Form>
            <fieldset>
              <legend>Address</legend>
              <div>
                <label>
                  City <Input type="text" name="city" />
                </label>
              </div>
              <div>
                <label>
                  Country <Input type="text" name="country" list="countries" />
                  <datalist id="countries">
                    <option value="Italy" />
                    <option value="European Country" />
                    <option value="Other" />
                  </datalist>
                </label>
              </div>
            </fieldset>
          </Form>
          <Form binding={[this, "job"]}>
            <fieldset>
              <legend>Job Info</legend>
              <div>
                <label>
                  I'm a developer <Input type="checkbox" name="developer" />
                </label>
              </div>
              <div>
                <label>
                  Programming languages
                  <Select name="programming-languages" multiple>
                    <optgroup label="Compiled">
                      <option>Java</option>
                      <option>C</option>
                      <option>Obj-C</option>
                    </optgroup>
                    <optgroup label="Interpreted">
                      <option>Javascript</option>
                      <option>Ruby</option>
                      <option>PHP</option>
                    </optgroup>
                  </Select>
                </label>
              </div>
              <div>
                <label>
                  Company Name
                  <Input type="text" name="company" />
                </label>
              </div>
              <div>
                <label>
                  Best Job Experience (short story)
                  <Textarea
                    name="experience"
                    value={`Best Job experience when I worked for
and I build`}
                  />
                </label>
              </div>
            </fieldset>
          </Form>
          <Form stopPropagation binding={[this, "privacy"]}>
            <fieldset>
              <legend>Privacy</legend>
              <div>
                <label>
                  I agree <Input type="checkbox" name="privacy_agreement" />
                </label>
              </div>
              <div>
                <label>
                  totally{" "}
                  <Input
                    type="radio"
                    name="privacy_agreement_type"
                    value="totally"
                  />
                </label>
              </div>
              <div>
                <label>
                  partially{" "}
                  <Input
                    type="radio"
                    name="privacy_agreement_type"
                    value="partially"
                  />
                </label>
              </div>
            </fieldset>
            <fieldset>
              <legend>Unset Radios</legend>
              <div>
                <label>
                  value1{" "}
                  <Input type="radio" name="unset_radio" value="value1" />
                </label>
              </div>
              <div>
                <label>
                  value2{" "}
                  <Input type="radio" name="unset_radio" value="value2" />
                </label>
              </div>
            </fieldset>
          </Form>

          <Button>Submit</Button>
        </Form>
        <pre>state: {JSON.stringify(this.state, "", 2)}</pre>

        {this.state.callingServer && (
          <div
            id="autosaving"
            style={{
              position: "fixed",
              right: 0,
              top: 0,
              background: "#f00",
              padding: 20
            }}
          >
            Saving...
          </div>
        )}
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
