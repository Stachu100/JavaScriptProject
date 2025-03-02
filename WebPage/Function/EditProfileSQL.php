<?php
session_start();
// Je¿eli u¿ytkownik nie jest zalogowany to przenieœ go do strony logowania
if (!isset($_SESSION['loggedin'])) {
  header('Location: index.html');
  exit;
}

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $conn = new mysqli("localhost", "root", "", "restaurantrate");
        
        $LastName = htmlspecialchars($_POST['LastName']);
        $Name = htmlspecialchars($_POST['Name']);
        $User_id = htmlspecialchars($_SESSION['id']);

        $sql = "Update user Set UserName = '$Name', UserLastName = '$LastName' where ID_User = $User_id";

     if ($conn->query($sql) === TRUE) {
            header('Location: Profil.php');
          } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
          }

    $conn->close();
    }
?>