<?php
session_start();
session_destroy();
// Przenieœ do strony logowania
header('Location: index.html');
?>