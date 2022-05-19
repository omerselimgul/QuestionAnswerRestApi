const { type } = require("express/lib/response");
const  mongoose  = require("mongoose");
const { default: slugify } = require("slugify");
const Schema=mongoose.Schema;


const QuestionSchema=new Schema({
    title:{
        type:String,
        required:[true,"Please provide a title"],
        minlength:[10,"Please provide a title at least 10 character"],
        unique:true
    },
    content:{
        type:String,
        required:[true,"Please provide a content"],
        minlength:[10,"Please provide a content at least 10 character"]
    },
    slug:{
        type: String
    },
    creatAt:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user"
    },
    likeCount:{
        type:Number,
        default:0
    },
    likes : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    answerCount:{
        type:Number,
        default:0
    },
    answers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Answer"
        }
    ]
})
QuestionSchema.pre("save",function(next){
    if(!this.isModified("title")){
        next();
    }
    this.slug=this.makeSlug();
    next();
})

QuestionSchema.methods.makeSlug=function(){
    return slugify(this.title, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: /[*+~.()'"!:@]/g, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`

      })
}
module.exports=mongoose.model("Question",QuestionSchema)