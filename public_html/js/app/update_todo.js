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