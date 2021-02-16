import React, {Component} from 'react'
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import {Row, Col, Button, Label} from 'reactstrap'

export default class SearchForm extends Component {
  render() {
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
}