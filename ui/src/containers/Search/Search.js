import React, {Component} from 'react';
import { Label } from 'reactstrap'
import {Row, Col, Button} from 'reactstrap'
import SearchResultsTable from './SearchResultsTable'
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import config from '../../config'

import "../TransactionDataForm.css"

export default class Forms extends Component {
  constructor(props) {
    super(props);        
    this.initialState = {
      isLoading:true,
      name:"",
      walletId:"",
      isSearch:false
    }      
    
    this.state = this.initialState;
    this.submitForm = this.submitForm.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  validateForm() {
    return (this.state.name.length > 0 || this.state.walletId.length === 7)
  }

  async componentDidMount () {
    if (!this.props.isAuthenticated) {
      return;
    }

    this.setState({ isLoading: false });
  }

  submitForm = () => {
    let url=''
    if (this.state.name) {
      url = `${config.api.server}/lucror/name?value=${this.state.name}`
    } else {
      url = `${config.api.server}/lucror/walletId?value=${this.state.walletId}`
    }
    fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log("response: ", data)
      this.setState({transactions:data, isSearch:true})
    })
    .catch(err => console.log(err));
    this.setState(this.initialState)
  }

  handleChange = event => {      
      const { name, value } = event.target;
      //console.log(name, value)
      this.setState({
          [name] : value
      });
  }            

  renderTable() {
    return(
      <div>
        <AvForm onSubmit={this.submitForm}>    
          <Row>
            <Col sm={{size:2}}>
              <AvGroup>
                <Label for="walletId">Wallet</Label>
                {/* Ideally, by selecting the walletId, we do a member db lookup for account and routing. */}
                <AvInput name="walletId" id="walletId" value={this.state.walletId}  onChange={this.handleChange} />
              </AvGroup>
            </Col>
            
            <Col sm={{size:2}}>
              <AvGroup>
                <Label for="name">Name</Label>
                <AvInput name="name" value={this.state.name} id="name" required onChange={this.handleChange}  />
              </AvGroup>
            </Col>
            

            <Col sm={{size:1}}>
              <AvGroup>
                <Label>Submit</Label>
                <Button disabled={!this.validateForm()}>Submit</Button>
              </AvGroup>
            </Col>
          </Row>
        </AvForm> 
        <SearchResultsTable transactions={this.state.transactions} /> 
      </div>
    )
  }

  renderForm () {
    return (      
      <AvForm onSubmit={this.submitForm}>    
        <Row>
          <Col sm={{size:2}}>
            <AvGroup>
              <Label for="walletId">Wallet</Label>
              {/* Ideally, by selecting the walletId, we do a member db lookup for account and routing. */}
              <AvInput name="walletId" id="walletId" value={this.state.walletId}  onChange={this.handleChange} />
            </AvGroup>
          </Col>
          
          <Col sm={{size:2}}>
            <AvGroup>
              <Label for="name">Name</Label>
              <AvInput name="name" value={this.state.name} id="name" required onChange={this.handleChange}  />
            </AvGroup>
          </Col>
          

          <Col sm={{size:1}}>
            <AvGroup>
              <Label>Submit</Label>
              <Button disabled={!this.validateForm()}>Submit</Button>
            </AvGroup>
          </Col>
        </Row>
      </AvForm> 
    )
  }

  render() {
    //const { walletId, amount, name, email } = this.state; 
    return (
      <div>
        {this.state.isSearch ? (
          this.renderTable()
          ) : (
          this.renderForm())}
      </div>
    );
  }
}
