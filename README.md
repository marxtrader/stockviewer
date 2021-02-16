Got experiments working, Out put results to results collection and display in ui with Experiments.js 
Todo.. 
add selectors for date, experiment name, export to stk file.

Data bases : marketdata

collections:

ticker details ./models/tickers

daily summary ./models/eod

experiment = ./models/experiment  // will hold the result set for each experiment.

experiment = isGap
	Gap = (ticker[i].open - ticker[i-1].close) > ( % * previous close) some minimum percentage of the previous close. Might even want to through it into a loop to try different percentages vs. returns.


experiment = 3daysup/3daysdown

		Universe = {"T":symbol, c : {lte 10}

		if the closing price of a stock is greater than the previous days close for 3 consecutive days, what is the ROI over different time spans.

		if the closing price of a stock is less than the previous days close for 3 consecutive days, what is the ROI over different time spans

		ex.
		ticker[idx-1].c > ticker[idx - 2].o, ticker[idx-2].c > ticker[idx -3].o, ticker[idx-3].c > ticker[idx - 4].o
		if true
		buyPrice = ticker[i].vw
		else
		sell price = ticker[i].vw

		time spans
		1 day, 2 days, 3 days, 4 days, 7 days, 14 days.

		ticker[i+1].c / buyPrice  /sellPrice


