import React from 'react'
import shortid from 'shortid'
import DatePicker from '../DatePicker'
import axios from 'axios'
import config from '../../config'
import calculateFee from '../../functions/calculateFee'
import { Label } from 'reactstrap'
import {Row, Col, Button} from 'reactstrap'
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import Select from 'react-select'
import '../table.css'

export default class Stocks extends React.Component {
  constructor() {
    super();
    this.initialState = {
      isLoading:true,
      selectedOption:'',
      options:[]
    }
    this.state = this.initialState
  }
  fetchOptions = (date) => {
    fetch(`${config.api.server}/transactionsMysql/dates?date=${date}`)
    .then(response => response.json())
    .then(data => {
      this.setState({
        transactions:data,
      })
      console.log("Data: ", data)
    });
  }

  fetchData= (data) => {
    fetch(`${config.api.server}/bs?query=${data}`)
    .then(response => response.json())
    .then(data => {
      this.setState({
        transactions:data,
      })
      console.log("Data: ", data)
    });
  }

  handleChange = selectedOption => {
    this.setState(
      { selectedOption },
      () => console.log(`Option selected:`, this.state.selectedOption)
    );
    this.fetchData(selectedOption.value)
  };

  render() {
    return(
      <div className="App">
        {/* <Form 
          onClickHandler={this.onClickHandler}
          onChangeHandler={this.onChangeHandler}
        /> */}
        <Row>
          <Col sm={{size:3}}>
            <Select
              placeholder="Filter By.."
              value={this.state.selectedOption}
              onChange={this.handleChange}
              options={this.state.options}
            />
          </Col>
        </Row>
        <Table 
          transactions={ this.state.transactions }
        />
      </div>
    )
  }
}

const TableHeader = (props) => {   
  return (
    <thead>
      <tr>
        <th>Date</th>
        <th>Type</th>
        <th>Description</th>
        <th>Amount</th>
      </tr>   
    </thead>
  );
}

const TableBody = props => { 
  // props.transactions.sort(function(a, b){
  //   return a.paid-b.paid
  // })
  let style = {}

  const rows = props.transactions.map((row, index) => {    
    return (
      <tr key={index} style={style}>     
        <td>{row.Date}</td>          
        <td>{row.Type}</td>       
        <td>{row.Description}</td>
        <td>{row.Amount}</td>
      </tr>
    );
  });

  return <tbody>{rows}</tbody>;
}

class Table extends React.Component {
  render() {
    return (
      <div>
        <p style={{fontSize:'24px', fontWeight:'bold'}}>Bank</p>
        <table>
          <TableHeader />
          <TableBody 
            transactions={this.props.transactions}                        
          />
        </table>
      </div>
    );
  }
}

// class Form extends React.Component {
//   render() {
//     return (
//       <div>
//         <h3 style={{textAlign:'left'}}><strong>Upload Bank</strong></h3>
//         <form>
//           <div>
//             <label>Select Day:</label>
//             <input type="file" name="file" onChange={this.props.onChangeHandler}/>
//           </div>
//           <div>
//           <button type="button" className="btn btn-success btn-block" onClick={this.props.onClickHandler}>Upload</button> 
//           </div>
//         </form>
//         <br />
//       </div>
//     );
//   }
// }