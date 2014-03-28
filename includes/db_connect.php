<?php
/**
 * Created by Arenz Designworks.
 * User: Brian
 * Date: 7/26/13
 * Time: 2:22 PM
 * To change this template use File | Settings | File Templates.
 */

$username = "fleur_admin";
$password = "0ct0pu51nk";
$host = "localhost";
$dbname = "fleur";

$options = array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8');

try {
    $db = new PDO("mysql:host={$host};dbname={$dbname};charset=utf8", $username, $password, $options);
    
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    if(function_exists('get_magic_quotes_gpc') && get_magic_quotes_gpc()) {
        function undo_magic_quotes_gpc(&$array) {
            foreach($array as &$value) {
                if(is_array($value)) {
                    undo_magic_quotes_gpc($value);
                } else {
                    $value = stripslashes($value);
                }
            }
        }
        undo_magic_quotes_gpc($_POST);
        undo_magic_quotes_gpc($_GET);
        undo_magic_quotes_gpc($_COOKIE);
    }
} catch(PDOException $ex) {
    die("Failed to connect to the database: " . $ex->getMessage());
}

if (!isset($_SESSION)) {
    session_start();
    $_SESSION['ip_address'] = $_SERVER['REMOTE_ADDR'];
} else {
    // if the ip address of a session changes, it could be someone trying to hijack another user's session - destroy it and make them start over.
    if ($_SESSION['ip_address'] != $_SERVER['REMOTE_ADDR']) {
        session_destroy();

        session_start();
        $_SESSION['ip_address'] = $_SERVER['REMOTE_ADDR'];
    }
}