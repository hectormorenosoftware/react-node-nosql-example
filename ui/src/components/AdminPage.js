import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  createAdminRedux,
  resetMessageRedux,
} from "../redux/actions/userActions";
import {
  stringRegexPattern,
  lastNameRegexPattern,
  passwordRegexPattern,
} from "../utils";

class AdminPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      lastName: "",
      userName: "",
      password: "",
      admin: "true",
      isNameValid: true,
      isLastNameValid: true,
      isPasswordValid: true,
      formErrors: false,
    };
  }

  componentDidMount() {
    const { loginSuccess, history } = this.props;

    if (loginSuccess === false) {
      return history.push("/");
    }
  }

  onChangeSetValue = (e) => {
    const { resetMessagePropFunc } = this.props;
    const { value, name } = e.target;

    if (name === "name") {
      const isValid = stringRegexPattern.test(value);
      if (isValid) {
        this.setState({
          [name]: value,
          isNameValid: true,
          formErrors: false,
        });
      }
      if (isValid === false) {
        this.setState({
          [name]: "",
          isNameValid: false,
        });
      }
    }

    if (name === "lastName") {
      const isValid = lastNameRegexPattern.test(value);
      if (isValid) {
        this.setState({
          [name]: value,
          isLastNameValid: true,
          formErrors: false,
        });
      }
      if (isValid === false) {
        this.setState({
          [name]: "",
          isLastNameValid: false,
        });
      }
    }

    if (name === "password") {
      const isValid = passwordRegexPattern.test(value);
      if (isValid) {
        this.setState({
          [name]: value,
          isPasswordValid: true,
          formErrors: false,
        });
      }
      if (isValid === false) {
        this.setState({
          [name]: "",
          isPasswordValid: false,
        });
      }
    }

    return resetMessagePropFunc();
  };

  goBackToEmployees = () => {
    const { history, resetMessagePropFunc } = this.props;
    resetMessagePropFunc();
    history.push("/employees");
  };

  createAdminFunc = () => {
    const { name, lastName, password } = this.state;
    const { createAdminPropFunc, resetMessagePropFunc } = this.props;

    if (name.length === 0 || lastName.length === 0 || password.length === 0) {
      return this.setState({
        formErrors: true,
      });
    }
    resetMessagePropFunc();
    createAdminPropFunc(
      name,
      lastName.replace(/\s+/g, ""),
      name + lastName.replace(/\s+/g, ""),
      password,
      "true"
    );
    this.setState({
      name: "",
      lastName: "",
      userName: "",
      password: "",
      admin: "true",
      isNameValid: true,
      isLastNameValid: true,
      isPasswordValid: true,
    });
  };

  render() {
    const {
      name,
      lastName,
      password,
      isNameValid,
      isLastNameValid,
      isPasswordValid,
      formErrors,
    } = this.state;
    const { loading, createAdminMessage } = this.props;

    if (loading === true) {
      return (
        <div className="Hero" id="hero-height">
          <div className="HeroGroup" id="hero-group-height">
            <p>Loading please wait ...</p>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h1 id="align-text">Create Admin</h1>
        <h3 className="form-warning" id="align-text">
          Remember the username will be the first and last name of the person
          without spaces for example: JohnRafford
        </h3>
        <h3 className="form-warning" id="align-text">
          {createAdminMessage.length > 0 ? createAdminMessage : ""}
        </h3>
        <div className="flexbox-column">
          <p className="form-warning" id="align-text">
            {name.length > 0 && lastName.length > 0
              ? `Username: ${name + lastName.replace(/\s+/g, "")}`
              : null}{" "}
          </p>
          <input
            type="text"
            name="name"
            id="admin-page-adjustment"
            className="search-bar"
            placeholder="Enter a name"
            onChange={this.onChangeSetValue}
            value={name}
          />
          {isNameValid === false ? (
            <p className="form-errors">
              Name can not contain numbers or special characters.
            </p>
          ) : null}
          <input
            type="text"
            name="lastName"
            id="admin-page-adjustment"
            className="search-bar"
            placeholder="Enter a last name"
            onChange={this.onChangeSetValue}
            value={lastName}
          />
          {isLastNameValid === false ? (
            <p className="form-errors">
              Last Name can not contain numbers or special characters.
            </p>
          ) : null}
          <input
            type="text"
            name="password"
            id="admin-page-adjustment"
            className="search-bar"
            placeholder="Enter a password"
            onChange={this.onChangeSetValue}
            value={password}
          />
          {isPasswordValid === false ? (
            <p className="form-errors">
              Password can not be more than 21 characters or contain special
              characters.
            </p>
          ) : null}
          {formErrors ? (
            <p className="form-errors">
              You need a name, last name, and password to be able to submit this
              form.
            </p>
          ) : null}
          <button
            type="button"
            className="client-button"
            onClick={this.createAdminFunc}
          >
            Create Admin
          </button>
          <button
            type="button"
            className="client-button"
            onClick={this.goBackToEmployees}
            style={{ marginTop: "5px" }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.userReducer.loading,
    createAdminMessage: state.userReducer.createAdminMessage,
    loginSuccess: state.userReducer.loginSuccess,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createAdminPropFunc: bindActionCreators(createAdminRedux, dispatch),
    resetMessagePropFunc: bindActionCreators(resetMessageRedux, dispatch),
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminPage)
);
