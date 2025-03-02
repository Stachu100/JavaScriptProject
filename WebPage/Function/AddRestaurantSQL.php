<?php
session_start();
// Je¿eli u¿ytkownik nie jest zalogowany to przenieœ go do strony logowania
if (!isset($_SESSION['loggedin'])) {
  header('Location: index.html');
  exit;
}
if ($_SERVER["REQUEST_METHOD"] == "POST") {
      $conn = new mysqli("localhost", "root", "", "restaurantrate");


      $RestaurantName = htmlspecialchars($_POST['RestaurantName']);
      $Regon = htmlspecialchars($_POST['Regon']);
      $TypeR = htmlspecialchars($_POST['TypeR']);
      $DateR = htmlspecialchars($_POST['DateR']);
      $PosteCode = htmlspecialchars($_POST['PosteCode']);
      $City = htmlspecialchars($_POST['City']);
      $Street = htmlspecialchars($_POST['Street']);
      $StreetNumber = htmlspecialchars($_POST['StreetNumber']);
      $FlatNumber = htmlspecialchars($_POST['FlatNumber']);
  
      $sql = "INSERT INTO restaurant (RestaurantName, Regon, TypeR, DateR, PosteCode, City, Street, StreetNumber, FlatNumber)
            VALUES ('$RestaurantName', '$Regon', '$TypeR', '$DateR', '$PosteCode', '$City', '$Street', '$StreetNumber', '$FlatNumber')";

      // Wykonanie zapytania
      if ($conn->query($sql) === TRUE) {
        header('Location: RestuarnatList.php');
      } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
      }
      $conn->close();
    
}
?>
