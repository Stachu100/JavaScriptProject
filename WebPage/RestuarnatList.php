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
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dom</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
</head>
  <body>

    <nav class="navbar navbar-default">
        <div class="container-fluid">
          <div class="navbar-header">
            <a class="navbar-brand" href="Home.php">Dom</a>
          </div>
        </div>
      </nav>
      
      <input type="text" id="search" onkeyup="searchFunction()" placeholder="Szukaj..">
      
      <?php 
        $sql = "SELECT ID_Restaurant, RestaurantName, City, Street, StreetNumber  FROM restaurant";
        $result = $conn->query($sql);


        if ($result->num_rows > 0) {
            echo "<table id='List' class='table table-striped'>";
            echo "<tr>
                    <th>Restauracja</th>
                    <th>Miasto</th>
                    <th>Ulica</th>
                    <th>Numer budynku</th>
                    <th>Przejdź</th>
                  </tr>";
            while($row = $result->fetch_assoc()) {
                echo "<tr><td>".$row["RestaurantName"]."</td><td>".$row["City"]."</td><td>".$row["Street"]."</td><td>".$row["StreetNumber"]."</td><td><a href='Restaurant.php?id=".$row["ID_Restaurant"]."'>Restauracja</a></td></tr>";
            }
            echo "</table>";
          }
      ?>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js" integrity="sha384-7+zCNj/IqJ95wo16oMtfsKbZ9ccEh31eOz1HGyDuCQ6wgnyJNSYdrPa03rtR1zdB" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous"></script>
    <script>
      function searchFunction() {
        // Deklaracja zmiennych
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("search");
        filter = input.value.toUpperCase();
        table = document.getElementById("List");
        tr = table.getElementsByTagName("tr");

        //Pętla przez wszystkie wiersze i schowanie wszystkich które nie pasują
        for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[0];
          if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          }
        }
      }
    </script>
  </body>
</html>
