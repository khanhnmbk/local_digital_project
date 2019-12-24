$('a img').hover(function(){
   $(this).closest('.text-border').find('.title').css('color' , '#00cebc');
}, function(){
    $('.title').css('color' , 'white');
});

$('.title').hover(function() {
    $(this).css('color' , '#00cebc');
}, function() {
    $(this).css('color' , 'white');
})

