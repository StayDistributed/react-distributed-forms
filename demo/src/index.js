import React, { Component } from "react";
import { render } from "react-dom";

import { Form, Input, Select, Button } from "../../src";

class Demo extends Component {
  state = {
    all: {
      firstname: ""
    },
    job: {
      developer: 1,
      company: "Google"
    },
    privacy: {
      privacy_agreement_type: "partially"
    }
  };

  onChange = (name, value) => {
    this.setState(({ all, job }) => ({
      all: {
        ...all,
        gender: "Male",
        [name]: value
      },
      job: {
        ...job,
        developer: false
      }
    }));
  };

  onJobFormFieldChange = (name, value) => {
    this.setState(({ job }) => ({
      job: {
        ...job,
        [name]: value
      }
    }));
  };

  onAddressFormFieldChange = (name, value) => {
    this.setState(({ address }) => ({
      address: {
        ...address,
        [name]: value
      }
    }));
  };

  onPrivacyFormFieldChange = (name, value) => {
    this.setState(({ privacy }) => ({
      privacy: {
        ...privacy,
        privacy_agreement_type: "totally",
        [name]: value
      }
    }));
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
          onFieldChange={this.onChange}
          onFieldDidChanged={this.autoSave}
          onSubmit={this.autoSave}
          binding={this.state.all}
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
          <Form onFieldChange={this.onAddressFormFieldChange}>
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
          <Form
            onFieldChange={this.onJobFormFieldChange}
            binding={this.state.job}
          >
            <fieldset>
              <legend>Job Info</legend>
              <div>
                <label>
                  I'm a developer <Input type="checkbox" name="developer" />
                </label>
              </div>
              <div>
                <label>
                  Company Name
                  <Input type="text" name="company" />
                </label>
              </div>
            </fieldset>
          </Form>
          <Form
            onFieldChange={this.onPrivacyFormFieldChange}
            stopPropagation
            binding={this.state.privacy}
          >
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
          </Form>

          <Button>Submit</Button>
        </Form>
        <pre>All: {JSON.stringify(this.state.all, "", 2)}</pre>
        <pre>Address: {JSON.stringify(this.state.address, "", 2)}</pre>
        <pre>Job: {JSON.stringify(this.state.job, "", 2)}</pre>
        <pre>Privacy: {JSON.stringify(this.state.privacy, "", 2)}</pre>

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
