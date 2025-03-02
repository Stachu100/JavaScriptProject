<?php
session_start();
// Je¿eli u¿ytkownik nie jest zalogowany to przenieœ go do strony logowania
if (!isset($_SESSION['loggedin'])) {
  header('Location: index.html');
  exit;
}

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $conn = new mysqli("localhost", "root", "", "restaurantrate");
        
        $stars = htmlspecialchars($_POST['stars']);
        $comment = htmlspecialchars($_POST['Comment']);
        $User_id = htmlspecialchars($_SESSION['id']); 
        $Restaurant_id = htmlspecialchars($_POST['Restaurant_id']);

        $sql = "INSERT INTO rating (ID_User, ID_Restaurant, Rating, comment, creationDate) VALUES ('$User_id', '$Restaurant_id', '$stars', '$comment', CURRENT_TIMESTAMP)";

     if ($conn->query($sql) === TRUE) {
            header('Location: restaurant.php?id=' . $Restaurant_id);
          } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
          }

    $conn->close();
    }
?>