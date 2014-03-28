<?php
/**
 * Created by Arenz Designworks.
 * User: Brian
 * Date: 7/26/13
 * Time: 2:32 PM
 * To change this template use File | Settings | File Templates.
 */

require_once ('paths.config.php');
require_once (TR_PATH."includes/db_connect.php");
require_once (TR_PATH."includes/plugins.php");

if(empty($_SESSION['user'])) {
    header("Location: login");
    die("Redirecting to login");
}

if(isset($_GET['function'])){
    if(isset($_SESSION['user'])){
        $username = $_SESSION['user']['username'];
        switch($_GET['function']){
            case 'todo_create':
                $content = $_GET['content'];
                $list_id = $_GET['list_id'];
                $new_id = add_list_item($db, $username, $content, $list_id);
                echo get_todos($db, $username, false, false, $new_id);
                break;
            case 'todo_complete':
                $id = $_GET['id'];
                update_todo($db, $username, 'archive_todo', $id);
                echo get_archive($db, $username, $id);
                break;
            case 'todo_promote':
                $id = $_GET['id'];
                update_todo($db, $username, 'promote_todo', $id);
                echo get_todos($db, $username, false, true, $id);
                break;
            case 'todo_demote':
                $id = $_GET['id'];
                update_todo($db, $username, 'demote_todo', $id);
                echo get_todos($db, $username, false, false, $id);
                break;
            case 'todo_trash':
                $id = $_GET['id'];
                update_todo($db, $username, 'trash_todo', $id);
                echo get_trash($db, $username, $id);
                break;
            case 'todo_putback':
                $id = $_GET['id'];
                $list_id = $_GET['list_id'];
                update_todo($db, $username, 'put_back', $id);
                if($list_id == 'archive'){
                    echo get_archive($db, $username, $id);
                } else {
                    echo get_todos($db, $username, false, false, $id);
                }
                break;
            case 'todo_undo':
                $id = $_GET['id'];
                update_todo($db, $username, 'restore_todo', $id);
                echo get_todos($db, $username, false, false, $id);
                break;
            case 'todo_delete':
                $id = $_GET['id'];
                update_todo($db, $username, 'delete', $id);
                break;
            case 'todo_edit':
                $content = $_GET['content'];
                $id = $_GET['id'];
                edit_list_item($db, $username, $content, $id);
                break;
            case 'get_lists':
                echo get_lists($db, $username,false);
                break;
            case 'get_listname':
                $id = $_GET['id'];
                echo get_lists($db, $username,$id);
                break;
            case 'list_create':
                $title = $_GET['title'];
                echo new_list($db, $username, $title);
                break;
            case 'list_delete':
                $id = $_GET['id'];
                delete_list($db, $username, $id);
                echo get_lists($db, $username,false);
                break;
            case 'list_restore':
                $id = $_GET['id'];
                list_restore($db, $username, $id);
                echo get_lists($db, $username,$id);
                break;
            case 'focus_timer_pause':
                $id = $_GET['id'];
                focus_timer_pause($db, $username, $id);
                break;
            default:
                break;
        }
    }
} else {
    include(TR_PATH."includes/template.header.php");
    include(TR_PATH."includes/template.list.php");
    include(TR_PATH."includes/template.footer.php");
}