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

function nav_clicks() {
    //TABS
    $('li.tab-1').click(function(){
        window.location = 'list#to-do';
    });
    $('li.tab-2').click(function(){
        window.location = 'list#archive';
    });
    $('li.tab-3').click(function(){
        window.location = 'list#trash';
    });

    //ADD/DISMISS BUTTON
    $('button.add-button').click(function(){
        window.location = 'list#add';
    });
    $('button.dismiss-button').click(function(){
        window.location = 'list#to-do';
        if(window.edit_item_id && window.edit_item_id > 0){
            todo_putback(window.edit_item_id, window.active_list_id,0);
            window.edit_item_id = 0;
        }
        if(window.active_list_id){
            $('h1.current-list').text($('ul#list-dropdown > li#'+window.active_list_id).text());
            $('ul.hidden-list').addClass('active-list');
            $('ul.hidden-list').removeClass('hidden-list');
        }
    });
}

function todo_complete(id,list_id){
    $.ajax({
        type: 'get',
        url: '../list.php',
        data: {function: 'todo_complete', id: id},
        success: function(response){
            setTimeout(function(){
                clearTimeout(window.color_timeout[id]);
                $('li#'+id).remove();
                //$('ul#in-focus li#'+id).remove();
                is_empty(list_id);
                $('ul#archive').prepend(response);
            }, 100);
        }
    });
}

function todo_promote(id){
    var in_focus_id = $('ul#in-focus li').attr('id'), in_focus_list_id = $('ul#in-focus li').attr('data-listid');
    $.ajax({
        type: 'get',
        url: '../list.php',
        data: {function: 'todo_promote', id: id},
        success: function(response){
            clearTimeout(window.color_timeout[id]);
            $('li#'+id).remove();
            if(in_focus_id) {
                $('ul#in-focus li.to-do').replaceWith(response);
                todo_demote(in_focus_id,in_focus_list_id);
            } else {
                $('ul#in-focus').append(response);

            }
            set_color_interval('in-focus',id);
        }
    });
}

function todo_demote(id,list_id){
    $.ajax({
        type: 'get',
        url: '../list.php',
        data: {function: 'todo_demote', id: id},
        success: function(response){
            clearTimeout(window.color_timeout[id]);
            $('li#'+id).remove();
            var list_length=($('ul#'+list_id+' > li').size());
            if(list_length===0) {
                $('#to-do-container ul#'+list_id).append(response);
            } else {
                var last_child_id = +$('ul#'+list_id+' li.to-do:last-child').attr('id');
                if (id < last_child_id) {
                    $(response).insertAfter('li#'+last_child_id);
                } else {
                    for (var l=1;l<=list_length;l++){
                        var list_item_id = +$('ul#'+list_id+' li:nth-child('+l+')').attr('id');
                        if (id > list_item_id){
                            $(response).insertBefore('li#'+list_item_id);
                            break;
                        }
                    }
                }
            }
            set_color_interval('to-do',id);
        }
    });
}

function todo_trash(id,list_id){
    $.ajax({
        type: 'get',
        url: '../list.php',
        data: {function: 'todo_trash', id: id},
        success: function(response){
            clearTimeout(window.color_timeout[id]);
            $('li#'+id).remove();
            if(list_id != 'archive'){
                is_empty(list_id);
            }
            var list_length=($('ul#trash > li').size());
            if(list_length===0) {
                $('#trash-container ul#trash').append(response);
            } else {
                var last_child_id = +$('ul#trash > li:last-child').attr('id');
                if (id < last_child_id) {
                    $(response).insertAfter('li#'+last_child_id);

                } else {
                    for (var l=1;l<=list_length;l++){
                        var list_item_id = +$('ul#trash > li:nth-child('+l+')').attr('id');
                        if (id > list_item_id){
                            $(response).insertBefore('ul#trash > li#'+list_item_id);
                            break;
                        }

                    }

                }
            }
        }
    });
}

function todo_putback(id,list_id,completed){
    $.ajax({
        type: 'get',
        url: '../list.php',
        data: {function: 'todo_putback', id: id, list_id: list_id},
        success: function(response){
            var list_length;
            var l;
            if($('ul#trash > li#'+id)){
                $('ul#trash > li#'+id).remove();
            }
            if(list_id=='archive'){
                list_length=($('ul#archive li.to-do').size());
                if(list_length===0) {
                    $('#archive-container ul#archive').append(response);
                } else {
                    var last_child_completed = +$('ul#archive li.to-do:last-child').attr('data-completed');

                    if (completed > last_child_completed) {
                        $(response).insertAfter('ul#archive li.to-do:last-child');
                    } else {
                        for (l=1;l<=list_length;l++){
                            var archive_completed = +$('ul#archive > li:nth-child('+l+')').attr('data-completed');
                            if (completed >= archive_completed){
                                $(response).insertBefore('ul#archive > li:nth-child('+l+')');
                                break;
                            }
                        }
                    }
                }
            } else {
                list_restore(list_id);
                list_length=($('#to-do-container ul#'+list_id+' li.to-do').size());
                if(list_length===0) {

                    $('#to-do-container ul#'+list_id).append(response);
                } else {
                    var last_child_id = +$('ul#'+list_id+' li.to-do:last-child').attr('id');
                    if (id < last_child_id) {
                        $(response).insertAfter('li#'+last_child_id);
                    } else {
                        for (l=1;l<=list_length;l++){
                            var list_item_id = +$('ul#'+list_id+' > li:nth-child('+l+')').attr('id');
                            if (id > list_item_id){
                                $(response).insertBefore('li#'+list_item_id);
                                break;
                            }
                        }
                    }
                }

                if($('ul#list-dropdown li#'+list_id+ ' span').hasClass('empty-list')) {
                    $('ul#list-dropdown li#'+list_id+ ' span').removeClass('empty-list');
                    $('ul#list-dropdown li#'+list_id+ ' button.trash-symbol').css('display','none');
                }
                set_color_interval('to-do',id);
            }
        }
    });
}

function todo_edit() {
    $('#to-do-container').on('dblclick', 'p.to-do-text', function() {
        if(window.edit_item_id && window.edit_item_id != +$(this).parent().attr('id')){
            todo_putback(window.edit_item_id, window.active_list_id,0);
        }
        clearTimeout(window.color_timeout[$(this).parent().attr('id')]);
        $(this).parent().remove();
        window.edit_item_id = +$(this).parent().attr('id');
        window.active_list_id = +$(this).parent().attr('data-listid');
        window.location = 'list#edit';
        $('form#edit-to-do textarea').val($(this).text());
    });
}

function todo_undo(id,list_id){
    $.ajax({
        type: 'get',
        url: '../list.php',
        data: {function: 'todo_undo', id: id},
        success: function(response){
            $('ul#archive > li#'+id).remove();
            list_restore(list_id);

            var list_length=($('ul#'+list_id+' > li').size());
            if(list_length===0) {
                $('#to-do-container ul#'+list_id).append(response);
            } else {
                var last_child_id = +$('ul#'+list_id+' li.to-do:last-child').attr('id');
                if (id < last_child_id) {
                    $(response).insertAfter('li#'+last_child_id);
                } else {
                    for (var l=1;l<=list_length;l++){
                        var list_item_id = +$('ul#'+list_id+' > li:nth-child('+l+')').attr('id');
                        if (id > list_item_id){
                            $(response).insertBefore('li#'+list_item_id);
                            break;
                        }
                    }
                }
            }
            if($('ul#list-dropdown li#'+list_id+ ' span').hasClass('empty-list')) {
                $('ul#list-dropdown li#'+list_id+ ' span').removeClass('empty-list');
                $('ul#list-dropdown li#'+list_id+ ' button.trash-symbol').css('display','none');
            }
            set_color_interval('to-do',id);
        }
    });
}

function todo_delete(id){
    $.ajax({
        type: 'get',
        url: '../list.php',
        data: {function: 'todo_delete', id: id},
        success: function(){
            $('li#'+id).remove();
        }
    });
}

function list_delete(id) {
    var reply = confirm('DELETE the list '+$('ul#list-dropdown > li#'+id).text().toUpperCase()+' and all its To-Dos?');
    if(reply){
        $.ajax({
            url: '../list.php',
            type: 'get',
            data: {function: 'list_delete', id: id},
            success: function(response){
                 $('ul#list-dropdown').empty();
                 $('ul#list-dropdown').append(response);
                 if($('ul.active-list').attr('id') == id){
                    window.active_list_id = +$('ul#list-dropdown > li:first-child').attr('id');

                    $('#to-do-container ul#'+window.active_list_id).addClass('active-list');
                    $('h1.current-list').text($('ul#list-dropdown li#'+window.active_list_id).text());
                    $('#to-do-container ul#'+id).remove();
                    $('#to-do-container > ul.multi-list').each(function(){
                        is_empty($(this).attr('id'));
                    });
                }
            }
        });
         no_todos();
    }
}

function new_list_form_submit(){
    $('form#add-new-list textarea').keypress(function (e) {
        if (e.which == 13) {
            $('form#add-new-list').submit();
            e.preventDefault();
        }
    });
    var request;
    $('form#add-new-list').submit(function(event){
        if (request) {
            request.abort();
        }
        var $form = $(this);
        var $inputs = $form.find('input, select, button, textarea');
        var title = $('form#add-new-list textarea').val();
        $inputs.prop('disabled', true);
        request = $.ajax({
            url: '../list.php',
            type: 'get',
            data: {function: 'list_create', title: title}
        });
        request.done(function (response){
            $('form#add-new-list')[0].reset();
            window.active_list_id = +response;
            $('h1.current-list').text(title);
            $('#to-do-container').append('<ul id="'+response+'" class="multi-list"></ul>');
            $('#to-do-container ul#' + response).addClass('active-list');
            get_lists();
            window.location = 'list#add';
        });
        request.always(function () {
            $inputs.prop('disabled', false);
        });
        event.preventDefault();
    });
}

function list_select(){
    $('button.list-select').hover(function(){
        $('ul#list-dropdown > li').each(function(){
          $('ul#list-dropdown > li').removeClass('no-display');
        });
    });

    $('ul#list-dropdown').on('click', 'li span', function() {

        if(window.edit_item_id > 0){
            todo_putback(window.edit_item_id,window.active_list_id,0);
            $('form#edit-to-do')[0].reset();
            window.edit_item_id = 0;
        }
        $('h1.current-list').text($(this).text());
        if($(this).parent().attr('id') == 'new-list'){
            window.active_list_id = 0;
            $('h1.current-list').text($(this).text());
            window.location = 'list#new';
        } else {
            $('ul.active-list').removeClass('active-list');
            $('#to-do-container ul#' + $(this).parent().attr('id')).addClass('active-list');

            window.location = 'list#to-do';
            window.active_list_id = $(this).parent().attr('id');
        }
        $('ul#list-dropdown > li').each(function(){
          $('ul#list-dropdown > li').addClass('no-display');
        });
    });
}

function add_form_submit(){
    $('form#add-to-do textarea').keypress(function (e) {
        if (e.which == 13) {
            $('form#add-to-do').submit();
            e.preventDefault();
            $('form#add-to-do textarea').attr('placeholder', '...');
        }
    });
    var request;
    $('form#add-to-do').submit(function(event){
        if (request) {
            request.abort();
        }
        var $form = $(this);
        var $inputs = $form.find('input, select, button, textarea');
        var content = $('form#add-to-do textarea').val();
        var list_id = $('ul.active-list').attr('id');
        $inputs.prop('disabled', true);
        request = $.ajax({
            url: '../list.php',
            type: 'get',
            data: {function: 'todo_create', content: content, list_id: list_id}
        });
        request.done(function (response){
            $('form#add-to-do')[0].reset();
            $('ul.active-list').prepend(response);
            set_color_interval('to-do',$('ul.active-list > li.to-do:first-child').attr('id'));
            var list_id = $('ul.active-list').attr('id');
            if($('ul#list-dropdown li#'+list_id+ ' span').hasClass('empty-list')) {
                $('ul#list-dropdown li#'+list_id+ ' span').removeClass('empty-list');
                $('ul#list-dropdown li#'+list_id+ ' button.trash-symbol').css('display','none');
            }
        });
        request.always(function () {
            $inputs.prop('disabled', false);
        });
        event.preventDefault();
    });
}

function edit_form_submit(){
    $('form#edit-to-do textarea').keypress(function (e) {
        if (e.which == 13) {
            $('form#edit-to-do').submit();
            e.preventDefault();
        }
    });
    var request;
    $('form#edit-to-do').submit(function(event){
        if (request) {
            request.abort();
        }
        var $form = $(this);
        var $inputs = $form.find('input, select, button, textarea');
        var content = $('form#edit-to-do textarea').val();
        $inputs.prop('disabled', true);
        request = $.ajax({
            url: '../list.php',
            type: 'get',
            data: {function: 'todo_edit', content: content, id: window.edit_item_id}
        });
        request.done(function (){
            $('form#edit-to-do')[0].reset();
            todo_putback(window.edit_item_id, window.active_list_id,0);
            window.edit_item_id = 0;
            window.location = 'list#to-do';
        });
        request.always(function () {
            $inputs.prop('disabled', false);
        });
        event.preventDefault();
    });
}

function get_lists() {
     $.ajax({
        type: 'get',
        url: '../list.php',
        data: {function: 'get_lists'},
        success: function(response){
            $('ul#list-dropdown').empty();
            $('ul#list-dropdown').append(response);
            $('ul.hidden-list').removeClass('hidden-list');
            $('#to-do-container > ul.multi-list').each(function(){
                is_empty($(this).attr('id'));
            });
        }
    });
}

function is_empty(list_id){
    if($('ul#'+list_id+' > li').size() === 0 && $('ul#in-focus > li').attr('data-listid') != list_id) {
        $('ul#list-dropdown li#'+list_id+ ' span').addClass('empty-list');
        $('ul#list-dropdown li#'+list_id+ ' button.trash-symbol').css('display','block');
    }
}

function list_restore(list_id){
    if(!$('#to-do-container ul#'+list_id).length){
        $.ajax({
            type: 'get',
            url: '../list.php',
            data: {function: 'list_restore', id: list_id},
            success: function(result){
                window.active_list_id = +list_id;
                $('h1.current-list').text(result);
            }
        });
        $('#to-do-container').append('<ul id="'+list_id+'" class="multi-list"></ul>');
        $('#to-do-container ul#' + list_id).addClass('active-list');
        get_lists();
    }
}

function tab_select(anchor){
    switch(anchor){
        case '#to-do':

            $('.tab-1').addClass('active-tab color-1');
            $('.tab-2,.tab-3').removeClass('active-tab color-1');
            $('#in-focus-container,#to-do-container,button.add-button').css('display','block');
            $('#new-to-do-container,button.dismiss-button,#archive-container,#trash-container,#new-list-container,#edit-to-do-container').css('display','none');
            $('form#add-to-do')[0].reset();
            $('form#add-to-do textarea').attr('placeholder','I need to...');
            $('ul.hidden-list').removeClass('hidden-list');
            if(window.edit_item_id > 0){
                todo_putback(window.edit_item_id,window.active_list_id,0);
                $('form#edit-to-do')[0].reset();
            }
            if(window.active_list_id && window.active_list_id > 0) {
                $('ul.active-list').removeClass('active-list');
                $('#to-do-container ul#'+window.active_list_id).addClass('active-list');
                $('h1.current-list').text($('ul#list-dropdown li#'+window.active_list_id).text());
            } else {
                $('h1.current-list').text($('ul#list-dropdown li#'+$('ul.active-list').attr('id')).text());
            }
            if($('#to-do-container > ul.multi-list').size() === 0){
                setTimeout(function(){window.location = 'list#new';$('form#add-new-list textarea').attr('placeholder', 'You have no to-do lists! Enter the name of your new list here...');},300);

            }

            break;
        case '#archive':
            if($('ul#list-dropdown > li.list-option').size() === 0){
                $('nav ul h1').text('');
            }
            if(window.edit_item_id > 0){
                todo_putback(window.edit_item_id,window.active_list_id,0);
                $('form#edit-to-do')[0].reset();
            }
            window.edit_item_id = 0;
            $('.tab-2').addClass('active-tab color-1');
            $('.tab-1,.tab-3').removeClass('active-tab color-1');
            $('#archive-container,button.add-button').css('display','block');
            $('#to-do-container,#in-focus-container,#trash-container,#new-to-do-container,button.dismiss-button,#new-list-container,#edit-to-do-container').css('display','none');
            break;
        case '#trash':
            if($('ul#list-dropdown > li.list-option').size() === 0){
                $('nav ul h1').text('');
            }
            if(window.edit_item_id > 0){
                todo_putback(window.edit_item_id,window.active_list_id,0);
                $('form#edit-to-do')[0].reset();
            }
            window.edit_item_id = 0;
            $('.tab-3').addClass('active-tab color-1');
            $('.tab-1,.tab-2').removeClass('active-tab color-1');
            $('#trash-container,button.add-button').css('display','block');
            $('#to-do-container,#in-focus-container,#archive-container,#new-to-do-container,#new-list-container,#edit-to-do-container,button.dismiss-button').css('display','none');
            break;
        case '#add':
        if($('#to-do-container > ul.multi-list').size() === 0){
            window.location = 'list#new';
            $('form#add-new-list textarea').attr('placeholder', 'You have no to-do lists! Enter the name of your new list here...');
        } else {
            $('button.add-button, #in-focus-container,#archive-container,#trash-container,#new-list-container,#edit-to-do-container').css('display','none');
            $('#to-do-container,button.dismiss-button,#new-to-do-container').css('display','block');
            $('form#add-to-do textarea').focus();
            $('.tab-1').addClass('active-tab color-1');
            $('.tab-2,.tab-3').removeClass('active-tab color-1');
        }
            break;
        case '#edit':
            if(window.edit_item_id && window.edit_item_id > 0){
                $('button.add-button, #in-focus-container,#archive-container,#trash-container,#new-list-container,#new-to-do-container').css('display','none');
                $('#to-do-container,button.dismiss-button,#edit-to-do-container').css('display','block');
                $('form#edit-to-do textarea').focus();

            } else {
                window.location = 'list#to-do';
            }
            break;
        case '#new':
            $('nav ul h1').text('create a new list');
        if($('#to-do-container > ul.multi-list').size() === 0){
            $('form#add-new-list textarea').attr('placeholder', 'You have no to-do lists! Enter the name of your new list here...');
        }
            if($('h1.current-list').text().toLowerCase() != 'create a new list'){window.location = 'list#to-do';}
            $('#in-focus-container,#archive-container,#trash-container,#new-to-do-container,button.add-button,#edit-to-do-container').css('display','none');
            $('#to-do-container,#new-list-container,button.dismiss-button').css('display','block');
            $('form#add-new-list textarea').focus();
            $('.tab-1').addClass('active-tab color-1');
            $('.tab-2,.tab-3').removeClass('active-tab color-1');
            window.active_list_id = +$('ul.active-list').attr('id');

            $('ul.active-list').addClass('hidden-list');
            $('ul.active-list').removeClass('active-list');
            break;
        default:
            window.location = 'list#to-do';
            break;
    }

}

function window_focus_color_change(){
    var created;
    var elapsed;
    var now = new Date().getTime() / 1000;
    now = Math.round(now);
    var color;
    $('#to-do-container > ul.multi-list').each(function(){
        $(this).find('li.to-do').each(function(){
            if(!$(this).find('label').hasClass('color-15')){
                created = +$(this).attr('data-created');
                elapsed = (now - created);
                if(elapsed >= 604800){
                    color =  15;
                } else if(elapsed >= 561600){
                    color =  14;
                } else if(elapsed >= 518400){
                    color =  13;
                } else if(elapsed >= 475200){
                   color =  12;
                } else if(elapsed >= 432000){
                    color =  11;
                } else if(elapsed >= 388800){
                    color =  10;
                } else if(elapsed >= 345600){
                    color =  9;
                } else if(elapsed >= 302400){
                    color =  8;
                } else if(elapsed >= 259200){
                    color =  7;
                } else if(elapsed >= 216000){
                    color =  6;
                } else if(elapsed >= 172800){
                    color =  5;
                } else if(elapsed >= 129600){
                    color =  4;
                } else if(elapsed >= 86400){
                    color =  3;
                } else if(elapsed >= 43200){
                    color =  2;
                } else {
                    color =  1;
                }
                console.log(color);

                $(this).find('label').removeClass (function (index, css) {
                    return (css.match (/\bcolor-\S+/g) || []).join(' ');
                });
                $(this).find('button.right-side-button').removeClass (function (index, css) {
                    return (css.match (/\bcaret-color-\S+/g) || []).join(' ');
                });
                $(this).find('ul.to-do-menu').removeClass (function (index, css) {
                    return (css.match (/\bcolor-\S+/g) || []).join(' ');
                });
                $(this).find('label').addClass('color-'+color);
                $(this).find('button.right-side-button').addClass('caret-color-'+color);
                $(this).find('ul.to-do-menu').addClass('color-'+color);
            }
        });
    });
}

function set_color_interval(type,id){
    var elapsed;
    var created;
    var interval;
    var list_item;
    var now = new Date().getTime() / 1000;
    now = Math.round(now);
    switch (type){
        case 'to-do':
            list_item = $('ul.multi-list > li#'+id);
            created = +list_item.attr('data-created');
            elapsed = now - created;
            interval = (43200 - (elapsed % 43200)) * 1000;
            if(!list_item.find('label').hasClass('color-15')){
                todo_color_change(list_item,interval);
            }
            break;
        case 'in-focus':
            list_item = $('ul#in-focus li.to-do');
            created = +list_item.attr('data-created');
            elapsed = now - created;
            //interval = (43200 - (elapsed % 43200)) * 1000;
            interval = (43200 - (elapsed % 43200)) * 1000;
            if(!list_item.find('label').hasClass('color-15')){
                infocus_color_change(list_item,interval);
            }
            break;
        default:
            break;
    }

}

function todo_color_change(list_item,interval){
    var label = list_item.find('label');
    var button = list_item.find('button.right-side-button');
    var menu = list_item.find('ul.to-do-menu');
    window.color_timeout[list_item.attr('id')] = setTimeout(function(){
        for(var t=14;t>0;t--){
            if(list_item.find('label').hasClass('color-'+t)){
                label.removeClass('color-'+t);
                label.addClass('color-'+(t+1));

                button.removeClass('caret-color-'+t);
                button.addClass('caret-color-'+(t+1));

                menu.removeClass('color-'+t);
                menu.addClass('color-'+(t+1));
                break;
            }
        }
        todo_color_change(list_item,43200000);
    }, interval);
}

function infocus_color_change(list_item,interval){
    var label = list_item.find('label');
    window.color_timeout[list_item.attr('id')] = setTimeout(function(){
        for(var t=14;t>0;t--){
            if(label.hasClass('color-'+t)){
                label.removeClass('color-'+t);
                label.addClass('color-'+(t+1));
                break;
            }
        }
        infocus_color_change(list_item,43200000);
    }, interval);
}

function todo_focus_color_change(){
    var created;
    var elapsed;
    var now = new Date().getTime() / 1000;
    now = Math.round(now);
    var color;
    $('#to-do-container > ul.multi-list').each(function(){
        $(this).find('li.to-do').each(function(){
            if(!$(this).find('label').hasClass('color-15')){
                created = +$(this).attr('data-created');
                elapsed = (now - created);
                color = pick_color(elapsed);

                $(this).find('label').removeClass (function (index, css) {
                    return (css.match (/\bcolor-\S+/g) || []).join(' ');
                });
                $(this).find('button.right-side-button').removeClass (function (index, css) {
                    return (css.match (/\bcaret-color-\S+/g) || []).join(' ');
                });
                $(this).find('ul.to-do-menu').removeClass (function (index, css) {
                    return (css.match (/\bcolor-\S+/g) || []).join(' ');
                });
                $(this).find('label').addClass('color-'+color);
                $(this).find('button.right-side-button').addClass('caret-color-'+color);
                $(this).find('ul.to-do-menu').addClass('color-'+color);
            }
        });
    });
}

function infocus_focus_color_change(){
    var created;
    var elapsed;
    var now = new Date().getTime() / 1000;
    now = Math.round(now);
    var color;
    if(!$('label.top-item-checkbox').hasClass('color-15')){
        created = +$('ul#in-focus > li.to-do').attr('data-created');
        elapsed = (now - created);
        color = pick_color(elapsed);
        $('label.top-item-checkbox').removeClass (function (index, css) {
            return (css.match (/\bcolor-\S+/g) || []).join(' ');
        });
        $('label.top-item-checkbox').addClass('color-'+color);
    }
}

function no_todos() {
    if($('#to-do-container > ul.multi-list').size() === 0){
        window.location = 'list#new';
        $('form#add-new-list textarea').attr('placeholder', 'You have no to-do lists! Enter the name of your new list here...');
    }
}

function pickFormat(infocus, promoted, created){
    var day = new Date().getTime() / 1000;
    var elapsed = Math.round(day - created);
    if(infocus){
        return '<span class="focus-time-value">%-d{</span><span class="focus-time-label">days</span><span class="focus-time-value"> }%-h{</span><span class="focus-time-label">hrs</span><span class="focus-time-value"> }%m{</span><span class="focus-time-label">min</span>}%s';
    } else if(promoted){
       if(elapsed >= 86400){
            return 'Added %d{d }%h{h }%m{m }ago';
        } else {
            return 'Added %-d{d }%-h{h }%-m{m }%s{s }ago';
        }
    } else {
        if(elapsed >= 86400){
            return '<span class="time-value">%D{</span><span class="time-label">days</span><span class="time-value"> }%-h{</span><span class="time-label">hrs</span> }';
        } else {
            return '<span class="time-value">%-H{</span><span class="time-label">hrs</span><span class="time-value"> }%m{</span><span class="time-label">min</span>}';
        }
    }
}

function pick_color(elapsed){
    var color;
    if(elapsed >= 604800){
        color =  15;
    } else if(elapsed >= 561600){
        color =  14;
    } else if(elapsed >= 518400){
        color =  13;
    } else if(elapsed >= 475200){
        color =  12;
    } else if(elapsed >= 432000){
        color =  11;
    } else if(elapsed >= 388800){
        color =  10;
    } else if(elapsed >= 345600){
        color =  9;
    } else if(elapsed >= 302400){
        color =  8;
    } else if(elapsed >= 259200){
        color =  7;
    } else if(elapsed >= 216000){
        color =  6;
    } else if(elapsed >= 172800){
        color =  5;
    } else if(elapsed >= 129600){
        color =  4;
    } else if(elapsed >= 86400){
        color =  3;
    } else if(elapsed >= 43200){
        color =  2;
    } else {
        color =  1;
    }
    return color;
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