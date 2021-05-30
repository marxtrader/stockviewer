
const key = process.env.API_KEY
import * as PolygonUtils from '../old stock-viewer files/PolygonUtils.mjs'

export async function getTicks(ticker, date, invalidConditions = [15, 16, 38, 17], limit = 50000) {
    // Initialization of all the values we want to store
    let oddlotVolume = 0; let oddlotCount = 0; let volume = 0; let count = 0; let blockCount = 0; let blockVolume = 0;

    // The set of invalid trade condition
    const conditionsToIgnore = new Set(invalidConditions)

    // The data as returned from polygon
    let data;

    // The timestamp offset of the current page of tick data
    let t = 0;

    do {
        data = await PolygonUtils.getTicksPage({ timestamp: t, limit, date, ticker })
        // console.log(data.results_count,t)
        if (data.results.length == 0) break;

        t = data.results[data.results_count - 1].t
        // loop through and crunch the data points as they come in
        for (let trade of data.results) {
            // not all trades have a trade condition, if omitted it is considered a valid trade
            if (trade.c == undefined) { trade.c = [0] }
            if (trade.s !== 0) {
                const found = trade.c.some(c => conditionsToIgnore.has(c)) // check for valid trade conditions
                if (!found) {  // considered a valid trade 
                    volume += trade.s
                    count += 1
                    if (trade.s < 100) {
                        oddlotVolume += trade.s
                        oddlotCount += 1
                    }
                    if (trade.s >= 5000) {
                        blockCount += 1
                        blockVolume += trade.s
                    }
                }
            }
        }
    }
    while (data.results_count == limit);
    // if the result set is equal at the limit there are more records, so check for more.

    // Once the result count is less than limit, we must have gotten them all

    // console.log(`${count} ticks for ${ticker} on ${date}`)

    const tickSummary = {
        oddlotVolume,
        oddlotCount,
        volume,
        count,
        blockCount,
        blockVolume
    }
    // console.log(count)
    // console.log(ticker,date,tickSummary)
    return tickSummary
}

// getTicks("AMC", "2021-01-29").then((data) => { console.log(data) })
// getTicks("AMC", "2021-01-29").then((data) => { console.log(data) })
// getTicks("AMC", "2021-01-28").then((data) => { console.log(data) })
//getTicks("PTEN", "2021-03-01").then((data) => { console.log(data) })
