'use strict';
var appInFocus = [];
var appLists = [];
var appArchive = [];
var appTrash = [];
var appToDo = {};
var appList = {};
var appUser = {};

$(document).ready(initialize);

function initialize() {

  appDataInit();
}

//-------------------------------------//
//---------------CREATE----------------//
//-------------------------------------//
function createToDo (list_id,content){
  var list = getList(list_id);
  if($.isEmptyObject(list)){return false;}
  $.ajax({
    type: 'get',
    url: '../show.php',
    data: {  fn: 'createToDo',
                id: list_id,
                value: content,
              },
    success: function(newToDo){
              newToDo = $.parseJSON(newToDo);
              parseToDo(newToDo[0]);
              list.todos.unshift(newToDo[0]);
              console.log(list.todos[0]);
              }
  });
  return true;
}

function createList(listname){
  $.ajax({
    type: 'get',
    url: '../show.php',
    data: {  fn: 'createList',
                value: listname,
              },
    success: function(newList){
              if(newList !== false){
                newList = $.parseJSON(newList);
                appLists.unshift(newList[0]);
                appLists = appLists.sort(function(a, b) {
                  var textA = a.listname.toUpperCase();
                  var textB = b.listname.toUpperCase();
                  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
              } else {
                alert('An Active List by That Name Already Exists!');
              }
    }
  });
}


//-------------------------------------//
//----------------READ-----------------//
//-------------------------------------//


function appDataInit(){
  var toDo;

  $.getJSON('../show.php', {fn: 'appInFocusInit'},function(infocus){
    $.each(infocus,function(){
      toDo = {};
      toDo = parseToDo(this);
      appInFocus.push(toDo);
    });
    //displayList('infocus');
  });
  $.getJSON('../show.php', {fn: 'appListsInit'},function(lists){
    $.each(lists,function(){
      appLists.push(parseList(this));
    });
    //displayList('todo');
  });
  $.getJSON('../show.php', {fn: 'appArchiveInit'},function(archive){
    $.each(archive,function(){
      toDo = {};
      toDo = parseToDo(this);
      appArchive.push(toDo);
    });
    //displayList('archive');
  });
  $.getJSON('../show.php', {fn: 'appTrashInit'},function(trash){
    $.each(trash,function(){
      toDo = {};
      toDo = parseToDo(this);
      appTrash.push(toDo);
    });
    //displayList('trash');
  });
  $.getJSON('../show.php', {fn: 'appUserIdInit'},function(user){
    appUser = parseUser(user);
  });
}

function hideList(type) {
  $('div#'+type).empty();
}

function displayList(type){
  switch(type){
    case 'infocus':
    $('div#'+type).empty();
    $('div#'+type).append('<ul><h1>InFocus - '+appInFocus.length+'</h1></ul>');
    $.each(appInFocus,function(){
      $('div#' +type+ ' ul').append('<li id="'+this.id+'">'+this.content+'</li>');

    });
    break;
    case 'todo':
    $('div#'+type).empty();
      var listLength;
      if(appList.todos){
        listLength  = appList.todos.length;
        $('div#'+type).append('<ul id="'+appList.id+'"><h1>'+appList.listname+' - '+listLength+'</h1></ul>');
        $.each(appList.todos, function(){
          $('ul#'+this.list_id).append('<li>'+this.id+'->'+this.created+'->'+this.content+'</li>');
        });
      } else {
        listLength = 0;
        $('div#'+type).append('<ul id="'+appList.id+'"><h1>'+appList.listname+' - '+listLength+'</h1></ul>');
      }
    break;

    case 'archive':
    $('div#'+type).empty();
    $('div#'+type).append('<ul><h1>Archive - '+appArchive.length+'</h1></ul>');

    $.each(appArchive,function(){
      $('div#' +type+ ' ul').append('<li id="'+this.id+'">'+this.content+'</li>');

    });
    break;

    case 'trash':
    $('div#'+type).empty();
    $('div#'+type).append('<ul><h1>Trash - '+appTrash.length+'</h1></ul>');
    $.each(appTrash,function(){
      $('div#'+type+ ' ul').append('<li id="'+this.id+'">'+this.content+'</li>');
    });
    break;

    default:
    break;
  }
}

function getToDo(type,id) {
  var toDo = {};
  switch(type){
    case 'infocus':
      toDo = _.find(appInFocus, function(todos){ return todos.id === id; });
    break;
    case 'todo':
      for(var x=0;x<appLists.length;x++){

          for(var y=0;y<appLists[x].todos.length;y++){
            if(appLists[x].todos[y].id === id){
              toDo = appLists[x].todos[y];
            }
          }


      }
    break;
    case 'archive':
      toDo = _.find(appArchive, function(todos){ return todos.id === id; });
    break;
    case 'trash':
      toDo = _.find(appTrash, function(todos){ return todos.id === id; });
    break;
    default:

    return false;
  }
return toDo;
}

function getList (id) {
  var list = _.find(appLists, function(lists){ return lists.id === id; });
  return list;
}


//-------------------------------------//
//---------------UPDATE----------------//
//-------------------------------------//
function updateToDo (toDo){ //Takes an object in JSON format
  if(isCorrupt(toDo)){return 'corrupt';}
  $.ajax({
    type: 'get',
    url: '../show.php',
    data: {  fn: 'updateToDo',
                todo: toDo
              },
    success: function(response) {
      console.log(response);
    }
  });
}

function editToDo (id,content) {
  var toDo = getToDo('todo',id);
  if($.isEmptyObject(toDo)){return false;}
  toDo.content = content;
  return updateToDo(toDo);
}

function moveToDo (id,orig,dest) {

  var toDo = {}, list = {}, index, timeStamp;
  timeStamp = Math.round((new Date().getTime()) / 1000);
  switch(orig){
    case 'infocus':
      toDo = getToDo('infocus',id);
      if(isCorrupt(toDo)){return 'corrupt';}
      if(!$.isEmptyObject(toDo)){
        list = getList(toDo.list_id);
        toDo.promoted = 0;
        toDo.in_focus_total += timeStamp - toDo.in_focus;
        toDo.in_focus = 0;
        switch(dest){
          case 'todo':
            list.todos.push(toDo);
            list.todos.sort(function(a,b) { return a.id - b.id; });
            list.todos.reverse();
          break;
          case 'archive':
            appArchive.push(toDo);
            appArchive.sort(function(a,b) { return a.completed - b.completed; });
            appArchive.reverse();
            toDo.status = 1;
            toDo.completed = timeStamp;
          break;
          case 'trash':
            appTrash.push(toDo);
            appTrash.sort(function(a,b) { return a.id - b.id; });
            appTrash.reverse();
            toDo.trash = 1;
          break;
          default:
          return false;
        }
        appInFocus = [];
      } else {
        return false;
      }
    break;
    case 'todo':
      toDo = getToDo('todo',id);
      if(isCorrupt(toDo)){return 'corrupt';}

      if(!$.isEmptyObject(toDo)){
        list = getList(toDo.list_id);
        index = list.todos.indexOf(toDo);
        switch(dest){
          case 'infocus':
            toDo.promoted = 1;
            toDo.in_focus = timeStamp;
            appInFocus.push(toDo);
          break;
          case 'archive':
            toDo.status = 1;
            toDo.completed = timeStamp;
            appArchive.push(toDo);
            appArchive.sort(function(a,b) { return a.completed - b.completed; });
            appArchive.reverse();
          break;
          case 'trash':
            toDo.trash = 1;
            appTrash.push(toDo);
            appTrash.sort(function(a,b) { return a.id - b.id; });
            appTrash.reverse();
          break;
          default:
          return false;
        }
        list.todos.splice(index,1);
      } else {
        return false;
      }
    break;
    case 'archive':
      toDo = getToDo('archive',id);
      if(isCorrupt(toDo)){return 'corrupt';}
      if(!$.isEmptyObject(toDo)){
       list = getList(toDo.list_id);
        index = appArchive.indexOf(toDo);
        switch(dest){
          case 'todo':
            toDo.status = 0;
            toDo.completed = 0;
            list.todos.push(toDo);
            list.todos.sort(function(a,b) { return a.id - b.id; });
            list.todos.reverse();
          break;
          case 'trash':
            toDo.trash = 1;
            appTrash.push(toDo);
            appTrash.sort(function(a,b) { return a.id - b.id; });
            appTrash.reverse();
          break;
          default:
          return false;
        }
        appArchive.splice(index,1);
      } else {
        return false;
      }
    break;
    case 'trash':
      toDo = getToDo('trash',id);
      if(isCorrupt(toDo)){return 'corrupt';}
      if(!$.isEmptyObject(toDo)){
        index = appTrash.indexOf(toDo);
        list = getList(toDo.list_id);
        toDo.trash = 0;
        switch(dest){
          case 'todo':
            list.todos.push(toDo);
            list.todos.sort(function(a,b) { return a.id - b.id; });
            list.todos.reverse();
          break;
          case 'archive':
            appArchive.push(toDo);
            appArchive.sort(function(a,b) { return a.completed - b.completed; });
            appArchive.reverse();
          break;
          default:
          return false;
        }
        appTrash.splice(index,1);
      } else {
        return false;
      }
    break;
    default:
    return false;
  }
  return updateToDo(toDo);
}

//-------------------------------------//
//--------------DELETE----------------//
//-------------------------------------//
function deleteToDo (id){
  var toDo = {}, index;
  toDo = getToDo('trash',id);
  if($.isEmptyObject(toDo)){ return false; }
  index = appTrash.indexOf(toDo);
  appTrash.splice(index,1);
  $.ajax({ type: 'get', url: '../show.php', data: {  fn: 'deleteToDo', id: id }});
  return true;
}

function deleteList(id){
  var list = getList(id);
  var index = appLists.indexOf(list);
  appLists.splice(index,1);
  $.ajax({
    type: 'get',
    url: '../show.php',
    data: {  fn: 'deleteList',
                id: id,
              }
  });
}


//-------------------------------------//
//--------------UTILITIES----------------//
//-------------------------------------//
function parseUser(user) {
  var obj = Object.defineProperties({}, {
              id : {
                value : parseInt(user.id,10),
                writable : false
              },
              username : {
                value : user.username,
                writable : false
              }
            });
  return obj;
}

function parseToDo(toDo) {
  var obj = Object.defineProperties({}, {
              id : {
                value : parseInt(toDo.id,10),
                writable : false
              },
              created : {
                value : parseInt(toDo.created,10),
                writable : false
              },
              user_id : {
                value: parseInt(toDo.user_id,10),
                writable: false
              },
              list_id : {
                value: parseInt(toDo.list_id,10),
                writable: false
              }
            });
    obj.in_focus = parseInt(toDo.in_focus,10);
    obj.in_focus_total = parseInt(toDo.in_focus_total,10);
    obj.completed = parseInt(toDo.completed,10);
    obj.trash = parseInt(toDo.trash,10);
    obj.status = parseInt(toDo.status,10);
    obj.promoted = parseInt(toDo.promoted,10);
    obj.content = toDo.content;
  return obj;
}

function parseList(list) {
    var toDo = {};
    var obj = Object.defineProperties({}, {
              id : {
                value : parseInt(list.id,10),
                writable : false
              },
              created : {
                value : parseInt(list.created,10),
                writable : false
              },
              user_id : {
                value: parseInt(list.user_id,10),
                writable: false
              },
              listname : {
                value: list.listname,
                writable: false
              }
            });
    obj.deleted = parseInt(list.deleted, 10);
    obj.todos = [];
    $.each(list.todos,function(){
      toDo = parseToDo(this);
      obj.todos.push(toDo);
    });
  return obj;
}

function isCorrupt(toDo){
  var corrupt = false;
  var list = getList(toDo.list_id);
  var count = 0;
  $.each(list.todos,function(){
    if(this.id === toDo.id){
      count++;
    }
  });

  for(var prop in toDo){
    if(prop !== 'content'){
      if(toDo[prop] !== parseInt(toDo[prop],10)){
        corrupt = true;
      }
    }
  }

  if(toDo.status > 1 || toDo.trash > 1 || toDo.promoted > 1 || toDo.status > 1 || toDo.user_id !== appUser.id || !list || count >1){
    corrupt = true;
  }

  if((toDo.status === 1 && toDo.promoted === 1) || (toDo.trash === 1 && toDo.promoted === 1)){
    corrupt = true;
  }

  return corrupt;
}