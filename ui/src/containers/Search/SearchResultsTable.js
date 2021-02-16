import React from 'react';
import {Button} from 'reactstrap'

import '../table.css'

const TableHeader = () => {   
  return (
    <thead>
      <tr>
        <th>Id</th>
        <th>Name</th>
        <th>Wallet</th>
        <th>Phone</th>
        <th>Email</th>
      </tr>   
    </thead>
  );
}

const TableBody = props => { 

    let style = {}

    const rows = props.transactions.map((row, index) => {    

      return (
        <tr key={index} style={style}>  

          <td>{row.id}</td>   
          <td>{row.NAME}</td>               
          <td>{row.LOGIN}</td>
          <td>{row.PHOME}</td>
          <td>{row.EMAIL}</td>
          <td>
            <Button size="sm" onClick={() => props.handleSubmit(row, index)}>use</Button>  
          </td>
        </tr>
      );
    });

    return <tbody>{rows}</tbody>;
}

const SearchResultsTable = (props) => {

  return (
    <div>
      <p style={{fontSize:'24px', fontWeight:'bold'}}>Wired Funds</p>
      <table>
        <TableHeader />
        <TableBody 
          transactions={props.transactions} 
        />
      </table>
    </div>
  );
}

export default SearchResultsTable;