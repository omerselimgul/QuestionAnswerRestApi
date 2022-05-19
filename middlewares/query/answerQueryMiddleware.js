const asyncHandler = require("express-async-handler");
const {
    populateHelper,
    paginationHelper } = require("./queryMiddlewaresHelper");



const answerQueryMiddleware = function (model, options) {


    return asyncHandler(async function (req, res, next) {
        const {id}=req.params;

        const arrayName="answers";
        const total=(await model.findById(id))["answerCount"]
        
        const paginationResult=await paginationHelper(total,undefined,req)
        next();

        const startIndex=paginationResult.startIndex

        const limit=paginationResult.limit
            //-----------
        let queryObject={};
        queryObject[arrayName]={$slice:[startIndex,limit]}

        let query=model.find({_id:id},queryObject)

        query =populateHelper(query,options.population)
        const queryResult=await query;

         req.queryResult={
            sucess:true,
            pagination:paginationResult.pagination,
            data:queryResult
        }

        next();
    })
}

module.exports={answerQueryMiddleware}