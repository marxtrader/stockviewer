import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import Footer from '../components/Footer'
import Chart from './Charts/Chart'
//import Experiments from './Experiments/Experiments'
//import Form from './Charts/Form'
import "../css/Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  async componentDidMount () {
    if (!this.props.isAuthenticated) {
      return;
    }
    const info = await Auth.currentAuthenticatedUser()
    this.setState({ isLoading: false , userId:info.username});
  }

  renderPromo() {
    return (
      <div className="lander">
      <h1>The Marx Group</h1><br />
      <h2>Old School Principals, New School Technology</h2><br /><br />
      <h3 style={{fontWeight:'bold'}}><i>There is strength in numbers</i></h3>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

        <div>
          <Link to="/login" className="btn btn-primary btn-md">Login</Link>          
          <br /><br />
        </div>
        <Footer />
      </div>
    );
  }

  renderSummary() {
    return (
      <div>
      <Chart />
      {/* <TableData /> */}
      {/* < Experiments /> */}
      {/* < Form /> */}
      </div>
    )
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? (
          this.renderSummary()
          ) : (
            this.renderPromo())}
      </div>
    );
  }
}