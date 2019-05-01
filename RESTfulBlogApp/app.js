var express=require("express");
var app=express();
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");
var bodyParser=require("body-parser");
var mongoose=require("mongoose");

//app config
mongoose.connect("mongodb://localhost/restful_blog_app",{useNewUrlParser: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


//mongoose/model config
var blogSchema=new mongoose.Schema({
  title:String,
  image:String,
  body:String,
  created:
    {
      type:Date,
      default:Date.now
    }
});

var Blog=mongoose.model("Blog",blogSchema);
// Blog.create({
//   title:"TestBlog",
//   image:"https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//   body:"Hello this is a blog post!"
// });


//restful routes
app.get("/",function(req,res){
  res.redirect("/blogs");
});

//Index Route
app.get("/blogs",function(req,res){
  Blog.find({},function(err,blogs){
    if (err) {
      console.log(err);
    }
    else {
      res.render("index",{blogs:blogs});
    }
  });
});

//New Route
app.get("/blogs/new",function(req,res){
  res.render("new");
});

//create route
app.post("/blogs",function(req,res){
  Blog.create(req.body.blog,function(err,newlyCreatedBlog){
    if(err){
      console.log(err);
    }
    else {
      res.redirect("/blogs");
    }
  })
});
//show route
app.get("/blogs/:id",function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
    if (err) {
      console.log(err);
    }else {
      res.render("show",{blog:foundBlog});
    }
  });
});

//edit route
app.get('/blogs/:id/edit',function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
    if(err){
      console.log(err);
    }else {
      //console.log(foundBlog);
      res.render("edit",{blog:foundBlog});
    }
  })
});

//update route
app.put("/blogs/:id",function(req,res){
  //findOneAndUpdat(id,newData,callback)
  Blog.findOneAndUpdate(req.params.id,req.body.blog,function(err,UpdatedBlog){
    if(err){
      console.log(err);
    }else{
      res.redirect("/blogs/"+req.params.id);
    }
  })
});

//delete route
app.delete("/blogs/:id",function(req,res){
  //findOneAndDelete takes _id as object.
    Blog.findOneAndDelete({_id:req.params.id},function(err){
      if(err){
        console.log(err);
      }else {
        res.redirect("/blogs");
      }
    })
});

app.listen(4000,function(req,res){
  console.log("Server started!");
});
