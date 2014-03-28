<?php
/**
 * Created by Arenz Designworks.
 * User: Brian
 * Date: 7/24/13
 * Time: 4:25 PM
 * To change this template use File | Settings | File Templates.
 */

define('TR_PATH', get_server_path());

function get_server_path()
{
    // this file resides in [base_path]/public_html/, which means we need to go up 2 levels to get the base path
    $path = dirname(dirname(__FILE__));
    return $path . '/';
}