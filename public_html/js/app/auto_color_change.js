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