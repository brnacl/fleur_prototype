<?php
/**
 * Created by Arenz Designworks.
 * User: Brian
 * Date: 8/27/13
 * Time: 2:08 AM
 * To change this template use File | Settings | File Templates.
 */
?>
<!DOCTYPE html>
<!--[if IE 8]>               <html class="no-js lt-ie9" lang="en" > <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en" > <!--<![endif]-->

<html>

<head>
    <meta charset="utf-8">

    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"><!-- this disallows magnification between portrait and landscape views on mobile. Also disables pinch zooming-->
    <title>Fleur | To-Do's with a Twist of Time</title>


    <!--- IMPORTANT: THE ORDER OF THE STYLE SHEETS IS STRICTLY HIERARCHICAL-->
    <!--zurb normalize style sheet-->  <link rel="stylesheet" href="css/normalize.css">

    <!--zurb foundation grid system, visibility system-->  <link rel="stylesheet" href="css/foundation.css">

    <!--fleur resets & basics--> <link rel="stylesheet" href="css/reset-n-base.css">

    <!--background style sheet--> <link rel="stylesheet" href="css/background-2.css">

    <!--header style sheet--> <link rel="stylesheet" href="css/header-1.css">

    <!--header style sheet--> <link rel="stylesheet" href="css/top-nav-1.css">

    <!--add item style sheet--> <link rel="stylesheet" href="css/add-to-do-box-3.css">

    <!--add list style sheet <link rel="stylesheet" href="css/add-list-1.css">-->

    <!--to-do-list style sheet--> <link rel="stylesheet" href="css/to-do-list-1.css">

    <!--focused task style sheet--> <link rel="stylesheet" href="css/focused-task-2.css">

    <!--checkbox style sheet--> <link rel="stylesheet" href="css/checkbox-3.css">

    <!--footer style sheet--> <link rel="stylesheet" href="css/footer-1.css">

    <!--color style sheet--> <link rel="stylesheet" href="css/color-set-4.css"> <!--must be the final css doc in hierarchy-->

    <!--custom style sheet--> <link rel="stylesheet" href="css/brian.css">

    <!--lato font--> <link href='http://fonts.googleapis.com/css?family=Lato:100,300,400,700,900' rel='stylesheet' type='text/css'>

    <!--open sans font-->   <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,' rel='stylesheet' type='text/css'>

<style>

/**********Toggle the below styles using the display property to see different state views******/
section#in-focus-container{
display: none;
}

section#new-to-do-container {
isplay: none;
}


/***********Comment out the below changes to see the no margin view of the header & nav**********/

header {
height: 136px;
}

.logo-medium-up {
left: 46px;
top: 46px;
}

main {
height: calc(100% - 15px);
}


@media only screen and (min-width: 768px) {
    main nav{
    border-radius: 2px 2px 0 0;
    margin-top: 15px;
    }
}
</style>
<script src="js/vendor/custom.modernizr.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="js/vendor/jquery.pajinate.js"></script>
<script src="js/timer/jquery.tinytimer.min.js"></script>
<script src="js/app/navigation.js"></script>
<script src="js/app/update_todo.js"></script>
<script src="js/app/update_list.js"></script>
<script src="js/app/auto_color_change.js"></script>
<script src="js/main.js"></script>
</head>

<body>

<header>
    <img class="logo-medium-up hide-for-small" src="img/fleur-logo-82.png">
    <nav class="user-menu upper-right hide-for-small">
        <ul class="logged-in-user">
            <li><?php echo htmlentities($_SESSION['user']['username'], ENT_QUOTES, 'UTF-8'); ?></li>
        </ul>
        <ul class="user-menu-dropdown">
            <li class=""><a  >Fleur Plus with Multi-List</a></li>
            <li class=""><a  >Account & Password</a></li>
            <li class=""><a  href="logout">Log Out</a></li>
        </ul>
    </nav>
</header>