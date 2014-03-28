<?php
/**
 * Created by Arenz Designworks.
 * User: Brian
 * Date: 8/27/13
 * Time: 2:12 AM
 * To change this template use File | Settings | File Templates.
 */
?>
<div class="row">
        <div class="shadow-wrapper large-8 large-centered columns">
            <nav id="app-top-nav" class="  ">
                <ul>
                    <li class="add-list-item "><img src="img/plus-button-3.png" class='add-list-item-button'><img src="img/plus-button-4.png" class='cancel-list-item-button' style='display:none;'></li>
                    <li class="list-dropdown">
                        <select class="list-dropdown" name="lists">
                            <?php echo get_lists($db, $_SESSION['user']['username']); ?>
                            <option value='new-list'>Add New List</option>
                        </select>
                    <!--<li><a href="" class="completion-coefficient"><i class="icon-leaf"></i></a></li>-->
                    <li class="show-for-small itty-branding">TimedTask</li>
                    <li class="user-menu">
                        <i class="icon-cog"></i>
                        <div class="logged-in-user"><?php echo htmlentities($_SESSION['user']['username'], ENT_QUOTES, 'UTF-8'); ?></div>
<ul class="user-menu-dropdown">
    <!--<li class="bg-set"><a href="" class="bg-setting"><i class="icon-leaf"></i></a><a href="" class="bg-setting"><i class="icon-asterisk"></i></a><a href="" class="bg-setting"><i class="icon-circle-blank"></i></a></li>-->
    <li><a href="edit_account">Account&amp;Password</a></li>
    <li><a href="">TimedTask Pro</a></li>
    <li><a href="logout">Sign Out</a></li>
</ul>
</li>
</ul>
</nav>
<div class="large-12 large-centered columns list-container">
    <ul id='new-list-item'>
        <li class="add-list-item-box large-12 large-centered columns">
            <div class="row">
                <div class="large-9 small-9 large-centered columns">
                    <form id="add-list-item" class="add-list-item-form">
                        <textarea id="new-list-item-content" placeholder="I need to..." name="content" maxlength="188"></textarea>
                    </form>
                </div>
            </div>
        </li>
    </ul>
    <ul id='edit-list-item'>
        <li class="edit-list-item-box large-12 large-centered columns">
            <div class="row">
                <div class="large-9 small-9 large-centered columns">
                    <form id="edit-list-item" class="edit-list-item-form">
                        <textarea id="edit-list-item-content" placeholder="I need to..." name="content" maxlength="188"></textarea>
                    </form>
                </div>
            </div>
        </li>
    </ul>
    <ul id='add-new-list'>
        <li class="add-new-list-box large-12 large-centered columns">
            <div class="row">
                <div class="large-9 small-9 large-centered columns">
                    <form id="new-list-form" class="add-new-list-form">
                        <textarea id="new-list-title" placeholder="Enter a name for your new to-do list" name="title" maxlength="188" onfocus="this.value = this.value;"></textarea>
                    </form>
                </div>
            </div>
        </li>
    </ul>

    <div id="in-focus-container"><ul id="in-focus"><?php echo get_todos($db, $_SESSION['user']['username'], false, 1, false); ?></ul></div>

    <div id="to-do-container"><?php echo list_init($db, $_SESSION['user']['username']); ?></div>

    <div id="archive-container" style="display:none;"><ul id="archive"><?php echo get_archive($db, $_SESSION['user']['username'], false); ?></ul><div class='archive-page-navigation'></div></div>

    <div id="trash-container" style="display:none;"><ul id="trash"><?php echo get_trash($db, $_SESSION['user']['username'], false); ?></ul><div class='trash-page-navigation'></div></div>

</div>
<nav id="app-nav-bottom" class="large-12 large-centered columns" >
    <ul class="row">
        <li id="to-do-list-tab" class="active-tab large-4 small-4 columns text-center">To Do</li>
        <li id="archive-tab" class="large-4 small-4 columns text-center">Archive</li>
        <li id="trash-tab" class="large-4 small-4 columns text-center">Trash</li>
    </ul>
</nav>
</div>
</div>