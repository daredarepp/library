
/* GET catalog page. */

module.exports.catalog_get = function(req,res,next){
    res.render('catalog',{title: "Catalog"});
};