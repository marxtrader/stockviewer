import { millisIn90MarketDays, millisInADay } from './Common.mjs'
import * as Calculation from './Calculation.mjs'
import mongoose from 'mongoose'

import EODs from '../models/eods.js'
import Tickers from '../models/tickers.js'
import * as PolygonUtils from './PolygonUtils.mjs';
import TickSchema from '../models/tick.js'

// mongoose.connect("mongodb://54.147.196.139:27017",{useNewUrlParser: true, useUnifiedTopology: true },async (e)=>{
//     console.log("Mongo says ", e)
// })
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true }, async (e) => {
    console.log("Mongo says ", e)
    console.log(await EODs.find({}))
    // console.log(await Ticker.deleteMany({}))
    // console.log(await Ticker.find({}))
})

// interface StockData {
//     ticker: string
//     date: number
//     close: number
//     high: number
//     low: number
//     open: number
//     vwap: number
//     range: number
//     volume: number
//     count: number
// }
function genStart(end) {
    return end - millisIn90MarketDays - millisInADay - millisInADay
}

export async function storeAllDailies(start, end) {
    // const allTickers = await PolygonUtils.getTickers({})
    // console.log(allTickers)
    for await (const ticker of PolygonUtils.iterateTickers()) {
        // console.log(ticker)
        await storeDailies(ticker.ticker, start, end)
    }
}
export function isInRange(doc, start, end) {
    const minTimestamp = doc.get("minTimestamp")
    const maxTimestamp = doc.get("maxTimestamp")
    console.log(minTimestamp, maxTimestamp,start,end,minTimestamp <= start && start <= maxTimestamp , minTimestamp <= end && end <= maxTimestamp,minTimestamp <= start && start <= maxTimestamp && minTimestamp <= end && end <= maxTimestamp)
    return {newMin:Math.min(minTimestamp,start),newMax:Math.max(maxTimestamp,end),inRange:(minTimestamp <= start && start <= maxTimestamp && minTimestamp <= end && end <= maxTimestamp)}
}
export async function storeDailies(symbol, start, end) {
    const tickerInfo = await PolygonUtils.getInfo({ticker:symbol});
    if(tickerInfo.error!=undefined){
        // console.log(tickerInfo)
        // return
    }
    const doc = await Tickers.findOneAndUpdate({ symbol: tickerInfo.symbol }, tickerInfo, { upsert: true, new: true, useFindAndModify: false })
    console.log(tickerInfo,doc)
    //If the entire queried range is in range, return
    const rangeInfo = isInRange(doc, start, end)
    if (rangeInfo.inRange) {
        console.log(`We already have the data for ${symbol} from ${start} to ${end}`)
        return doc
    }
    doc.updateOne({ $min: { minTimestamp: start }, $max: { maxTimestamp: end } },{}, (e, d) => e ? console.log("timestampingError", e) : null)
    // doc=undefined
    start=rangeInfo.newMin
    end=rangeInfo.newMax
    const dailiesPages = await PolygonUtils.iterateDailiesPages(symbol, start, end, millisInADay);
    const tickPages = await PolygonUtils.iterateTickPages(symbol, start);
    for await (let page of dailiesPages) {
        // console.log(page)
        // doc.updateOne({ $push: { daily: { $each: page.results } } }, {}, (e, d) => e ? console.log("DailyError", e) : null)
        await EODs.insertMany(page.results, (e, d) => e ? console.log("DailyError", e) : null)
    }
    // for await(let page of tickPages){
    //     await TickSchema.updateOne({$push:{tick:{$each:page.results}}},{},(e,d)=>e?console.log("TickError",e):null)
    // }
    console.log(`Stored new data for ${symbol} from ${start} to ${end}`)
    return doc
}
export function between(data, start, end, key) {
    const values = []
    data=data||[]
    let i = data[Symbol.iterator]()
    let lastIterator
    let count
    do { 
        lastIterator = i.next()
    } while (!lastIterator.done && +lastIterator.value[key] < start)
    while (!lastIterator.done && +lastIterator.value[key] < end) {
        values.push(lastIterator.value)
        lastIterator = i.next()
    }
    return values
}
export async function getTicks(symbol, start, end) {
    return between((await EODs.findOne({ symbol }))?.get("tick"),start,end,"t")
}
export async function getDailies(symbol, start, end) {
    return between((await EODs.findOne({ symbol }))?.get("daily"),start,end,"t")
}
// export async function getDaily(symbol: string, start: number, end: number):Promise<AggregateData[]>  {
//     const doc = await Ticker.findOne({symbol},{},{upsert:true,new:true,useFindAndModify:false})
//     // return doc.get("tick")
//     return doc.get("daily")
//     // return doc
// }


export function runAggregateCalulations(dailies){
    let count = 0
    let totalRange = 0
    let totalTPV = 0
    let totalVWAP = 0
    let totalVolume = 0

    const aggregateCalculations = Calculation.runCalculations(dailies.reverse(), {
        Range: (n) => {
            count++
            totalRange += (n.h - n.l)
            return totalRange / count
            // return { totalRange, avg: totalRange / count, count }
        },
        VWAP: (n) => {
            const DailyVWAP = (n.h + n.l + n.c) / 3
            totalTPV += n.v * DailyVWAP
            totalVWAP += DailyVWAP
            totalVolume += n.v
            return totalVWAP / count
            // return { DailyVWAP, AvgDailyVWAP: totalVWAP / count, RunningVWAP: totalTPV / totalVolume }
        },
        Volume: (n) => {
            return totalVolume / count
        }
    }, { outputAfter: [0, 14, 29, 44], runOnAll: true })
    const data = {}
    // console.log(dailies[0])
    data.ticker = dailies[0].tickerSymbol
    data.date = dailies[0].t

    data.high = dailies[0].h
    data.low = dailies[0].l
    data.close = dailies[0].c
    data.open = dailies[0].o
    // for(let calc of ["Range","WVAP"] as (keyof typeof results)[]){
    for (let calc in aggregateCalculations) {
        let calcKey = calc
        let lowerKey = calcKey.toLowerCase();
        for (let inpsUsed in aggregateCalculations[calcKey]) {
            // data[`${lowerKey}${(Number(inpsUsed) > 1 ? inpsUsed : "")}`] = calcKey == "VWAP" ? aggregateCalculations[calcKey][inpsUsed].AvgDailyVWAP : aggregateCalculations[calcKey][inpsUsed].avg
            data[`${lowerKey}${(Number(inpsUsed) > 1 ? inpsUsed : "")}`] = aggregateCalculations[calcKey][inpsUsed]
        }
    }
    return data
}

// export function getData(symbol: string, start: number, end: number, f: Function) {
//     conn.query("SELECT * FROM StockData WHERE ticker=? AND date between FROM_UNIXTIME(?) and FROM_UNIXTIME(?)", [symbol, start / 1000, end / 1000], f)
// }
// function storeData(dailies: StockData[]) {
//     for (let data of dailies) {
//         conn.query(
//             'INSERT INTO StockData (`TICKER`,`DATE`,`CLOSE`,`HIGH`,`LOW`,`OPEN`,`RANGE`,`VOLUME`,`VWAP`)VALUES(' +
//             '?,FROM_UNIXTIME(?),' +
//             'CAST(? AS decimal(5,2)),'+
//             'CAST(? AS decimal(5,2)),'+
//             'CAST(? AS decimal(5,2)),'+
//             'CAST(? AS decimal(5,2)),'+

//             'CAST(? AS double),'+

//             'CAST(? AS decimal(5,2)),'+

//             'CAST(? AS decimal(10,0)),'+

//             'CAST(? AS decimal(5,2)));'
//             ,
//             [
//                 data.ticker, data.date / 1000,
//                 data.close, 
//                 data.high, 
//                 data.low, 
//                 data.open,
//                 data.count,
//                 data.range,
//                 data.volume, 
//                 data.vwap
//             ], (err, res) => {
//                 if (err) console.log("Insert error on:", data)

//             }
//         )

//     }
// }
/*
    let runningTotalTPV=0
    let runningTotalVolume=0
    const TPVs:number[] = []

    for(let period of resp.results){
        TPVs.push(period.v*(period.h+period.l+period.c)/3)
        runningTotalTPV+=period.v*(period.h+period.l+period.c)/3
        runningTotalVolume+=period.v
    }
*/
