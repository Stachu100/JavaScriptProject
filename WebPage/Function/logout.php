<?php
session_start();
session_destroy();
// Przenie� do strony logowania
header('Location: index.html');
?>