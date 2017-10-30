$(document).ready(function(){

    $('.navi a.icon').click(function(){
        event.preventDefault(); 
        $('.navi').toggleClass('responsive');
    });
});