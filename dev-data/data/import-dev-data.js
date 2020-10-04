const mongoose=require('mongoose');
const fs=require('fs');
const dotenv=require('dotenv');
const Tour =require('../../models/tourModel');
const Review =require('../../models/reviewModel');
const User =require('../../models/usermodel');


dotenv.config({path:'./config.env'});

const DB=process.env.DATABASE.replace("<PASSWORD>",process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
     useUnifiedTopology: true 
}).then(con=>{
    // console.log(con.connections);
    console.log("DB connection successful");
})
///READ JSON FILE
const tours=JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));
const users=JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'));
const reviews=JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'));

///IMPORT DATA IN DATABSE
const importData=async()=>{
    try{
       await Tour.create(tours);
       await Review.create(reviews);
       await User.create(users,{validateBeforeSave:false});

       console.log("Data Successfully loaded");

    }catch(err){
        console.log(err);
    }
    process.exit();

};
//DELETE PREVIOUSLY STORED DATA
const deleteData=async()=>{
    try{
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log('Data Successfully deleted');
    }catch(err){
        console.log(err);
    }
    process.exit();

};
if(process.argv[2]==='--import'){
    importData();
}else if(process.argv[2]==='--delete'){
    deleteData();
}
