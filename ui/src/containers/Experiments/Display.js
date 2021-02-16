import React from 'react'
import shortid from 'shortid'
import DatePicker from '../DatePicker'
import axios from 'axios'
import config from '../../config'
import calculateFee from '../../functions/calculateFee'
import { Label } from 'reactstrap'
import {Row, Col, Button} from 'reactstrap'
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import '../table.css'

function NWC(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function getDataAsync(symbol) {
  let response = axios({
    method: 'get',
    url: `http://localhost:3100/${symbol}`, // gets all the records for a particular stock. 
    config: { headers: {'Content-Type': 'application/json' }}
  })
  return response
}

export default class Display extends React.Component {
  constructor() {
    super();
    this.initialState = {
	  isLoading:true,
	  transactions:[]
	}
    this.state = this.initialState
    this.handleChange = this.handleChange.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
		this.handleFormSubmit = this.handleFormSubmit.bind(this)
		this.getDataSync = this.getDataSync.bind(this)
  };

  async componentDidMount() {
		this.setState({ isLoading: false });
		getDataAsync(query)
    .then(function (response) {
			this.setState({transactions:response.data})
    });
  }

  handleChange = (e) => {
    let input = e.target;
    let name = e.target.name;
    let value = input.value;
    console.log(name, value)
    this.setState({
      [name]: value
    })
  };

  handleDateChange = date =>{
    console.log(date)
    this.setState({
      date: date
    })
  }

  render() {
    return (
      <div className="App">
        {/* <Form 
          handleFormSubmit={ this.handleFormSubmit } 
          handleChange={ this.handleChange } 
          handleDateChange = { this.handleDateChange }
          newWalletId={this.state.walletId }
          newAmount={this.state.amount }
          newName={this.state.name }
          newBankAccountNumber={this.state.bankAccountNumber}
          newBankRoutingNumber={this.state.bankRoutingNumber }
        /> */}
        <CreditsTable 
          transactions={ this.state.transactions }
        />
      </div>
    );
  }
}

const TransTableHeader = (props) => {   
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>date</th>
        <th>Routing Num</th>
        <th>Account Num</th>
        <th>Fee</th>
        <th>Net</th>
        <th>Approve</th>
      </tr>   
    </thead>
  );
}

const TransTableBody = props => { 
  props.transactions.sort(function(a, b){
    return a.paid-b.paid
  })
    let style = {}

    const rows = props.transactions.map((row, index) => {    
      row.fee = parseFloat(row.fee)
      row.amount = parseFloat(row.amount)
      let hidebutton=false
      if (row.paid === 1) {
        hidebutton = true
      }
      if (row.amount < 0) {
        style={color:'red'}
      } else {
        style={color:'black'}
      }
      return (
        <tr key={index} style={style}>     
          <td>{row.name}</td>          
          <td>{NWC(row.amount)}</td>       
          <td>{row.bankRoutingNumber}</td>
          <td>{row.bankAccountNumber}</td>
          <td>{NWC(row.fee)}</td>
          <td>{NWC((row.amount-row.fee).toFixed(2))}</td>
          <td>
            {hidebutton ? "Paid" : <Button size="sm" onClick={() => props.handleApprove(row, index)}>post</Button>}    
          </td>
        </tr>
      );
    });

    return <tbody>{rows}</tbody>;
}
