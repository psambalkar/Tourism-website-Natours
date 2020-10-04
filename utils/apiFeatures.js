class APIFeatures{
    constructor(query,queryString){
        this.query=query;
        this.queryString=queryString;
    }
    filter(){
        const queryObj={...this.queryString};
        const excludedFields=['page','sort','limit','fields'];
        excludedFields.forEach(el=> {delete queryObj[el]});
        //2)Advance Filtering
        let queryStr=JSON.stringify(queryObj);
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);   //this will replcae the gte,lte,gt,lt with the $gte,$lte,$lt,$gt  \b is used for exact match 
        // console.log(JSON.parse(queryStr));
       this.query= this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort(){
        if(this.queryString.sort){
            const sortBy=this.queryString.sort.split(',').join(' ');
            // console.log(sortBy);
            this.query=this.query.sort(sortBy);    //to sort the this.query in ascending order if there is a sort paramater
            //sortby='price difficulty'
        }else{
            this.query=this.query.sort('-createdAt')    //else sort by created at
        }
        return this;
    }
    limitFields(){
        if(this.queryString.fields){
            const select=this.queryString.fields.split(',').join(' ');
            this.query=this.query.select(select);    
        }else{
            this.query=this.query.select('-__v');
        }
        return this;
    }
    paginate(){
        const page=this.queryString.page*1||1;
        const limit=this.queryString.limit*1||100;
        const skip=(page-1)*limit;
        this.query=this.query.skip(skip).limit(limit);
        return this;
    }
    
}
module.exports=APIFeatures;

// const tours=await Tour.find({
    //     duration:parseInt(req.query.duration),
    //     difficulty:req.query.difficulty
    // })
    //1)Filtering
    // const queryObj={...req.query};
    // const excludedFields=['page','sort','limit','fields'];
    // excludedFields.forEach(el=> {delete queryObj[el]});
    // //2)Advance Filtering
    // let queryStr=JSON.stringify(queryObj);
    // queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);   //this will replcae the gte,lte,gt,lt with the $gte,$lte,$lt,$gt  \b is used for exact match 
    // // console.log(JSON.parse(queryStr));
    // let query=Tour.find(JSON.parse(queryStr));
    // console.log(req.query);
     //3)Sorting
    // if(req.query.sort){
    //     const sortBy=req.query.sort.split(',').join(' ');
    //     // console.log(sortBy);
    //     query=query.sort(sortBy);    //to sort the query in ascending order if there is a sort paramater
    //     //sortby='price difficulty'
    // }else{
    //     query=query.sort('-createdAt')    //else sort by created at
    // }
    //4)field limiting and projecting
    // if(req.query.fields){
    //     const select=req.query.fields.split(',').join(' ');
    //     query=query.select(select);    
    // }else{
    //     query=query.select('-__v');
    // }
    //5)pagination 
    //  const page=req.query.page*1||1;
    //  const limit=req.query.limit*1||100;
    //  const skip=(page-1)*limit;
    //  query=query.skip(skip).limit(limit);
    //  if(req.query.page){
    //      const numTours=await Tour.countDocuments();
    //      if(skip>=numTours)throw new Error('This page does not exist');
    //  }