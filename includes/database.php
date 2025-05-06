<?php

$db = mysqli_connect('localhost', 'isma', 'Ismael', 'appsalon');

if(!$db){
    echo "Error";
    exit;
}