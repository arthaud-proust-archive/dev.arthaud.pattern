// $( ()=> {
    // Generator
    var patterns = new Generator();

    $("#gen").click( ()=>{
        let first = parseInt($( "input[name=first]:checked" ).val());
        let range = parseInt($( "input[name=range]" ).val());
        let size = parseInt($( "input[name=size]" ).val());
        let hard = $( "input[name=hard]" ).is(':checked');
        let random = $( "input[name=random]" ).is(':checked');
    
    
        
        patterns.generatePatterns(first, size, range, hard, random);

        $('html, body').animate({
            scrollTop: $("#patterns").offset().top-300
            // scrollTop: $("#control").offset().top
        }, 400);
    });
    $("#clear").click( ()=> {patterns.destroyAll()});
    $("#undo").click( ()=>{patterns.undo();});
    $("#undo").on('webkitAnimationEnd', function() {$(this).removeClass("undo");});



    // Front
    $('input[type="range"]').on('input', function() {
        var $set = $(this).val();
        $(this).next().text($set);
    });
    $("#top").click( ()=>{
        $('html, body').animate({
            scrollTop: 0
        }, 400,function() {
        $("#top").fadeOut();
        });
    });
    $("#bottom").click( ()=>{
        $('html, body').animate({
            scrollTop: $(document).height()
        }, 400,function() {
        $("#bottom").fadeOut();
        });
    });
    $(window).scroll( ()=>{
        let scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
        if ($(window).scrollTop() < 600) {
            $("#top").fadeOut();
        } else if (scrollBottom < 600) {
            $("#bottom").fadeOut();
        } else {
            $("#top").fadeIn();
            $("#bottom").fadeIn();
        }
    });
// });
