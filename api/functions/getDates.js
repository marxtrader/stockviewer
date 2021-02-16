// returns an array of dates starting with the current day and going back 'days'

let milliToDate=function(date) {
  date= new Date(date)
  //console.log("Date: ", date)
  let year = date.getFullYear().toString()
  let month = (date.getMonth()+1).toString()
  let day = date.getDate().toString()
  if (day === 0 || day === 6) return null
  if (day.length==1) day='0'+day
  return `${year}-${month}-${day}`
}

let getDates = function(days) {
	let d=new Date()
	let dates=[]
	for(let i=1;i<days;i++) {
		date=d-(i*86400000)
		dates.push(milliToDate(date))
	}
	return dates
}