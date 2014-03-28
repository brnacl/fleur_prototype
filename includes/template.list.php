<?php
/**
 * Created by Arenz Designworks.
 * User: Brian
 * Date: 8/27/13
 * Time: 2:12 AM
 * To change this template use File | Settings | File Templates.
 */
?>
<div class="row full-height-wrapper">
    <main class="large-8 small-16 large-centered columns">

        <nav>
            <ul>
                <a href='#to-do'><h1 class='current-list'></h1></a>
                <li>
                    <button class="list-select"></button>
                    <ul id='list-dropdown'>
                        <?php echo get_lists($db, $_SESSION['user']['username'], false); ?>
                    </ul>
                </li>
            </ul>
            <button class="dismiss-button" href=""></button>
            <button class="add-button" href=""></button>
        </nav>

        <!-- <nav>
            <ul>
                <h1>a list</h1>
                <li>
                    <button class="list-select"></button>
                    <ul>
                        <li><a href="">All To-Do's</a></li>
                        <li>
                            <button class="trash-symbol" href="" type="button"></button>
                            <a href="" class="empty-list">an empty list</a>
                        </li>
                        <li>
                            <button class="trash-symbol" href="" type="button"></button>
                            <a href="" class="empty-list">another empty list</a>
                        </li>
                        <li><a href="">To Do Today</a></li>
                        <li>
                            <a href="" class="create-new-list"><div class="create-new-list-icon"></div>Create a New List</a>
                        </li>
                    </ul>
                </li>
            </ul>
            <button class="dismiss-button" href=""></button>
        </nav> -->

        <section id="new-to-do-container">
            <ul id="new-list-item">
                <li class="add-to-do-box">
                    <form id='add-to-do' class="add-to-do-form">
                        <label>Textarea Label</label>
                        <textarea placeholder="I need to..." name="add-to-do-textarea" maxlength="188"></textarea>
                    </form>
                </li>
            </ul>
        </section>
        <section id="new-list-container">
            <ul id='add-new-list'>
                <li class="add-new-list-box">
                    <form id='add-new-list' class="add-new-list-form">
                        <label>Textarea Label</label>
                        <textarea placeholder="Enter a name for your new to-do list..." name="add-new-list-textarea" maxlength="188";></textarea>
                    </form>
                </li>
            </ul>
        </section>
        <section id="edit-to-do-container">
            <ul id='edit-to-do'>
                <li class="edit-to-do-box">
                    <form id='edit-to-do' class="edit-to-do-form">
                        <label>Textarea Label</label>
                        <textarea name="edit-to-do-textarea" maxlength="188"></textarea>
                    </form>
                </li>
            </ul>
        </section>

        <section id="in-focus-container"><ul id="in-focus"><?php echo get_todos($db, $_SESSION['user']['username'], false, 1, false); ?></ul>
        </section><!--in-focus-container-->

        <section id="to-do-container"><?php echo list_init($db, $_SESSION['user']['username']); ?></section><!--to-do-container-->

        <section id="archive-container" style="display:none;"><ul id="archive"><?php echo get_archive($db, $_SESSION['user']['username'], false); ?></ul></section>

        <section id="trash-container" style="display:none;"><ul id="trash"><?php echo get_trash($db, $_SESSION['user']['username'], false); ?></ul></section>

    </main>
</div>