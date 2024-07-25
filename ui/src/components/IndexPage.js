import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  getUsersDataRedux,
  getUserDataRedux,
  resetAllDataRedux,
  deleteEmployeeRedux,
  searchUserByNameRedux,
  searchByLastNameRedux,
} from "../redux/actions/userActions";
import { stringRegexPattern, addASpace } from "../utils";

import "./Index.css";

class IndexPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { firstName: "", lastName: "" };
  }
  componentDidMount() {
    const { data, history, loginSuccess } = this.props;

    if (loginSuccess === false) {
      return history.push("/");
    }

    if (data.length === 0) {
      return this.props.getDataIndexPage();
    }

    return null;
  }

  setInputValue = (e) => {
    const { value, name } = e.target;

    if (name === "name") {
      if (value.length >= 0) {
        const isFirstNameValid = stringRegexPattern.test(value);

        if (isFirstNameValid) {
          return this.setState({
            firstName: value,
          });
        }

        if (isFirstNameValid === false) {
          return this.setState({
            firstName: "",
          });
        }
      }
    }

    if (name === "lastName") {
      if (value.length >= 0) {
        const isLastNameValid = stringRegexPattern.test(value);

        if (isLastNameValid) {
          return this.setState({
            lastName: value,
          });
        }

        if (isLastNameValid === false) {
          return this.setState({
            lastName: "",
          });
        }
      }
    }
  };

  searchForUserByUserName = () => {
    const { firstName, lastName } = this.state;
    const {
      searchUserByNameFuncProp,
      getIndividualUserDataIndexPage,
      searchByLastNameFuncProp,
    } = this.props;

    if (firstName.length === 0) {
      return searchByLastNameFuncProp(lastName);
    }
    if (lastName.length === 0) {
      return searchUserByNameFuncProp(firstName);
    }

    if (firstName.length > 0 && lastName.length > 0) {
      getIndividualUserDataIndexPage(firstName.concat(lastName));
    }
  };

  routeToCreateEmployee = () => {
    const { history } = this.props;
    history.push("/create-employee");
  };

  routeToCreateAdmin = () => {
    const { history } = this.props;
    history.push("/create-admin");
  };

  resetData = () => {
    this.setState({
      firstName: "",
      lastName: "",
    });
    this.props.getDataIndexPage();
  };

  logOutUser = () => {
    const { history, resetAllDataFuncProp } = this.props;
    resetAllDataFuncProp();
    history.push("/");
  };

  deleteUser = (userName) => {
    this.props.deleteEmployeeFuncProp(userName);
    this.setState({
      firstName: "",
      lastName: "",
    });
  };

  render() {
    const { firstName, lastName } = this.state;
    const { loading, data, salariesTotal, getDataIndexPage, userName } =
      this.props;

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
        <div>
          <h1 className="heading-subject">Employee Management Portal</h1>
          <h3 style={{ textAlign: "center" }}>
            Logged In As: {userName.replace(/([a-z])([A-Z])/g, "$1 $2")}
          </h3>
          <div
            className="flex-box-row"
            style={{
              margin: "10px",
              cursor: "pointer",
            }}
          >
            <button
              className="client-button"
              type="button"
              onClick={this.routeToCreateEmployee}
            >
              Create Employee
            </button>
            <button
              className="client-button"
              type="button"
              onClick={this.routeToCreateAdmin}
            >
              Create Admin
            </button>
            <button
              className="client-button"
              type="button"
              onClick={getDataIndexPage}
            >
              Get Data
            </button>
            <button
              type="button"
              className="client-button"
              onClick={this.logOutUser}
            >
              Log Out
            </button>
          </div>
          <div className="flex-box-row">
            <input
              className="search-bar"
              placeholder="Enter first name"
              onChange={this.setInputValue}
              value={firstName}
              name="name"
            />
            <input
              className="search-bar"
              placeholder="Enter Last name"
              onChange={this.setInputValue}
              value={lastName}
              name="lastName"
            />
            <button
              className="client-button"
              type="button"
              onClick={this.searchForUserByUserName}
            >
              Search
            </button>
            <button
              className="client-button"
              type="button"
              onClick={this.resetData}
            >
              Reset
            </button>
          </div>

          <table className="table-data">
            <thead>
              <tr>
                <th>Company Role</th>
                <th>Name</th>
                <th>Last Name</th>
                <th>Personal Email</th>
                <th>Personal Number</th>
                <th>Company Email</th>
                <th>Company Number</th>
                <th>Slack ID</th>
                <th>
                  Salary <br></br> Salaries Total: {salariesTotal}
                </th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((value, i) => {
                  return (
                    <tr key={i}>
                      <td>{value.companyRole}</td>
                      <td>{value.name}</td>
                      <td>{addASpace(value.lastName)}</td>
                      <td>{value.personalEmail}</td>
                      <td>{value.phoneNumber}</td>
                      <td>{value.companyEmail}</td>
                      <td>{value.companyNumber}</td>
                      <td>{value.slackID}</td>
                      <td>{value.salary}</td>
                      <td>
                        <button
                          type="text"
                          className="client-button"
                          style={{ backgroundColor: "red", color: "white" }}
                          onClick={this.deleteUser.bind(this, value.userName)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td>No Data</td>
                  <td>No Data</td>
                  <td>No Data</td>
                  <td>No Data</td>
                  <td>No Data</td>
                  <td>No Data</td>
                  <td>No Data</td>
                  <td>No Data</td>
                  <td>No Data</td>
                  <td>No Data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.userReducer.data,
    userData: state.userReducer.userData,
    loading: state.userReducer.loading,
    loginSuccess: state.userReducer.loginSuccess,
    salariesTotal: state.userReducer.salariesTotal,
    userName: state.userReducer.userName,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDataIndexPage: bindActionCreators(getUsersDataRedux, dispatch),
    getIndividualUserDataIndexPage: bindActionCreators(
      getUserDataRedux,
      dispatch
    ),
    resetAllDataFuncProp: bindActionCreators(resetAllDataRedux, dispatch),
    deleteEmployeeFuncProp: bindActionCreators(deleteEmployeeRedux, dispatch),
    searchUserByNameFuncProp: bindActionCreators(
      searchUserByNameRedux,
      dispatch
    ),
    searchByLastNameFuncProp: bindActionCreators(
      searchByLastNameRedux,
      dispatch
    ),
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(IndexPage)
);
