const config =  {
  
  MtServer: {
    host:'185.95.17.202',
    username:'cranni',
    password:'1qazXSW@', 
    db:'metatrader'
  },

  cognito: {
    REGION: "us-east-1",
    UserPoolId: "us-east-1_UNLMMFwAr",
    APP_CLIENT_ID: "4rqd241vkb3tu8cpkqvgevrdr8",
    IDENTITY_POOL_ID: "us-east-1:426ea851-e4f6-4b78-8288-400af48ea854"
  },
  cognitoAdmin:{
    REGION: "us-east-1",
    UserPoolId: "us-east-1_UNLMMFwAr",
    APP_CLIENT_ID: "4rqd241vkb3tu8cpkqvgevrdr8",
    IDENTITY_POOL_ID: "us-east-1:426ea851-e4f6-4b78-8288-400af48ea854"
  },
  
  api:{
    server:"https://apiv2.marxgroupllc.com",
    //server:"http://52.21.235.215:3010"
    //server:"http://127.0.0.1:4000"
  },
  stocks: {
    eod:"http://127.0.0.1:3100/eod",
    tickers:"http://127.0.0.1:3100/tickers",
    experiments:"http://127.0.0.1:3100/experiments",
    results:"http://127.0.0.1:3100/results",
    options:"http://127.0.0.1:3100/options"
  }
};
module.exports = config;