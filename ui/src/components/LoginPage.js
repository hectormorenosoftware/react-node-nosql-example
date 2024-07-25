import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { loginRedux } from "../redux/actions/userActions";
import { stringRegexPattern, passwordRegexPattern } from "../utils";

class LoginPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      displayPassword: false,
      isUserNameValid: true,
      isPasswordValid: true,
    };
  }

  componentDidUpdate() {
    const { loginSuccess, history } = this.props;
    if (loginSuccess === true) {
      history.push("/employees");
    }
  }

  setInputValue = (e) => {
    const { name, value } = e.target;

    if (name === "username") {
      const isUserNameValid = stringRegexPattern.test(value);
      if (isUserNameValid) {
        return this.setState({
          userName: value,
          isUserNameValid: true,
        });
      }
      if (isUserNameValid === false) {
        return this.setState({
          userName: "",
          isUserNameValid: false,
        });
      }
    }
    if (name === "password") {
      const isPasswordValid = passwordRegexPattern.test(value);
      if (isPasswordValid) {
        return this.setState({
          password: value,
          isPasswordValid: true,
        });
      }
      if (isPasswordValid === false) {
        return this.setState({
          password: "",
          isPasswordValid: false,
        });
      }
    }
  };

  showPassword = () => {
    const { displayPassword } = this.state;
    this.setState({
      displayPassword: !displayPassword,
    });
  };

  loginFunc = () => {
    const { userName, password } = this.state;

    if (userName.length === 0 || password.length === 0) {
      return null;
    }

    if (userName.length > 0 && password.length > 0) {
      return this.props.loginToAccounts(userName, password);
    }
  };

  render() {
    const {
      userName,
      password,
      displayPassword,
      isUserNameValid,
      isPasswordValid,
    } = this.state;
    const { loading } = this.props;

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
      <React.Fragment>
        <h1 id="align-text">Management Login Portal</h1>
        <div className="flexbox-column">
          <input
            className="search-bar margin-create-employee-fields"
            id="width-login-username"
            type="text"
            name="username"
            onChange={this.setInputValue}
            placeholder="Enter your username"
            value={userName}
          />
          {isUserNameValid === false ? (
            <p className="form-errors">
              Username can not contain numbers or special characters.
            </p>
          ) : null}
          <input
            className="search-bar margin-create-employee-fields"
            id="width-login-password"
            type={displayPassword ? "text" : "password"}
            name="password"
            onChange={this.setInputValue}
            placeholder="Enter your password"
            value={password}
          />
          {isPasswordValid === false ? (
            <p className="form-errors">
              Password can not contain special characters.
            </p>
          ) : null}
          <div className="flexbox-column">
            <button
              className="client-button margin-create-employee-fields"
              type="button"
              onClick={this.showPassword}
            >
              {displayPassword ? "Hide Password" : "Show Password"}
            </button>
            <button
              className="client-button margin-create-employee-fields"
              type="button"
              onClick={this.loginFunc}
            >
              Login
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.userReducer.loading,
    loginSuccess: state.userReducer.loginSuccess,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loginToAccounts: bindActionCreators(loginRedux, dispatch),
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LoginPage)
);
