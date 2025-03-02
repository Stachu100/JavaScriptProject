<?php
    session_start();
    $conn = new mysqli("localhost", "root", "", "restaurantrate");
    if ( !isset($_POST['username'], $_POST['password']) ) {
        exit('Wype�nij oba pola!');
    }
    // Przygotowanie SQL
    if ($stmt = $conn->prepare('SELECT ID_User, UserPassword FROM user WHERE UserName = ?')) {
        // Przypsisywanie parametr�w (s-string)
        $stmt->bind_param('s', $_POST['username']);
        $stmt->execute();
        // Zapis wyniku aby potem sprawdzi�  czy konto istnieje w bazie danych
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($id, $password);
            $stmt->fetch();
            // Konot istnieje, sprawdzanie has�a
            if (password_verify($_POST['password'], $password)) {
                //Sukces, konot zalogowane
                //Tworzenie sesji u�ytkownika
                session_regenerate_id();
                $_SESSION['loggedin'] = TRUE;
                $_SESSION['name'] = $_POST['username'];
                $_SESSION['id'] = $id;
                header('Location: home.php');
            } else {
                // has�o nie poprawne 
                echo 'Login lub has�o niepoprawn!';
            }
        } else {
            // login nie poprawny
            echo 'Login lub has�o niepoprawn!';
        }

        $stmt->close();
    }
?>

