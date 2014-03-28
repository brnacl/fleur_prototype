<?php
/**
 * Created by Arenz Designworks.
 * User: Brian
 * Date: 8/22/13
 * Time: 4:28 PM
 * To change this template use File | Settings | File Templates.
 */
function get_todos($db, $username, $list_id, $promoted, $id){
    if(isset($_SESSION['user']) && $_SESSION['user']['username'] == $username){
        $query_params['username'] = $username;
        if($promoted){$p=1;} else {$p=0;}
        $query_params = array(':username' => $username, ':promoted' => $p);
        if($id){
            $query = "SELECT id, username, rel_list_id, content, created, status, trash, completed, promoted, in_focus, in_focus_total FROM todos WHERE username = :username AND id = :id";
            $query_params = array(':username' => $username, ':id' => $id);
        } else if ($list_id){
            $query = "SELECT id, username, rel_list_id, content, created, status, trash, completed, promoted, in_focus, in_focus_total FROM todos WHERE username = :username AND rel_list_id = :rel_list_id AND promoted = 0 AND status = 0 AND trash = 0 ORDER BY id DESC";
            $query_params = array(':username' => $username, ':rel_list_id' => $list_id);
        }

        else{
            $query = "SELECT id, username, rel_list_id, content, created, status, trash, completed, promoted, in_focus, in_focus_total FROM todos WHERE username = :username AND status = 0 AND trash = 0 AND promoted = :promoted ORDER BY id DESC";
        }
        try
        {
            $stmt = $db->prepare($query);
            $stmt->execute($query_params);
            $markup = '';
            if($promoted){
                while($row = $stmt->fetch()){
                    $date = $row['created'] * 1000;
                    $color = pickColor('todo', $row['created'], 0);

                    $in_focus = (time() - $row['in_focus_total']) * 1000;

                    // /"<script type='text/javascript'>set_color_interval('in-focus',".$row['created'].",".$row['id'].",".$row['rel_list_id'].");</script>".
                    $markup.="<li id='".$row['id']."' class='to-do' data-listid='".$row['rel_list_id']."' data-created='".$row['created']."'>".
                        "<input type='checkbox' id='checkbox-".$row['id']."-input' class='left' value='1' name='' onclick='todo_complete(&#39;" .$row['id']."&#39;,&#39;" .$row['rel_list_id']."&#39;)'>".
                        "<label for='checkbox-".$row['id']."-input' class='top-item-checkbox color-".$color." special-bg' title='Complete this task!'></label>".
                        "<p class='to-do-text'>".get_lists($db,$username,$row['rel_list_id'])." -> ".htmlentities($row['content'], ENT_QUOTES, 'UTF-8')."</p>".
                        "<p class='focus-time focus-time-".$row['id']."'>".
                            "<script>$('.focus-time-".$row['id']."').tinyTimer({ from: ".$in_focus.", format: pickFormat(true, false, ".$row['created'].") });</script>".
                        "</p>".
                            "<p class='working-on-message'>in focus</p>".
                            "<p class='finished-in-message'>to complete</p>".

                        "<ul class='in-focus-control-menu'>".
                            "<li><button class='unfocus-arrow' onclick='tiny_timer_functions(&#39;.focus-time-" .$row['id']."&#39;,&#39;stop&#39;);todo_demote(&#39;" .$row['id']."&#39;,&#39;" .$row['rel_list_id']."&#39;)'></button></li>".
                            "<li class='pause'><button class='pause-button'></button></li>".
                            "<li class='play no-display'><button class='play-button'></button></li>".
                        "</ul>".
                    "</li>";

                        //"<div class='promoted-age-timer'>".$row['created']."<script>$('.promoted-age-timer').tinyTimer({ from: ".$date.", format: pickFormat(false, true, ".$row['created'].") });</script></div>".


                }
                return $markup;
            } else {

                while($row = $stmt->fetch()){
                    $date = $row['created'] * 1000;
                    $color = pickColor('todo', $row['created'], 0);
                    //"<script type='text/javascript'>set_color_interval('to-do',".$row['created'].",".$row['id'].",".$row['rel_list_id'].");</script>".
                    $markup.="<li id='".$row['id']."' class='to-do' data-listid='".$row['rel_list_id']."' data-created='".$row['created']."'>".
                    "<input type='checkbox' id='checkbox-".$row['id']."-input' class='left' onclick='todo_complete(&#39;" .$row['id']."&#39;,&#39;" .$row['rel_list_id']."&#39;)'>".
                    "<label for='checkbox-".$row['id']."-input' class='color-".$color."' title='Complete this task!'></label>".
                    "<p class='to-do-text'>".htmlspecialchars($row['content'], ENT_QUOTES, 'UTF-8')."</p>".
                    "<ul>".
                        "<li>".
                            "<button class='right-side-button caret-color-".$color."' ></button>".
                            "<ul class='to-do-menu color-".$color."'>".
                                "<div class='close-menu-button show-for-small'></div>".
                                "<li>".
                                    "<button class='focus-arrow' onclick='todo_promote(&#39;" .$row['id']."&#39;)'></button>".
                                    "<button class='trash-symbol' onclick='todo_trash(&#39;" .$row['id']."&#39;,&#39;" .$row['rel_list_id']."&#39;)'></button>".
                                    "<div class='delete-indicator'></div>".
                                    "<li class='age-of-the-to-do timer-".$row['id']."'>".
                                        "<script type='text/javascript'>$('li.timer-".$row['id']."').tinyTimer({ from: ".$date.", format: pickFormat(false, false, ".$row['created'].")});</script>".
                                    "</li>".
                                "</li>".
                            "</ul>".
                        "</li>".
                    "</ul>".
                "</li>";
                }
                return $markup;
            }
        }
        catch(PDOException $ex)
        {
            // Note: On a production website, you should not output $ex->getMessage().
            die("Failed to run query: " . $ex->getMessage());
        }
    } else {
        return false;
    }
}

function get_archive($db, $username, $id){
    if(isset($_SESSION['user']) && $_SESSION['user']['username'] == $username){
        if($id){

            $query = "SELECT id, username, rel_list_id, content, created, status, trash, completed, promoted, in_focus, in_focus_total FROM todos WHERE username = :username AND id = :id";
            $query_params = array(':username' => $username, ':id' => $id);
        } else{
            $query = "SELECT id, username, rel_list_id, content, created, status, trash, completed, promoted, in_focus, in_focus_total FROM todos WHERE username = :username AND status = 1 AND trash = 0 ORDER BY completed DESC";
            $query_params = array(':username' => $username);
        }

        try {
            $stmt = $db->prepare($query);
            $stmt->execute($query_params);
            $markup = '';
            while($row = $stmt->fetch()){
                $totalSec = $row['completed'] - $row['created'];
                $time = displayTime($totalSec);
                $markup.="<li id='".$row['id']."' class='to-do' data-completed='".$row['completed']."' data-listname='".get_lists($db,$username,$row['rel_list_id'])."'>".
                    "<input type='checkbox' id='checkbox-".$row['id']."' class='left' onclick='todo_undo(&#39;" .$row['id']."&#39;,&#39;" .$row['rel_list_id']."&#39;)' value='1' checked='checked'>".
                    "<label for='checkbox-".$row['id']."' class='color-".pickColor('archive', $row['created'], $row['completed'])."' title='Undo this task!'></label>".
                    "<p class='to-do-text archive-content'>".get_lists($db,$username,$row['rel_list_id'])." -> ".htmlentities($row['content'], ENT_QUOTES, 'UTF-8')."</p><p class='to-do-text archive-buttons'><span class='text-color-".pickColor('archive', $row['created'], $row['completed'])."'>".$time."</span><button class='trash-symbol' onclick='todo_trash(&#39;" .$row['id']."&#39;,&#39;archive&#39;)'></button></p>".
                    "</li>";
            }
            return $markup;
        }
        catch(PDOException $ex)
        {
            // Note: On a production website, you should not output $ex->getMessage().
            die("Failed to run query: " . $ex->getMessage());
        }

    } else {
        return false;
    }
}

function get_trash($db, $username, $id){
    if(isset($_SESSION['user']) && $_SESSION['user']['username'] == $username){
        if($id){
            $query = "SELECT id, username, rel_list_id, content, created, status, trash, completed, promoted, in_focus, in_focus_total FROM todos WHERE username = :username AND id = :id";
            $query_params = array(':username' => $username, ':id' => $id);
        } else{
            $query = "SELECT id, username, rel_list_id, content, created, status, trash, completed, promoted, in_focus, in_focus_total FROM todos WHERE username = :username AND trash = 1 ORDER BY id DESC";
            $query_params = array(':username' => $username);
        }
        try
        {
            $stmt = $db->prepare($query);
            $stmt->execute($query_params);
            $markup = '';
            while($row = $stmt->fetch()){
                if($row['status']==1){
                    $list = 'archive';
                } else {
                    $list = $row['rel_list_id'];
                }
                $markup = $markup."<li id='".$row['id']."' class='list-item small-12 large-12 large-centered columns' data-listname='".get_lists($db,$username,$row['rel_list_id'])."'>".
                    "<p class='item-text'>".get_lists($db,$username,$row['rel_list_id'])." -> ".htmlentities($row['content'], ENT_QUOTES, 'UTF-8')." | <span class='put_back' onclick='todo_putback(&#39;" .$row['id']."&#39;,&#39;" .$list."&#39;,&#39;" .$row['completed']."&#39;)'>Put Back</span> | <span class='delete' onclick='todo_delete(&#39;" .$row['id']."&#39;)'>Delete</span></p>".
                    "</li>";
            }
            return $markup;
        }
        catch(PDOException $ex)
        {
            // Note: On a production website, you should not output $ex->getMessage().
            die("Failed to run query: " . $ex->getMessage());
        }
    } else {
        return false;
    }
}

function update_todo($db, $username, $type, $id){
    if(isset($_SESSION['user']) && $_SESSION['user']['username'] == $username){
        switch($type){
            case 'archive_todo':
                $in_focus_total = 0;
                $in_focus = 0;
                $promoted = 0;
                try {
                    $query = "SELECT promoted, in_focus_total, in_focus FROM todos WHERE id = :id";
                    $query_params = array(':id' => $id);
                    $stmt = $db->prepare($query);
                    $stmt->execute($query_params);

                    while($row = $stmt->fetch()){
                            $promoted = $row['promoted'];
                            $in_focus_total = $row['in_focus_total'];
                            $in_focus = $row['in_focus'];
                    }
                    if($promoted>0){
                        $new_in_focus_total = $in_focus_total + (time() - $in_focus);
                        $completed = time();
                        $query = "UPDATE todos SET status = 1, completed = :completed, promoted = 0, in_focus = 0, in_focus_total = :in_focus_total WHERE id = :id";
                        $query_params = array(':id' => $id, ':completed' => $completed, ':in_focus_total' => $new_in_focus_total);
                        $stmt = $db->prepare($query);
                        $stmt->execute($query_params);
                    } else {
                        $completed = time();
                        $query = "UPDATE todos SET status = 1, completed = :completed, in_focus = 0 WHERE id = :id";
                        $query_params = array(':id' => $id, ':completed' => $completed);
                        $stmt = $db->prepare($query);
                        $stmt->execute($query_params);
                    }
                }
                catch(PDOException $ex)
                {
                    // Note: On a production website, you should not output $ex->getMessage().
                    die("Failed to run query: " . $ex->getMessage());
                }
                break;
            case 'promote_todo':
                try {
                    $query = "UPDATE todos SET promoted = 1, in_focus = :in_focus WHERE id = :id";
                    $query_params = array(':id' => $id, ':in_focus' => time());
                    $stmt = $db->prepare($query);
                    $stmt->execute($query_params);
                }
                catch(PDOException $ex)
                {
                    // Note: On a production website, you should not output $ex->getMessage().
                    die("Failed to run query: " . $ex->getMessage());
                }
                break;
            case 'demote_todo':
                $in_focus_total = 0;
                $in_focus = 0;
                try {
                    $query = "SELECT in_focus_total, in_focus FROM todos WHERE id = :id";
                    $query_params = array(':id' => $id);
                    $stmt = $db->prepare($query);
                    $stmt->execute($query_params);
                    while($row = $stmt->fetch()){
                        $in_focus_total = $row['in_focus_total'];
                        $in_focus = $row['in_focus'];
                    }

                    $new_in_focus_total = $in_focus_total + (time() - $in_focus);
                    $query = "UPDATE todos SET promoted = 0, in_focus = 0, in_focus_total = :in_focus_total WHERE id = :id";
                    $query_params = array(':id' => $id, ':in_focus_total' => $new_in_focus_total);
                    $stmt = $db->prepare($query);
                    $stmt->execute($query_params);
                }
                catch(PDOException $ex)
                {
                    // Note: On a production website, you should not output $ex->getMessage().
                    die("Failed to run query: " . $ex->getMessage());
                }
                break;
            case 'trash_todo':
                try {
                    $query = "UPDATE todos SET trash = 1, promoted = 0 WHERE id = :id";
                    $query_params = array(':id' => $id);
                    $stmt = $db->prepare($query);
                    $stmt->execute($query_params);
                }
                catch(PDOException $ex)
                {
                    // Note: On a production website, you should not output $ex->getMessage().
                    die("Failed to run query: " . $ex->getMessage());
                }
                break;
            case 'delete':
                try {
                    $query = "DELETE FROM todos WHERE id = :id";
                    $query_params = array(':id' => $id);
                    $stmt = $db->prepare($query);
                    $stmt->execute($query_params);
                }
                catch(PDOException $ex)
                {
                    // Note: On a production website, you should not output $ex->getMessage().
                    die("Failed to run query: " . $ex->getMessage());
                }
                break;
            case 'restore_todo':
                try {
                    $query = "UPDATE todos SET status = 0, completed = 0 WHERE id = :id";
                    $query_params = array(':id' => $id);
                    $stmt = $db->prepare($query);
                    $stmt->execute($query_params);
                }
                catch(PDOException $ex)
                {
                    // Note: On a production website, you should not output $ex->getMessage().
                    die("Failed to run query: " . $ex->getMessage());
                }
                break;
            case 'put_back':
                try {
                    $query = "UPDATE todos SET trash = 0 WHERE id = :id";
                    $query_params = array(':id' => $id);
                    $stmt = $db->prepare($query);
                    $stmt->execute($query_params);
                }
                catch(PDOException $ex)
                {
                    // Note: On a production website, you should not output $ex->getMessage().
                    die("Failed to run query: " . $ex->getMessage());
                }
                break;
            default:
                return 'fail';
        }
    }
}

function add_list_item($db, $username, $content, $list_id){
    try {
            $query = "INSERT INTO todos(created, rel_list_id, content, username) VALUES (:created, :rel_list_id, :content, :username)";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':created', time(), PDO::PARAM_INT);
            $stmt->bindParam(':content', $content, PDO::PARAM_STR);
            $stmt->bindParam(':username', $username, PDO::PARAM_STR, 255);
            $stmt->bindParam(':rel_list_id', $list_id, PDO::PARAM_INT);
            $stmt->execute();
            return $db->lastInsertId();
        }
        catch(PDOException $ex)
        {
            // Note: On a production website, you should not output $ex->getMessage().
            die("Failed to insert record: " . $ex->getMessage());
        }
}

function edit_list_item($db, $username, $content, $id){
    try {
            $query = "UPDATE todos SET content = :content WHERE id = :id";
            $query_params = array(':id' => $id, ':content' => $content);
            $stmt = $db->prepare($query);
            $stmt->execute($query_params);
            return;
        }
        catch(PDOException $ex)
        {
            // Note: On a production website, you should not output $ex->getMessage().
            die("Failed to update record: " . $ex->getMessage());
        }
}

function new_list($db,$username,$title) {
    if(isset($_SESSION['user']) && $_SESSION['user']['username'] == $username){
         try {
            $query = "INSERT INTO lists(created, username, listname) VALUES (:created, :username, :listname)";
            $stmt = $db->prepare($query);

            $stmt->bindParam(':created', time(), PDO::PARAM_INT);
            $stmt->bindParam(':username', $username, PDO::PARAM_STR, 255);
            $stmt->bindParam(':listname', $title, PDO::PARAM_STR, 255);
            $stmt->execute();
            return $db->lastInsertId();
        }
        catch(PDOException $ex)
        {
            // Note: On a production website, you should not output $ex->getMessage().
            die("Failed to insert record: " . $ex->getMessage());
        }
    }
}

function get_lists($db,$username,$id) {
    if(isset($_SESSION['user']) && $_SESSION['user']['username'] == $username){
        if($id){
            $query = "SELECT id, created, username, listname FROM lists WHERE username = :username  AND id = :id";
            $query_params = array(':username' => $username, ':id' => $id);
        } else {
            $query = "SELECT id, created, username, listname FROM lists WHERE username = :username  AND deleted = 0 ORDER BY listname ASC";
            $query_params = array(':username' => $username);
        }
        try
        {
            $stmt = $db->prepare($query);
            $stmt->execute($query_params);
            $markup = '';

            if($id){
                while($row = $stmt->fetch()){
                    return htmlentities($row['listname'], ENT_QUOTES, 'UTF-8');
                }
            } else {
                while($row = $stmt->fetch()){
                    $markup = $markup."<li id='".$row['id']."' class='list-option'><button class='trash-symbol' type='button' onclick='list_delete(&#39;" .$row['id']."&#39;)'></button><span>".htmlentities($row['listname'], ENT_QUOTES, 'UTF-8')."</span></li>";
                }
                $markup.="<li id='new-list'><span class='create-new-list'><div class='create-new-list-icon'></div>Create a New List</span></li>";
                return $markup;
            }

        }
        catch(PDOException $ex)
        {
            // Note: On a production website, you should not output $ex->getMessage().
            die("Failed to run query: " . $ex->getMessage());
        }
    } else {
        return false;
    }
}

function list_init($db,$username) {
    if(isset($_SESSION['user']) && $_SESSION['user']['username'] == $username){
        $query = "SELECT id, created, username, listname FROM lists WHERE username = :username AND deleted = 0";
        $query_params = array(':username' => $username);
        try
        {
            $stmt = $db->prepare($query);
            $stmt->execute($query_params);
            $markup = '';
            while($row = $stmt->fetch()){
                $markup = $markup."<ul id='".$row['id']."' class='multi-list'>".get_todos($db, $username, $row['id'], false, false)."</ul>";
            }
            return $markup;
        }
        catch(PDOException $ex)
        {
            // Note: On a production website, you should not output $ex->getMessage().
            die("Failed to run query: " . $ex->getMessage());
        }
    }
}

function displayTime($totalSec){
    $years = ( $totalSec / 31536000 ) % 52;
    $weeks = ( $totalSec / 604800 ) % 52;
    $days = ( $totalSec / 86400 ) % 7;
    $hours = ( $totalSec / 3600 ) % 24;
    $minutes = ( $totalSec / 60 ) % 60;
    $seconds = $totalSec % 60;
    if($years > 0){
        return $years.'y '.$weeks.'w '.$days.'d '.$hours.'h '.$minutes.'m ';
    } else if ($weeks > 0){
        return $weeks.'w '.$days.'d '.$hours.'h '.$minutes.'m ';
    } else if($days > 0){
        return $days.'d '.$hours.'h '.$minutes.'m ';
    } else if($hours > 0){
        return $hours.'h '.$minutes.'m ';
    } else if ($minutes > 0){
        return $minutes.'m '.$seconds.'s';
    } else {
        return $seconds.'s';
    }
}

function pickColor($type, $created, $completed){
    switch ($type){
        case 'todo':
            $elapsed = time() - $created;
            break;
        case 'archive':
            $elapsed = $completed - $created;
            break;
        default:
            $elapsed = 0;
            break;
    }

    if($elapsed >= 604800){
        return 15;
    } else if($elapsed >= 561600){
        return 14;
    } else if($elapsed >= 518400){
        return 13;
    } else if($elapsed >= 475200){
        return 12;
    } else if($elapsed >= 432000){
        return 11;
    } else if($elapsed >= 388800){
        return 10;
    } else if($elapsed >= 345600){
        return 9;
    } else if($elapsed >= 302400){
        return 8;
    } else if($elapsed >= 259200){
        return 7;
    } else if($elapsed >= 216000){
        return 6;
    } else if($elapsed >= 172800){
        return 5;
    } else if($elapsed >= 129600){
        return 4;
    } else if($elapsed >= 86400){
        return 3;
    } else if($elapsed >= 43200){
        return 2;
    } else {
        return 1;
    }
}

function getAverage($db, $type){
    if(!empty($_SESSION['user'])){

        $query = "SELECT username, status, trash, completed, created, in_focus_total FROM todos WHERE username = :username AND status = 1 AND trash = 0";
        $query_params = array(':username' => $_SESSION['user']['username']);
        try {
            $stmt = $db->prepare($query);
            $stmt->execute($query_params);

            switch ($type){
                case 'lifetime':
                    $i = 0;
                    $totalsec = 0;
                    while($row = $stmt->fetch()){
                        $i++;
                        $totalsec += $row['completed'] - $row['created'];
                    }
                    break;
                case 'in_focus':
                    $i = 0;
                    $totalsec = 0;
                    while($row = $stmt->fetch()){

                        if($row['in_focus_total'] > 0) {
                            $i++;
                            $totalsec += $row['in_focus_total'];
                        }
                    }
                    break;
            }
            return floor($totalsec / $i);



        } catch(PDOException $ex)
        {
            // Note: On a production website, you should not output $ex->getMessage().
            die("Failed to run query: " . $ex->getMessage());
        }
    }
}

function delete_list($db,$username,$id){
    $items = 0;
    $query_params = array(':username' => $username, ':id' => $id);
    try {
        $query = "SELECT id FROM todos WHERE username = :username AND rel_list_id = :id";
        $stmt = $db->prepare($query);
        $stmt->execute($query_params);

        while($row = $stmt->fetch()){
            $items++;
        }
    } catch(PDOException $ex) {
        die("Failed to run query: " . $ex->getMessage());
    }

    if($items > 0){
        try {
            $query = "UPDATE lists SET deleted = 1 WHERE username = :username AND id = :id";
            $stmt = $db->prepare($query);
            $stmt->execute($query_params);
        }
        catch(PDOException $ex) {
            // Note: On a production website, you should not output $ex->getMessage().
            die("Failed to run query: " . $ex->getMessage());
        }
    } else {
        try {
            $query = "DELETE FROM lists WHERE username = :username AND id = :id";
            $stmt = $db->prepare($query);
            $stmt->execute($query_params);
        }
        catch(PDOException $ex) {
            // Note: On a production website, you should not output $ex->getMessage().
            die("Failed to run query: " . $ex->getMessage());
        }
    }
}

function list_restore($db,$username,$id){
    try {
        $query = "UPDATE lists SET deleted = 0 WHERE username = :username AND id = :id";
        $query_params = array(':username' => $username, ':id' => $id);
        $stmt = $db->prepare($query);
        $stmt->execute($query_params);
    }
    catch(PDOException $ex) {
        // Note: On a production website, you should not output $ex->getMessage().
        die("Failed to run query: " . $ex->getMessage());
    }
}