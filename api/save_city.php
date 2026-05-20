<?php
/*
 * =========================================================
 * API Endpoint: Save Searched City to History
 * Project: Modern Weather Dashboard (SUT)
 * Author: Ahmed Aldmrdash (Team Leader)
 * 
 * Description: I wrote this logic to handle storing new city
 * searches into our database. It also handles the "Latest on Top" 
 * sorting behavior by removing older duplicates.
 * =========================================================
 */

// Including the DB connection I set up in db.php
include 'db.php';

// Checking if Omar's frontend fetch() call successfully sent the POST data
if (isset($_POST['city'])) {
    
    // I added real_escape_string and trim here to secure the input 
    // against SQL injection and remove any accidental whitespaces. 
    // Note to team (Shimaa & Omar): We must always sanitize user inputs!
    $city = $conn->real_escape_string(trim($_POST['city']));
    
    // Making sure we don't accidentally save empty strings to the DB
    if (!empty($city)) {
        
        // Here is the trick I implemented for the "Latest on Top" logic:
        // Instead of doing complex UPDATEs, if the city was searched before, 
        // I simply delete the old record first...
        $conn->query("DELETE FROM search_history WHERE city_name = '$city'");
        
        // ...then I insert it again as a fresh entry. 
        // This guarantees it gets the highest 'id' and the newest timestamp,
        // so it will always appear at the top of our sidebar!
        $conn->query("INSERT INTO search_history (city_name) VALUES ('$city')");
    }
}
?>