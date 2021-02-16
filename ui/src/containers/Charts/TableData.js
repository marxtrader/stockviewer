import React, {Component} from 'react';
import { Label } from 'reactstrap'
import {Row, Col, Button, Input} from 'reactstrap'
import DatePicker from '../../functions/DatePicker'
import Table from './Table'
import { AvForm, AvGroup} from 'availity-reactstrap-validation';
import Select from 'react-select';
import fetchData from './fetchData'
import config from '../../config'
import axios from 'axios'
import '../table.css'


// let choices = [
//   {label:"Name", value:"Name"},
//   {label:"Day", value:"Day"},
//   {label:"Month",value:"Month"},
//   {label:"Wallet", value:"WalletId"}
// ]

let choices = [
  {label:"Name", value:"Name"},
]

export default class Transactions extends Component {
  constructor(props) {
    super(props);        
    this.initialState = {
      isLoading:true,
      date:"",
      selectedOption:'',
      transactions:[],
      searchType:"",
      name:"",
      walletId:'',
      month:''
    }      
    
    this.state = this.initialState;
    this.submitForm = this.submitForm.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
  }

  async componentDidMount () {
    if (!this.props.isAuthenticated) {
      return;
    }

    this.setState({ isLoading: false });
  }

  submitForm = () => {
    let url;
    let self=this
    let date = this.state.date; let year=''; let month=''; let day='';
    console.log("submit form", this.state.searchType.value)
    switch (this.state.searchType.value) {
      case "Name" :
        let url = `${config.stocks.server}/${this.state.name}`
        console.log("Url : ", url)
        break;
      case "Date" :
        year = date.getFullYear()
        month = date.getMonth()
        day = date.getDate()
        url = `${config.api.server}/transactionsMysql/date?year=${year}&month=${month}&day=${day}`
        console.log("Url : ", url)
        break;
      default:
    }
    try {
      axios({
        method: 'get',
        url: `${config.stocks.server}/${this.state.name}`,
        config: { headers: {'Content-Type': 'application/json' }}
        })
        .then(function (response) {
          //console.log (response)
          console.log(response.data)
          self.setState({transactions:response.data})
        })
        .catch(function (err) {
            console.log(err)
        });
    } catch (e) {
      alert(e);
    }
  }

  validateForm() {
    return (
      this.state.searchType !== "" 
    );
  }

  handleChange = e => {
    const {name, value} = e.target
    this.setState(
      { [name]:value.toUpperCase() }
    );
  };

  handleChangeSelect =(searchType)=>{
    console.log(searchType)
    this.setState({searchType})
  }

  handleMonthChange = (month) => {
    console.log(month)
    this.setState({month})
  }

  handleDateChange = date =>{
    console.log("date : ", date)
    this.setState({
      date: date
    })
  }

  render() {
    return (
      <div>
        <AvForm onSubmit={this.submitForm}>    
          <Row>
            <Col sm={{size:3}}>
              <AvGroup>
                <Label>Search Type</Label>
                <Select 
                  options={choices}
                  onChange={this.handleChangeSelect}
                  value={this.state.searchType}
                  placeholder='Search Type'
                />
              </AvGroup>
            </Col>            
          </Row> 
        {(() => {
          if (this.state.searchType.value === 'Name') {
            return (
                <Row>
                  <Col xs="auto" sm={{size:3}}>
                  <Input name='name' value={this.state.name} onChange={this.handleChange}></Input>
                    {/* <Select 
                      onChange={this.handleNameChange}
                      value={this.state.name}
                      placeholder='Name'
                    /> */}
                  </Col>
                  <Col  xs="3" sm={{size: '3' }}>
                    <Button disabled={!this.validateForm()}>Submit</Button>
                  </Col> 
                </Row>
            )
          } 
        })()}
        </AvForm> 
        <Table transactions={this.state.transactions}/>
      </div>
    );
  }
}
