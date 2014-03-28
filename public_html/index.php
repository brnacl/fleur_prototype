<?php
require_once ('paths.config.php');
require_once (TR_PATH."includes/db_connect.php");
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>Timed Task</title>
    <meta http-equiv="Content-type" content="text/html;charset=UTF-8">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script src="js/timer/jquery.tinytimer.min.js"></script>
</head>
<body style="background: #ffffff url('img/timelyresponse-logo-1.2.png') no-repeat fixed center; ">
<p>
<?php
    if(isset($_SESSION['user'])){
        echo '<a href="memberlist">Memberlist</a> | <a href="edit_account">Edit Account</a> | <a href="logout">Logout</a> | <a href="list">To-Do List</a> | Logged in as: '.htmlentities($_SESSION['user']['username'], ENT_QUOTES, 'UTF-8');
    }
    else {
        echo '<a href="login">Login</a> | <a href="register">Register</a>';
    }
?>
</p>
</body>
</html>