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