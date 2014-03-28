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
                <li class="add-list-item ">
                    <img src="img/plus-button-3.png" class='add-list-item-button'>
                    <img src="img/plus-button-4.png" class='cancel-list-item-button' style='display:none;'>
                </li>
                <li class="user-menu">
                    <div class="logged-in-user">
                        <?php echo htmlentities($_SESSION['user']['username'], ENT_QUOTES, 'UTF-8'); ?>
                    </div>
                    <ul class="user-menu-dropdown">
                        <li><a href="list#to-do">To-do List</a></li>
                        <li><a href="">TimedTask Pro</a></li>
                        <li><a href="logout">Sign Out</a></li>
                    </ul>
                </li>
            </ul>
        </nav>

        <div class="large-12 large-centered columns">
            <h3>Account</h3>
            <p>Average Completion Time:<br /> <?php echo displayTime(getAverage($db,'lifetime')); ?></p>
            <p>Average In-Focus Time:<br /> <?php echo displayTime(getAverage($db,'in_focus')); ?></p>
            <form action="edit_account.php" method="post">
                <p>
                    Username:<br />
                    <?php echo htmlentities($_SESSION['user']['username'], ENT_QUOTES, 'UTF-8'); ?>
                </p>
                <p>
                    Password:<br />
                    <input style="width: auto;" type="password" name="password" value="" />
                    <input type="submit" value="Update Account" />
                </p>
            </form>
            <form id="delete-list" class="delete-list">
                <select class="delete-list-dropdown" name="list">
                            <?php echo get_lists($db, $_SESSION['user']['username']); ?>
                </select>
                <input type="submit" value="Delete List" />
            </form>
        </div>
    </div>
</div>