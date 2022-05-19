
const asyncHandler=require("express-async-handler");
const { searchHelper,populateHelper,questionSortHelper,paginationHelper } = require("./queryMiddlewaresHelper");

const questionQueryMiddlewares= function(model,options){


    return asyncHandler(async function(req,res,next){
            //initial Query
            let query=model.find();
            //Search
            query=searchHelper("title",query,req)

            if(options && options.population){
                query=populateHelper(query,options.population)
            }
            query =questionSortHelper(query,req)

            const total =await model.countDocuments();
            const paginationResult =await paginationHelper(total,query,req)

            query=paginationResult.query;
            const pagination =paginationResult.pagination
            const queryResult=await query

            res.queryResult={
                success:true,
                count:queryResult.length,
                pagination:pagination,
                data:queryResult

            }
            next();
    })
}

module.exports={
    questionQueryMiddlewares
}