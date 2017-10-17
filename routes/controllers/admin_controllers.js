

/* GET admin page. */

module.exports.admin_get = function(req,res,next){
    res.render('admin',{title: "Admin"});
};