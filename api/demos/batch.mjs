import { bactchIterator } from '../stock-viewer files/Calculation.mjs'
const iterator = bactchIterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10][Symbol.iterator](), 3, 0)
for await (const v of iterator) {
    console.log(v)
}

function* range(min, max, step = 1) {
    for (let i = min; i < max; i += step) {
        yield i
    }
}

const rangeIterator = bactchIterator(range(0, 200), 90)
for await (const v of rangeIterator) {
    console.log(v)
}


function dummyPromise(data) {
    return new Promise((res, rej) => res(data))
}

function* rangeAsync(min, max, step = 1) {
    for await (const i of range(min,max,step)) {
        yield dummyPromise(i)
    }
}

const asyncIterator = bactchIterator(range(0, 10), 3)
for await (const v of asyncIterator) {
    console.log(v)
}

 let a ={
 type:[Value|Operation],
 value:{dayIndex:number,propertyName:property}|('*'|'/'|'+'|'-'),
 args: [] // For Operation
 } 
 