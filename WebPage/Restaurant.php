<?php
  session_start();
  // Jeżeli użytkownik nie jest zalogowany to przenieś go do strony logowania
  if (!isset($_SESSION['loggedin'])) {
    header('Location: index.html');
    exit;
  }
  $conn = new mysqli("localhost", "root", "", "restaurantrate"); 
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <title>Document</title>
    <link rel="stylesheet" href="/projekt/CSS/Style.css">
</head>
<body>
   <!--dodanie powrotu do strony głównej-->
<nav class="navbar navbar-default">
        <div class="container-fluid">
          <div class="navbar-header">
            <a class="navbar-brand" href="Home.php">Dom</a>
          </div>
        </div>
      </nav>
<?php 
  $Restaurant_id = $_GET['id'];
  $sql = "SELECT  RestaurantName, Regon, TypeR, DateR, PosteCode, City, Street, StreetNumber, FlatNumber  FROM restaurant WHERE ID_Restaurant =  $Restaurant_id";
  $result = $conn->query($sql);
  if ($result->num_rows > 0) 
    { 
    // Pobierz pierwszy wiersz wyników
     $row = $result->fetch_assoc();
     $RestaurantName = $row["RestaurantName"];
     $Regon = $row["Regon"];
     $TypeR = $row["TypeR"];
     $DateR = $row["DateR"];
     $PosteCode = $row["PosteCode"];
     $City = $row["City"];
     $Street = $row["Street"];
     $StreetNumber = $row["StreetNumber"];
     $FlatNumber = $row["FlatNumber"];
    }
    //Tworzenie widoku restauracji
  echo "<div class='row'>
         <div class='col-75'>
          <div class='container'>
            <h1>$RestaurantName</h1><br>
            <div class='row'>
             <div class='col-50'>
              <h3>Dane</h3>
              <p>Regon: $Regon</p>
              <p>Typ restauracji: $TypeR</p>
              <p>Data założenia: $DateR</p>
             </div>
            <div class='col-50'>
              <h3>Adres</h3>
              <p>Kod pocztowy: $PosteCode</p>
              <p>Miasto: $City</p>
              <p>Ulica: $Street</p>
              <p>Numer ulicy: $StreetNumber</p>
              <p>Numer lokalu: $FlatNumber</p>
            </div>
          </div>   
         </div>
        </div>"
            
      ?>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js" integrity="sha384-7+zCNj/IqJ95wo16oMtfsKbZ9ccEh31eOz1HGyDuCQ6wgnyJNSYdrPa03rtR1zdB" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous"></script>
</body>
 <!--Formularz i Kod odpowiedzalny za widok systemu oceny restauracji-->
    <form action="RatingSql.php" method="post">  
        <div class="card">
            <h1>Oceń Restauracje:</h1>
            <br>
            <div>
                <span onclick="StarId(1)" class="star">★</span>
                <span onclick="StarId(2)" class="star">★</span>
                <span onclick="StarId(3)" class="star">★</span>
                <span onclick="StarId(4)" class="star">★</span>
                <span onclick="StarId(5)" class="star">★</span> 
            </div>
            <h3 id="output">Ocena: 0/5</h3>
        </div>
        <input type="hidden" name="Restaurant_id" value="<?php echo $Restaurant_id; ?>">
        <input type="hidden" id="stars" name="stars" value="0">
        <label for="Comment">Dodaj komentarz</label>
        <input type="text"placeholder="Komentarz..." id="Comment" name="Comment">
        <button class="btn" type="submit">Prześlij</button>
     </form>

      <?php 
        $sql = "SELECT r.Comment as Comment, r.creationDate as creationDate, r.Rating as Rating, u.UserName as UserName, u.UserlastName as UserlastName 
                FROM rating r
                JOIN user u ON r.ID_User = u.ID_User
                WHERE ID_Restaurant =  $Restaurant_id";
        $result = $conn->query($sql);

        //Sekcja komentarzy pobrana z bazy danych
        if ($result->num_rows > 0) {
            echo "<table id='List' class='table table-striped'>";
            echo "<tr>
                    <th>Użytkownik</th>
                    <th>Komentarz</th>
                    <th>Ocena</th>
                    <th>Data dodania</th>
                  </tr>";
            while($row = $result->fetch_assoc()) {
                echo "<tr><td>".$row["UserName"]." ".$row["UserlastName"]."</td><td style ='max-width: 300px;'>".$row["Comment"]."</td><td>".$row["Rating"]."/5</td><td>".$row["creationDate"]."</td></tr>";
            }
            echo "</table>";
          }
      ?>

<script>
let stars = document.getElementsByClassName("star");
let output = document.getElementById("output");
 
// Funkcaj to dodawania gwiazdek
function StarId(n) {
    remove();
    for (let i = 0; i < n; i++) {
        if (n == 1) cls = "one";
        else if (n == 2) cls = "two";
        else if (n == 3) cls = "three";
        else if (n == 4) cls = "four";
        else if (n == 5) cls = "five";
        stars[i].className = "star " + cls;
    }
    output.innerText = "Ocena: " + n + "/5";
    document.getElementById('stars').value = n;
   }

// Usuwanie załadowanego stylu
function remove() {
    let i = 0;
    while (i < 5) {
        stars[i].className = "star";
        i++;
    }
}
</script>    
</body>
</html>