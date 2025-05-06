<?php

require "includes/funcion.php";

$servicios = obtenerServicios();


echo json_encode($servicios);