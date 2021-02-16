import React, { Component } from 'react';
import './App.css';
import SingleSeriesChart from './SingleSeriesChart'
//import Table from './Table'
//import Form from './Form'
import config from '../../config'
import axios from 'axios'
import { Label, Row, Col, Nav, NavLink, NavItem, Button } from 'reactstrap'
import { AvForm, AvGroup } from 'availity-reactstrap-validation';
import Select from 'react-select';
import {Query} from './Query';

let priceBandsOptions = [
  { "label": "1-10", "value": "10" },
  { "label": "10-20", "value": "20" },
  { "label": "20-30", "value": "30" },
  { "label": "30-40", "value": "40" }
]
const ChartFilters = {
  close: { label: "Price Band", step: 500 },
  name: { label: "Names" },
  date: { label: "Date" }
}
const DeleteIcon = ({ size = 20, onClick }) => <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-x" width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <line x1="18" y1="6" x2="6" y2="18" />
  <line x1="6" y1="6" x2="18" y2="18" />
</svg>
const RangeLabel = o => o.all ? 'All' : `${o.$gte} - ${o.$lte}`
const SelectLabel = o => o.all ? 'All' : o.label
const RangeSelected = isSelected((a, b) => a.$gte == b.$gte && a.$lte == b.$lte)
const OptionSelected = isSelected((a, b) => a.label == b.label)

// const OpSelected = isSelected()
function isSelected(match = (a, b) => a == b) {
  return (objectToTest, selected) => selected.find(other => (objectToTest.all && other.all) || match(other, objectToTest)) != null
}

function getRangeOptions(vals, step = 1) {
  // const options = [{ all: true }]
  const options = []
  if (vals.length == 0) return [] //return options
  const sorted = vals.sort((a, b) => a - b)
  const minMultiple = Math.floor(sorted[0] / step) * step
  const maxMultiple = Math.ceil(sorted[sorted.length - 1] / step) * step

  const seenMins = {}
  let nextMultiple = minMultiple
  for (const val of sorted) {
    const rangeMin = Math.floor(val / step) * step
    if (!seenMins[rangeMin]) {
      options.push({ $gte: rangeMin, $lte: rangeMin + step })
      // options.push({ min: rangeMin, max: rangeMin + step })
      seenMins[rangeMin] = true
    }
  }

  // for (let min = minMultiple, max = min + step; max < maxMultiple; min += step, max += step) {
  //   options.push({ min, max })
  // }
  console.log(options)
  return options
}
getRangeOptions([1, 101], 10)
async function getTickerOptions(date, name = '', priceBand = '') {
  let response = await axios({
    method: 'get',
    url: `${config.stocks.options}/tickers?date=${date}&name=${name}&price=${priceBand}`,
    config: { headers: { 'Content-Type': 'application/json' } }
  })
  console.log("response: ", response)
  return response
}

async function getSelectOptions(route) {
  let response = await axios({
    method: 'get',
    url: `${config.stocks.options}/${route}`,
    config: { headers: { 'Content-Type': 'application/json' } }
  })
  return response
}
async function getOptions(filters, options) {
  const ops = []

  if (filters != null)
    ops.push(`filters=${encodeURIComponent(JSON.stringify(filters))}`)
  if (options != null)
    ops.push(`options=${encodeURIComponent(JSON.stringify(options))}`)

  let response = await axios({
    method: 'get',
    url: `${config.stocks.options}/filter?${ops.join('&')}`,
    config: { headers: { 'Content-Type': 'application/json' } }
  })
  return response
}
// getOptions({ name: "3daysup" }, ['ticker', 'date'])

// async function getTableData(ticker) {
//   let response = await axios({
//     method: 'get',
//     url: `${config.stocks.eod}/${ticker}`, // gets all the records for a particular stock. 
//     config: { headers: {'Content-Type': 'application/json' }}
//   })
//   //console.log("response : ",response)
//   return response
// }

// async function createUrl(params) {
//   let url=''
//   switch (params.type) {
//     case 0 :
//       url=`config.stocks.results?date=${params.date}&name=${[params.name]} `
//       break;
//     case 1 :
//       url = `${config.stocks.eod}/${params.ticker}`
//       break;
//     default:
//   }
// }

// async function getDataAsync(symbol) {
//   let response = axios({
//     method: 'get',
//     url: `${config.stocks.eod}/${symbol}`, // gets all the records for a particular stock. 
//     config: { headers: {'Content-Type': 'application/json' }}
//   })
//   //console.log(response)
//   return response
// }

// async function getChartData(ticker) {
//   //ticker=ticker.toUpperCase()
//   let response = await axios({
//     method: 'get',
//     url: `http://localhost:3100/eod/${ticker}`, // gets all the records for a particular stock. 
//     config: { headers: {'Content-Type': 'application/json' }}
//   })
//   return response
// }

class Chart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      ticker: "",
      query: "",
      byName: "",
      byDate: "",
      byTicker: "",
      byPrice: "",
      namesOptions: [],
      tickersOptions: [],
      datesOptions: [],
      priceBandsOptions: [],

      options: {},
      allOptions: {},
      displayOptions: {},

      filters: {}
    }
    this.handleDateChange = this.handleDateChange.bind(this)
    //this.handleChangeSelect = this.handleChangeSelect.bind(this)
    this.tickersChangeSelect = this.tickersChangeSelect.bind(this)
    this.datesChangeSelect = this.datesChangeSelect.bind(this)
    this.nameChangeSelect = this.namesChangeSelect.bind(this)
  }

  async filterData(all,otherFilters) {
    console.log("Checking to see if tickers can be gotten", this.state)
    // if (this.state.byDate !== "" && this.state.byName !== "") {
    const filters = otherFilters||this.getFilters()
    const options = (await getOptions(filters, all ?  ['ticker', ...Object.keys(ChartFilters)]:['ticker'])).data
    const displayOptions = {}
    //SetOptions
    Object.keys(options).forEach(k => {
      /*Is Range*/
      const filter = ChartFilters[k]
      console.log(filter, options[k], k)
      if (filter?.step != null) {
        const rangeOptions = getRangeOptions(options[k] || [], filter.step)
        displayOptions[k] = rangeOptions.map(RangeLabel)
        options[k] = rangeOptions
      } else {
        displayOptions[k] = options[k]
      }


    })
    console.log("Got options", filters, options)
    let temp = await getTickerOptions(this.state.byDate.label, this.state.byName.value, this.state.byPrice.value)
    this.setState(state => ({ tickersOptions: temp.data, ...(all ? {}:{ options: { ...state.options, ticker: options.ticker }, displayOptions: { ...state.displayOptions, ticker: displayOptions.ticker } } ) }))
    // this.setState({ tickersOptions: temp.data,options,displayOptions})
    return { options, displayOptions }
    // }
  }
  getFilters() {
    const filters = { $and: [] }
    for (const filterProp in this.state.filters) {
      const getOption = i => this.state.options[filterProp][i]
      const chartFilter = ChartFilters[filterProp]
      const currentFilter = this.state.filters[filterProp]
      if (!currentFilter || currentFilter?.all) continue
      if (currentFilter instanceof Set) {
        if (currentFilter.size) {
          if (chartFilter?.step == null)
            filters[filterProp] = { $in: [...currentFilter].map(getOption) }
          else {
            filters.$and.push({ $or: [...currentFilter].map(i => ({ [filterProp]: getOption(i) })) })
          }
        }
      } else {
        const option = getOption(this.state.filters[filterProp])
        filters[filterProp] = option
      }
    }
    if (filters.$and.length == 0) {
      delete filters.$and
    }
    return filters
  }
  setNestedValue(stateProp) {
    return (prop, multi = true) => (value) => {
      let newValue
      if (multi) {
        console.log(prop, stateProp, this.state[stateProp]?.[prop])
        newValue = new Set((this.state[stateProp]?.[prop] || []))
        if (newValue.has(value)) {
          newValue.delete(value)
        } else {
          newValue.add(value)
        }
      } else {
        newValue = value
      }
      console.log(prop, newValue, multi)
      this.setState(oldState => ({ [stateProp]: { ...oldState[stateProp], [prop]: newValue } }), this.filterData)
    }
  }

  deleteFilter(prop) {
  
    this.setState(oldState => ({ filters: { ...oldState.filters, [prop]: ChartFilters[prop].single?undefined:new Set() } }), this.filterData)
  }

  setFilter = this.setNestedValue('filters')

  namesChangeSelect = async (byName) => {
    console.log(byName.label)
    this.setState({ byName }, () => {
      this.filterData()
    })
    this.setFilter('name')(byName.value)
  }

  async datesChangeSelect(byDate) {
    console.log(byDate.label)
    this.setState({ byDate }, () => {
      this.filterData()
    })
  }

  async tickersChangeSelect(byTicker) {
    console.log("change handler enter:", this.state)
    this.setState({ byTicker, ticker: byTicker.label }, () => {
      console.log("New State ticker/byTicker: ", this.state)
    })
  }

  handleDateChange = date => {
    //console.log("date : ", date)
    this.setState({
      date: date
    })
  }

  async componentDidMount() {
    // let names = await getSelectOptions("names")
    // let dates = await getSelectOptions('dates')
    // let tickers = await getTickerOptions("2021-01-04")
    // let dateIdx = dates.data.length
    // let nameIdx = names.data.length
    // // console.log(dateIdx, dates, nameIdx, names, tickers)
    // this.setState({
    //   priceBandsOptions: priceBandsOptions,
    //   namesOptions: names.data,
    //   datesOptions: dates.data,
    //   tickersOptions: tickers.data,
    //   byPrice: priceBandsOptions[0],
    //   byDate: dates.data[dateIdx - 1].label,
    //   byName: names.data[nameIdx - 1].label,
    //   //byTicker:tickers.data[0].label,
    //   isLoading: false
    // }, () => {
    //   console.log("State is set", this.state)
    // })
    const data = await this.filterData(true)
    this.setState(data)
  }
  getPropFilter(prop) {
    const f = this.state.filters[prop]

    return f instanceof Set ? [...f].map(i => ({ i, label: this.state.options[prop][i] })) : { i: f, label: this.state.options[prop][f] }
  }
  getPropDisplay(prop) {
    const f = this.state.filters[prop]

    return f instanceof Set ? [...f].map(i => ({ i, label: this.state.displayOptions[prop][i] })) : { i: f, label: this.state.displayOptions[prop][f] }
  }
  removeFilter(prop, i) {
    console.log(prop, i, this.state.filters[prop])
    if (this.state.filters[prop] instanceof Set) {
      this.state.filters[prop].delete(i)
    } else {
      this.state.filters[prop] = undefined
    }
    this.filterData()
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
  setTicker = (e) => {
    // this.setFilter('ticker', false)(e.target.text)
    this.setState({ ticker: e.target.text })
  }

  render() {
    const ticker = this.state.ticker || ""
    const filters = Object.keys(ChartFilters)
    console.log(ticker, this.state.displayOptions, this.state.options)
    return (
      
      // <div style={{ display: "grid", gridTemplateColumns: "25% 1fr", gridTemplateAreas: "'nav main'" }}>
      //   <div style={{ gridArea: "nav", textAlign: "left" }}>
      <div style={{ display: "grid", gridTemplateColumns: "25% 1fr", gridTemplateAreas: "'main main'" }}>
      <div style={{ gridArea: "nav", textAlign: "left" ,display:'none'}}>
          {Object.keys(this.state.filters).map((prop) => {
            console.log(this.state.filters[prop])
            const filtersForProp = this.getPropDisplay(prop)
            const chartFilter = ChartFilters[prop]
            if (chartFilter.single) {
              return <Button color="success" outline>{<DeleteIcon onClick={() => this.removeFilter(prop)} />}{chartFilter.label}:{filtersForProp.label}</Button>
            } else {
              return filtersForProp?.map(op => {
                console.log(op)
                return <Button color="success" outline key={op.i}>{<DeleteIcon onClick={() => this.removeFilter(prop, op.i)} />}{chartFilter.label}:{op.label}</Button>
              })
            }
          })}
          {filters.length && <hr />}
          {filters.map((prop, i) => {
            const chartFilter = ChartFilters[prop]
            const { label } = chartFilter
            const getLabel = chartFilter.step != null ? RangeLabel : SelectLabel

            const setFilter = this.setFilter(prop)
            const filter = this.state.filters[prop]
            console.log(filter)
            return (
              <React.Fragment key={label}>
                <Label>{label}</Label>
                {/* <p>{label}</p> */}
                <Nav vertical>
                  <NavItem key='All'>
                    <NavLink onClick={() => this.deleteFilter(prop)}>All</NavLink>
                  </NavItem>
                  {this.state.displayOptions[prop]?.map((optionLabel, i) => {
                    const selected = (filter instanceof Set)?filter.has(i):filter==i
                    console.log(i)
                    return <NavItem key={i} active ={selected}>
                      <NavLink onClick={() => setFilter(i)}>{optionLabel}</NavLink>
                    </NavItem>
          })}
                </Nav>
                {i != filters.length - 1 && <hr />}
              </React.Fragment>
            )
          })}
        </div>
        <div style={{ gridArea: "main" }}>
          {/*<Label>Ticker</Label>
           <Nav tabs style={{ overflowX: "hidden", maxHeight: "4em", display: 'block!important' }}>
            {
              this.state.options.ticker?.sort().map(tickerTab => (
                <NavItem key={tickerTab}>
                  <NavLink className={this.state.ticker==tickerTab?'active':''} onClick={this.setTicker}>
                    {tickerTab}
                  </NavLink>
                </NavItem>
              ))
            }
          </Nav> */}
          <Query options={this.state.options} onRun={(q)=>{
            this.filterData(false,q)
          }}/>
          <AvForm>
          <Row>
          <Col sm={{ size: 3 }}>
              <AvGroup>
                <Label>Ticker</Label>
                <Select
                  options={this.state.options.ticker?.sort().map(label=>({label}))}
                  onChange={(t)=>this.setTicker({target:{text:t.label}})}
                  value={this.state.ticker}
                  placeholder='Ticker'
                />
              </AvGroup>
            </Col>
          </Row>
        </AvForm>
          <Row>
            {/* <Col sm={{size:4}}>{this.state.byName}</Col>
            <Col sm={{size:4}}>{this.state.byDate}</Col> 
            <Col sm={{size:4}}>{this.state.ticker}</Col> */}
          </Row>
          <Label>{ticker}</Label>
          <SingleSeriesChart
            ticker={ticker}
            key={ticker}
          />
          {/* <Table transactions = {this.state.transactions} /> */}
        </div>
      </div>
    );
  }
}
export default Chart;