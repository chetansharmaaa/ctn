const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const ejs  = require('ejs')
const express = require('express')

const app = express()
app.set('view engine ', 'ejs');

app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB',{useNewUrlParser:true })

const articleSchema = {
    title:String,
    content:String
};
 
const Article = mongoose.model('Article',articleSchema);

app.route('/article')

.get(function(req,res){
    Article.find(function(err,foundArticles){
        if (!err){
            res.send(foundArticles)
        } else{
            res.send(err)
        }
         
    });

})

.post(function(req,res){
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
        title: req.body.title,
        content : req.body.content

    });
    newArticle.save(function(err){
        if (err){res.send('successfully addeed');}
        
        else{
            res.send(err);

        }
    })
})

.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send('success')
        }
        else{
            res.send(err)
        }
 
    });
 })

 
app.route('/articles/:var')
.get(function(req,res){
    Article.findOne({title:req.params.var},function(err,foundArticles){
        if(foundArticles){
            res.send(foundArticles)
        }else{
            res.send(err)
        }
    })
})
.put(function (req,res) {
    Article.update(
        {title: req.params.var},
        {title: req.body.title , content: req.body.content},
        {overwrite:true},
        function(err,foundArticle){
            if(foundArticle){
                res.send(foundArticle)
            }else{
                res.send(err)
            }
        }
    )
    
})
.patch(function(req,res){
    Article.update(
        {title:req.params.var},
        {$set: req.body},
        function(err,foundArticle){
            if(foundArticle){
                res.send(foundArticle)
            }else{
                res.send(err)
            }
        }

    )
})
.delete(function(req,res){
    Article.deleteOne({
        title: req.params.var
    },function(err){
        if(!err){
            res.send('Succesfully deleted')
        }else{
            res.send(err)
        }
    })
});








app.listen(3000,function(){
    console.log('Server started on post 3000');
});