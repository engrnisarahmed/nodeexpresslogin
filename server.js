const express = require('express')
var session = require('express-session');

const app = express()

//Set Templating Engine
app.set('view engine','ejs')
app.use(session({secret:'Keep it secret'
,name:'uniqueSessionID'
,saveUninitialized:false
,cookie: {
  expires: 300000
}
}))


app.get('/',(req,res) => {
  var checkLogIn = req.session.loggedIn ;
  var UserName = req.session.username;
  
  res.render('index',{username:UserName, CheckLogInn:checkLogIn})
});

const useRouter = require('./Routers/Users')
app.use('/Users',useRouter)


app.listen(3000, () => console.log("Server ready"))