import React from 'react'
const TableHeader = (props) => {   
  return (
    <thead>
      <tr>
        <th>Symbol</th>
        <th>Date</th>
        <th>Name</th>
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
        <td>{row.symbol}</td>          
        <td>{row.date}</td>       
        <td>{row.name}</td>
      </tr> 
    );
  });

  return <tbody>{rows}</tbody>;
}

export default class Table extends React.Component {
  render() {
    return (
      <div>
        <p style={{fontSize:'24px', fontWeight:'bold'}}>Results</p>
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