import React from 'react'
import axios from 'axios'
import config from '../../config'
import Table from './Table'
import '../table.css'

async function getDataAsync(date) {
  let response = axios({
    method: 'get',
    url: `http://localhost:3100/results?date=${date}`, // returns experiment results  
    config: { headers: {'Content-Type': 'application/json' }}
	})
	//console.log(response.data)
  return response
}

export default class Experiments extends React.Component {
  constructor() {
    super();
    this.initialState = {
			isLoading:true,
			transactions:[],
      selectedOption:'',
      options:[]
    }
    this.state = this.initialState
  }
  // fetchOptions = (date) => {
  //   fetch(`${config.api.server}/transactionsMysql/dates?date=${date}`)
  //   .then(response => response.json())
  //   .then(data => {
  //     this.setState({
  //       transactions:data,
  //     })
  //     console.log("Data: ", data)
  //   });
	// }
	
	async componentDidMount() {
		let data = await getDataAsync("2020-12-30")
		console.log(data)
		this.setState({transactions:data.data})
    // .then(function (response) {
		// 	if (response == null) {
		// 		console.log("response is null")
		// 	} else {
		// 		//console.log(response.data)
		// 		self.setState({transactions:response.data})
		// 	}			
    // });
	}

  // handleChange = selectedOption => {
  //   this.setState(
  //     { selectedOption },
  //     () => console.log(`Option selected:`, this.state.selectedOption)
  //   );
  //   this.fetchData(selectedOption.value)
  // };

  render() {
    return(
      <div className="App">
        <Table transactions={this.state.transactions}/>
      </div>
    )
  }
}