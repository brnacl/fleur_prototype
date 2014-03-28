<?php
/**
 * Created by Arenz Designworks.
 * User: Brian
 * Date: 7/26/13
 * Time: 2:33 PM
 * To change this template use File | Settings | File Templates.
 */

require_once ('paths.config.php');
require(TR_PATH."includes/db_connect.php");

unset($_SESSION['user']);

header("Location: login.php");

die("Redirecting to: login.php");