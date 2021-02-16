import React, {Component} from 'react';
import { Label } from 'reactstrap'
import {Row, Col, Button, Input} from 'reactstrap'
import { AvForm, AvGroup} from 'availity-reactstrap-validation';
import Select from 'react-select';
import '../table.css'

export default class Form extends Component {
  constructor(props) {
    super(props);        
  }

  async componentDidMount () {

		this.setState({ isLoading: false });
  }

  render() {
    console.log("Props : ", this.props)
    return (
      <div>
        <AvForm onSubmit={this.props.submitForm}>    
          <Row>
            <Col sm={{size:3}}>
              <AvGroup>
                <Label>Names</Label>
                <Select 
                  options={this.props.namesOptions}
                  onChange={this.props.handleChangeSelect}
                  value={this.props.searchType}
                  placeholder='Name'
                />
              </AvGroup>
            </Col>   
						<Col sm={{size:3}}>
              <AvGroup>
                <Label>Date</Label>
                <Select 
                  options={this.props.datesOptions}
                  onChange={this.props.handleChangeSelect}
                  value={this.props.searchType}
                />
              </AvGroup>
            </Col>  
						<Col sm={{size:3}}>
              <AvGroup>
                <Label>Stocks</Label>
                <Select 
                  options={this.props.tickersOptions}
                  onChange={this.props.handleChangeSelect}
                  value={this.props.searchType}
                  placeholder='Ticker'
                />
              </AvGroup>
            </Col>           
          </Row> 
        </AvForm> 
      </div>
    );
  }
}
