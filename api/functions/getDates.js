// returns an array of dates starting with the current day and going back 'days'

let milliToDate=function(date) {
  date= new Date(date)
  let year = date.getFullYear().toString()
  let month = (date.getMonth()+1).toString()
  let day = date.getDate().toString()
  let dayOfWeek = date.getDay()
  if ((dayOfWeek > 0) && (dayOfWeek < 6)) {
    if (day.length==1) day='0'+day
    if (month.length==1) month='0'+month
    //console.log("test passed:", dayOfWeek, typeof(dayOfWeek), typeof(date.getDay()))
    return `${year}-${month}-${day}`
  } else {
    //console.log("Test Failed:", dayOfWeek)
    return null
  }
}

let getDates = function(days) {
  let val;
	let d=new Date()
	let dates=[]
	for(let i=1;i<days;i++) {
		date=d-(i*86400000)
    val=milliToDate(date)
		if (val !== null) {
      dates.push(val)
    }
	}
	return dates
}

module.exports = getDates;
let res = getDates(10)
console.log(res)
