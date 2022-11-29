const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const {check, validationResult} = require('express-validator')
var session = require('express-session');
/*Mongo connection*/
const uri = "mongodb+srv://yoda:yVJeiKRBqx9fYaic@cluster0.3ekyzcw.mongodb.net/?retryWrites=true&w=majority";
const dbname = "star-wars"
const collectionname = "starwarsusers"


const urlEncodedParser = bodyParser.urlencoded({extended: true})
var CarEmail="";
var UserName="";
var checkUser=false;

router.get('/',(req,res) => {
    res.send('User List')
});

router.get('/register',(req,res) => {
    const errors = validationResult(req)
    const alert = errors.array()
    res.render('register',{alert})
});

router.get('/login',(req,res) => {
    const errors = validationResult(req)
    const alert = errors.array()
    res.render('login',{alert})
});

router.post('/register',urlEncodedParser,[
    check('username','This user must have 3+ character long')
    .exists()
    .isLength({min: 3}),
    check('email', 'Email is not valid')
    .isEmail()
    .normalizeEmail()
],(req,res) => {
    
   const errors = validationResult(req)
 
   if(!errors.isEmpty()){
//  return res.status(422).json(errors.array())
  const alert = errors.array()
  //res.render('register',{alert})
  res.render('register',{alert})
 // res.send(alert)

}
else{
    const { MongoClient, ListCollectionsCursor } = require('mongodb');

    async function main() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        await createListing(client, req.body);

    } finally {
        // Close the connection to the MongoDB cluster

        await client.close();
    }

}

main().catch(console.error);


async function createListing(client, newListing){
    const lsearch = await client.db(dbname).collection(collectionname).findOne({email: newListing.email});
    //console.log(`listing available with email: ${newListing.email}`);
    CarEmail = newListing.email
    checkEmail=true
    if (lsearch==null){
 
        if (newListing.password==newListing.password1){
            const result = await client.db(dbname).collection(collectionname).insertOne(newListing);
            // console.log(`New listing created with the following id: ${result.insertedId}`);  
            res.redirect('/')  
        }
        else{ res.render('register',{alert: [{"value":newListing.password,"msg":"Password Mismatch","param":"password","location":"body"}]})}
    
    } else{ res.render('register',{alert: [{"value":CarEmail,"msg":"Email already exists","param":"email","location":"body"}]})}

}}

});


router.post('/login',urlEncodedParser,[
    check('email', 'Email is not valid')
    .isEmail()
    .normalizeEmail()
],(req,res) => {
    
   const errors = validationResult(req)
 
   if(!errors.isEmpty()){
  const alert = errors.array()
  res.render('login',{alert})

}
else{
    const { MongoClient, ListCollectionsCursor } = require('mongodb');

    async function main() {

    const client = new MongoClient(uri);

    try {
        await client.connect();
        await createListing(client, req.body);

    } finally {
        // Close the connection to the MongoDB cluster

        await client.close();
    }
}

main().catch(console.error);

async function createListing(client, newListing){
    const lsearch = await client.db(dbname).collection(collectionname).findOne({email: newListing.email, password:newListing.password});

    checkUser=true
    if (lsearch!=null){
        UserName = newListing.username;
        req.session.username = lsearch.username;
        req.session.admin = true;
        req.session.loggedIn = true;        
        checkUser=true   
    } else{checkUser=false}
    if (checkUser==false){  res.render('login',{alert: [{"value":UserName,"msg":"Invalid email or password","param":"email","location":"body"}]})}
else{res.redirect('/');}

}
}
checkLogIn = req.session.loggedIn ;
});

router.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});
module.exports = router