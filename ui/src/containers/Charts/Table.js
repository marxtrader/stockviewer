import React from 'react';
import {Button} from 'reactstrap'

import '../table.css'

const TableHeader = () => {   
  return (
    <thead>
      <tr>
        <th>Open</th>
        <th>High</th>
        <th>Low</th>
        <th>Close</th>
        <th>Range</th>
        <th>Volume</th>
        <th>Weighted</th>
        <th>Cnt</th>
        <th>Date</th>
      </tr>   
    </thead>
  );
}

const TableBody = props => { 
  let style = {}
  const rows = props.transactions.map((row, index) => {    
    return (
      <tr key={index} style={style}>  
        <td>{row.o}</td>   
        <td>{row.h}</td>               
        <td>{row.l}</td>
        <td>{row.c}</td>
        <td>{(row.h-row.l).toFixed(2)}</td>
        <td>{row.v}</td>
        <td>{row.vw}</td>
        <td>{row.n}</td>
        <td>{row.d}</td>
        {/* <td>
          <Button size="sm" onClick={() => props.handleSubmit(row, index)}>use</Button>  
        </td> */}
      </tr>
    );
  });
  return <tbody>{rows}</tbody>;
}

const Table = (props) => {
  return (
    <div>
      <p style={{fontSize:'24px', fontWeight:'bold'}}>Chart</p>
      <table className="ReactTable">
        <TableHeader />
        <TableBody 
          transactions={props.transactions} 
        />
      </table>
    </div>
  );
}

export default Table;