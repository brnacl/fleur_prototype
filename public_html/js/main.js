'use strict';

$(window).load(initialize);

function initialize() {
    window.active_list_id = 0;
    window.edit_item_id = 0;
    window.color_timeout = [];

    $.ajaxSetup({ cache: false });

    $(window).bind('hashchange', function() {
        tab_select(document.location.hash);
    });

    $('h1.current-list').text($('ul#list-dropdown > li:first-child').text());

    $('#to-do-container ul#'+$('ul#list-dropdown > li:first-child').attr('id')).addClass('active-list');

    tab_select(document.location.hash);
    list_select();
    edit_form_submit();
    add_form_submit();
    new_list_form_submit();
    todo_edit();
    nav_clicks();

    $('#to-do-container > ul.multi-list').each(function(){
        is_empty($(this).attr('id'));
    });

    $('ul.multi-list > li.to-do').each(function(){
        set_color_interval('to-do',$(this).attr('id'));
    });

    set_color_interval('in-focus',$('ul#in-focus li.to-do').attr('id'));

    $(window).bind('focus',function(){
        todo_focus_color_change();
        infocus_focus_color_change();
    });
}

function tiny_timer_functions(timer,func){
    var tt = $(timer).data('tinyTimer');
    switch(func){
        case 'pause':
           tt.pause();
           break;
        case 'stop':
            tt.stop();
            break;
        case 'resume':
            tt.resume();
            break;
        case 'start':
            tt.start();
            break;
        default:
            break;
    }
}