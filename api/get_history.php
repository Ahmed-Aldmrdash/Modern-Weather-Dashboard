<?php
/*
 * =========================================================
 * API Endpoint: Fetch Recent Search History
 * Project: Modern Weather Dashboard (SUT)
 * Author: Ahmed Aldmrdash (Team Leader)
 * 
 * Description: I created this endpoint to retrieve the latest 
 * searched cities from the database so we can dynamically 
 * update the sidebar without reloading the page.
 * =========================================================
 */

// Including the database connection I configured in db.php
include 'db.php';

// Fetching the last 10 searches. I used 'ORDER BY id DESC' here 
// to implement the "Latest on Top" logic for the UI.
// Note for Shimaa: Please ensure the 'id' column remains AUTO_INCREMENT!
$result = $conn->query("SELECT city_name FROM search_history ORDER BY id DESC LIMIT 10");

// Initializing an empty array to hold the data before converting it to JSON
$cities = array();

// Looping through the database result and pushing each city into our array
while ($row = $result->fetch_assoc()) {
    $cities[] = $row;
}

// Setting the response header to JSON. 
// I added this so Omar's fetch() function in app.js can parse it automatically.
header('Content-Type: application/json');

// Outputting the final data as a JSON string to be consumed by the frontend
echo json_encode($cities);
?>