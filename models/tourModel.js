const mongoose=require('mongoose');
const slugify=require('slugify');
const validator=require('validator');
// const User=require('./usermodel');
const tourSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A tour must have a name'],
        unique:true,
        trim:true,
        maxlength:[40,'A tour must have less than or equal than 40 characters'],
        minlength:[10,'A tour must have more than or equal than 10 characters']
        // validate:[validator.isAlpha,"Tour name must have only character"]
    },
    slug:String,
    duration:{
    type:Number,
    required:[true,'A tour must have a  duration']
    },
    maxGroupSize:{
    type:Number,
    required:[true,'A tour must have a group size']
    },
    difficulty:{
        type:String,
        required:[true,'A tour must have a difficulty'],
        enum:{values:['easy','medium','difficult'],
         message:'Difficulty is either easy medium or difficult'}
        },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    ratingsAverage:{
        type:Number,
        default:4.5,
        min:[1,'Rating must be above 1.0'],
        max:[5,'Rating must be below 5.0'],
        set:val=>Math.round(val * 10 ) / 10 
    },
    price:{
        type:Number,
        required:[true,'A tour must have a price']
    },
    priceDiscount:{
        type:Number,
        validate:{
            validator:function(val){
                ///this will apply only for new document it will not aply to update
             return val<this.price;
            },
            message:'Discount should ({VALUE}) be below the regular price'
        }
    },
    summary:{
        type:String,
        trim:true,
        required:[true,'A tour must have a description']
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true,"A tour must have a cover image"]
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    startDates:[Date],
    secretTour:{
        type:Boolean,
        default:false
    },
    startLocation:{
        //GeoJSON
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String
    },
    locations:[
        {
            type:{
                type:String,
                default:'Point',
                enum:['Point']
            },
            coordinates:[Number],
            address:String,
            description:String,
            day:Number
        }
    ],
    guides:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'User'
        }
    ]
    // reviews:[                        this will lead to child refrencing thus we dont want to do it,so we can use virtual populate
    //     type:moongoose.schema.objetcid,
    //     ref:'Review'
    // ]
},
{
        toJSON:{virtuals:true},
        toObject:{
            virtuals:true
        }
    }
);
// tourSchema.index({price: 1});   //1 for asscending -1 for desc
tourSchema.index({price: 1,ratingsAverage:-1});   //1 for asscending -1 for desc
tourSchema.index({slug:1});
tourSchema.index({startLocation: '2dsphere'});
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
})
//virtual populate//
tourSchema.virtual('reviews',{
    ref:'Review',
    foreignField:'tour',
    localField:'_id'
});
///DOCUMENT MIDDLEWARE        //will run before save and create
tourSchema.pre('save',function(next){
   this.slug=slugify(this.name,{lower:true});
   next();
});
// tourSchema.pre('save', async function(next){
//     const guidesPromises=this.guides.map( async id=> await User.findById(id));
//     this.guides=await Promise.all(guidesPromises);
//     next();
// })
// tourSchema.pre('save',function(next){
//     console.log('Will save document');
//     next();
//  })
// tourSchema.post('save',function(doc,next){
//     console.log(doc);
//     next();
// })
///QUERY MIDDLEWARE
tourSchema.pre(/^find/,function(next){      //this triggers the find method but doesnot apply for findone so we use find regex
     this.find({secretTour:{$ne:true}});   //get all the tours where secret tour is false
     this.start=Date.now();  
     next();
});
tourSchema.post(/^find/,function(docs,next){
    console.log(`Query took ${Date.now()-this.start} milliseconds`);
    // console.log(docs);
    next();
})
tourSchema.pre(/^find/,function(next){
    this.populate({path:'guides',select:'-__v -passwordChangedAt'});
    next();
});
//AGRREGATION MIDDLEWARE
// tourSchema.pre('aggregate',function(next){
//     this.pipeline().unshift({$match:{secretTour:{$ne:true}}});
//     console.log(this.pipeline());
//     next();
// })

const Tour=mongoose.model('Tour',tourSchema); 
module.exports=Tour;