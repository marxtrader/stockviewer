import React, { Component } from 'react'
import InputSlider from 'react-input-range'
//https://jsfiddle.net/0rgwuybt/77/

//https://stackoverflow.com/a/196991
const DarkColor = "#003166"
const MainColor = "#007Bff"
const LightColor = "#e6f2ff"

const DarkColors = { background: DarkColor, color: LightColor }
const LightColors = { background: MainColor, color: LightColor }
// const MarketOptions = { stocks: 's', 'cryptocurrencies': 'crypto' }
const MarketOptions = { stocks: 's' }
const Mouse = { x: 0, y: 0 }
window.addEventListener('dragover', e => {
    Mouse.x = e.clientX
    Mouse.y = e.clientY
    e.preventDefault()
})
window.addEventListener('drop', e => {
    e.preventDefault()
})

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function onHover(handler) {
    return {
        onMouseOver: (...args) => handler(true, ...args),
        onMouseOut: (...args) => handler(false, ...args)
    }
}
const SelectorTypes = {

}
let i = 0
const FilterTypes = {
    Range: 0,
    Select: 1,
    Date: 2
}

const PropTypes = {
    close: FilterTypes.Range,
    name: FilterTypes.Select,
    date: FilterTypes.Select
}
const PropOptions = Object.keys(PropTypes)
const PropMap = Object.fromEntries(PropOptions.map(p => [toTitleCase(p), p]))
const FirstProp = PropMap[Object.keys(PropMap)[0]]


const Connectives = ['and', 'or']
const ConnMap = Object.fromEntries(Connectives.map(c => [c, `$${c}`]))
const FirstConn = ConnMap[Object.keys(ConnMap)[0]]

/*  const Connectives = ['&&', '||'] */
/* const connLabels = {'&&':'and','||':'or'}
const ConnMap = Object.fromEntries(Connectives.map(c=>[c,`${connLabels[c]}`])) */

export class Query extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: undefined,
            filterProps: [],
            connectives: []
        }
        this.add = this.add.bind(this)
    }
    add() {
        this.setState(s => ({
            filterProps: [...s.filterProps, { value: FirstProp }],
            connectives: s.filterProps.length ? [...s.connectives, { value: FirstConn }] : s.connectives
        }))

    }
    static addToQuery(queryObject, segment) {
        let value
        switch (PropTypes[segment.value]) {
            case FilterTypes.Range:
                value = segment.range
                break
            case FilterTypes.Select:
                value = segment.is
                break
        }
        if (queryObject instanceof Array) {
            queryObject.push({ [segment.value]: value })
        } else
            queryObject[segment.value] = value
    }
    getQuery = () => {
        if (this.state.filterProps.length == 0) return {}
        let q = []
        for (let i = 0; i < this.state.connectives.length; i++) {
            q.push(this.state.filterProps[i], this.state.connectives[i])
        }
        q.push(this.state.filterProps[this.state.filterProps.length - 1])
        console.log(q)
        let query = {}
        let currentConnective
        Query.addToQuery(query, q.shift())
        while (q.length) {
            const nextConnective = q.shift()
            if (currentConnective != nextConnective.value) {
                currentConnective = nextConnective.value
                const newQuery = {}
                newQuery[currentConnective] = [query]
                query = newQuery
            }
            Query.addToQuery(query[currentConnective] || query, q.shift())
        }
        return query
        console.log(query)
    }
    run = () => {
        if (this.props.onRun)
            this.props.onRun(this.getQuery())
    }
    delete(i) {
        this.setState(s => {
            s.filterProps.splice(i, 1)
            let connI = (i < s.connectives.length) ? i : i - 1
            s.connectives.splice(connI, 1)
            return {
                filterProps: [...s.filterProps],
                connectives: [...s.connectives]
            }
        })
    }
    set(i, listProp, prop) {
        return (v) => {
            /* this.setState(s=>({[propName]:[...s[propName],v]}))*/
            this.setState(s => {
                const vals = s[listProp].slice()
                vals[i] = prop == 'value' ? { value: v } : { ...vals[i], [prop]: v }
                // console.log(vals[i], v, prop)
                // vals[i] = {...vals[i],...v}
                // vals[i] = v
                return { [listProp]: vals }
            })
        }
    }
    setProp(i, property) {
        return this.set(i, 'filterProps', property)
    }
    setConn(i, property) {
        return this.set(i, 'connectives', property)
    }
    getSubComponents(p, i) {
        const prop = p.value
        const type = PropTypes[prop]
        // console.log(p, this.props.options[prop])
        const propPair = (property, defaultVal) => {
            const onChange = this.setProp(i, property)
            if (p[property] == null)
                p[property] = defaultVal
            return { value: p[property], onChange }
        }
        let children
        switch (type) {
            case FilterTypes.Select: {
                const options = Object.fromEntries(this.props.options[prop].map(o => [o, o]))
                children = [<span key='is'>&nbsp;is&nbsp;</span>, <SelectorSegment key='isSelect' {...DarkColors} options={options} {...propPair('is', this.props.options[prop][0])} />]
                break;
            }
            case FilterTypes.Range: {
                const ranges = this.props.options[prop]
                const minProp = SliderProps.min
                const maxProp = SliderProps.max
                const range = { [minProp]: Infinity, [maxProp]: -Infinity }
                for (const r of ranges) {
                    if (r[minProp] < range[minProp])
                        range[minProp] = r[minProp]
                    if (r[maxProp] > range[maxProp])
                        range[maxProp] = r[maxProp]
                }
                children = [<span key='is'>&nbsp;is between&nbsp;</span>, <RangeSegment key='isSelect' {...DarkColors} range={range} {...propPair('range', range)} />]
                break;
            }
        }
        return children
    }

    render() {
        return (
            <div className="query">
                Find <SelectorSegment options={MarketOptions} value={this.state.stockType} onChange={stockType => this.setState({ stockType })} /> {this.state.filterProps.length ? " where " : ""}
                {this.state.filterProps.map((p, i) => {
                    return (
                        <React.Fragment key={i}>

                            <SelectorSegment options={PropMap} value={p.value} onDelete={_ => this.delete(i)} onChange={this.setProp(i, 'value')} children={
                                this.getSubComponents(p, i)
                            } />
                            {i < this.state.connectives.length ? <SelectorSegment background={DarkColor} options={ConnMap} value={this.state.connectives[i].value} onChange={this.setConn(i, 'value')} /> : null}
                        </React.Fragment>)
                })}
                <CircleButton onClick={this.add} style={{
                    marginLeft: '5px'
                }} text={'+'} />
                <CircleButton onClick={this.run} className="run" text={'Run query'} />
            </div>
        )
    }

}
class QuerySegment extends Component {
    constructor(props) {
        super(props)
        this.state = { value: this.props.value }
    }
    setValue(opt) {
        /* this.setState({ value: opt } )*/
        this.props.onChange && this.props.onChange(opt)
    }
    getLabel() {
        return "-Query-"
    }
    getPopup() {
        return "-Popup-"
    }
    setShow = (show) => {
        this.setState({ show })
    }
    render() {
        return (
            <span className="pill" style={{ background: this.props.background, color: DarkColor }}>
                {this.props.onDelete ? <Delete onClick={this.props.onDelete} style={{
                    marginRight: '5px'
                }} /> : null}
                <Popup base={<span style={{ color: this.props.color || LightColor, fontWeight: 'bold' }}>{this.getLabel()}</span>} popup={this.getPopup()} />
                {this.props.children}
            </span>)
    }
}
class SelectorSegment extends QuerySegment {
    setOptions(optionMap) {
        optionMap = optionMap || {}
        this.setState({ options: Object.keys(optionMap), optionMap })
    }
    componentDidMount() {
        this.setOptions(this.props.options)
    }
    getValueLabel(v) {
        return this.state.options ? this.state.options.find(key => this.state.optionMap[key] === v) : undefined
    }

    componentDidUpdate(oldProps) {
        if (this.props.options != oldProps.options) {
            this.setOptions(this.props.options)
        }
    }
    getPopup() {
        return (
            this.state.options && this.state.options.map((label, i) =>
                <React.Fragment key={i}>{i > 0 && <br />}<span className="selectorOption" onClick={_ => this.setValue(this.state.optionMap[label])}>{label}</span></React.Fragment>
            )
        )
    }
    getLabel() {
        return this.getValueLabel(this.props.value) || <span style={{ color: this.props.noneColor || LightColor }}>select</span>
    }
}
class Handle extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { value, ...otherProps } = this.props
        return (<div className='handle' style={{ left: `${value}%` }} {...otherProps} />)
    }
}
const SliderProps = {
    min: '$gte',
    max: '$lte'
}
class DualSlider extends Component {
    constructor(props) {
        super(props)
        this.element = React.createRef()
    }
    componentDidMount() {
        this.setState(this.props.range)
    }
    state = { prevPosition: {} }
    start = (prop) => e => e.persist() || e.dataTransfer.setDragImage(e.target, window.outerWidth, window.outerHeight) || this.setState(s => ({ prevPosition: { ...s.prevPosition, [prop]: e.clientX } })) || false
    move = (prop) => _ => this.setState(s => {
        const prevX = s.prevPosition[prop]
        const newState = { prevPosition: { ...s.prevPosition, [prop]: Mouse.x } }
        if (prevX != null) {
            const percent = (prevX - Math.round(this.element.current.getBoundingClientRect().left)) / this.element.current.clientWidth
            // console.log(this.element.current.getBoundingClientRect().left)
            const change = percent * (this.props[SliderProps.min] - this.props[SliderProps.min])
            const value = change
            // const change = ((Mouse.x - prevX) / this.element.current.clientWidth) * (this.props[SliderProps.min] - this.props.min)
            // const value = s[prop] +change
            const valueBetweenHandle = (prop == SliderProps.min && value > s[SliderProps.min] ? s[SliderProps.min] : (value < s[SliderProps.min] ? s[SliderProps.min] : value))
            const clampedValue = valueBetweenHandle > this.props[SliderProps.min] ? this.props[SliderProps.min] : (this.props[SliderProps.min] > valueBetweenHandle ? this.props[SliderProps.min] : valueBetweenHandle)
            // console.log(prevX,change,value, clampedValue)
            if (this.props.onChange) {
                this.props.onChange({
                    [SliderProps.max]: this.state[SliderProps.max],
                    [SliderProps.min]: this.state[SliderProps.min],
                    [prop]: clampedValue
                })
            }
            Object.assign(newState, { [prop]: clampedValue })
        }
        return newState
    })
    end = (prop) => e => e.persist() || this.setState(s => ({ prevPosition: { ...s.prevPosition, [prop]: undefined } }))

    getValue = () => {
        return Object.fromEntries(
            Object.values(SliderProps).map(
                prop => [prop, this.state[prop]]
            )
        )
    }
    render() {
        const range = (this.props.max - this.props.min) / 100
        return (
            <div>
                {/* <div className='dualSlider' ref={this.element}> */}
                {Object.keys(SliderProps).map(minOrMax => {
                    const propName = SliderProps[minOrMax]
                    const other = minOrMax == 'min' ? 'max' : 'min'
                    const range = {
                        min: this.props.range[SliderProps.min],
                        max: this.props.range[SliderProps.max],
                        [other]: this.state[SliderProps[other]]
                    }
                    return (
                        // <Handle value={(this.state[p] || this.props.range[p]) / (range)} onDragStart={this.start(p)} onDrag={this.move(p)} onDragEnd={this.end(p)} draggable />
                        <React.Fragment key={minOrMax}>
                            {`${minOrMax[0].toUpperCase()}${minOrMax.substr(1)}: ${this.state[propName]}`}
                            <input
                                type='range'
                                value={this.state[propName] == null ? this.props.range[propName] : this.state[propName]}
                                {...range}
                                onChange={(e) => {
                                    this.setState({ [propName]: +e.target.value }, () => this.props.onChange(this.getValue()))
                                }} />
                        </React.Fragment>
                    )
                })}
            </div>)
    }
}
class RangeSegment extends QuerySegment {
    state = {}
    componentDidMount() {
        this.setState(this.props.range)
    }
    getPopup() {
        // console.log(this.state,this.props.value)
        return (
            <DualSlider range={this.props.range} onChange={(newRange) => {
                this.setValue(newRange)
            }} />)
    }
    getLabel() {
        return this.props.value ? `${this.props.value.$gte} - ${this.props.value.$lte}` : ''
    }
}
class Popup extends Component {
    state = { show: false }
    setShow = (show) => {
        this.setState({ show })
    }
    render() {
        return (<span {...(onHover(this.setShow))}>
            {this.props.base}
            <span className={`popup ${this.state.show ? 'show' : ''}`}>
                <span> {this.props.popup}  </span>
            </span>
        </span>)
    }
}
function Delete(props) {
    return <span className="delete" {...props}>&times;</span>
}

function CircleButton(props) {
    return <button className="dotButton" {...props}>{props.text}</button>
    // return <span className="delete" {...props}>&times;</span>
}


// ReactDOM.render(<Query />, document.querySelector("#app"))
