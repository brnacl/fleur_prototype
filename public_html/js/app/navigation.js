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