<?php
/*
 * =========================================================
 * Database Connection Configuration
 * Project: Modern Weather Dashboard (SUT)
 * Author: Ahmed Aldmrdash (Team Leader)
 * 
 * Note to the team (Shimaa & Omar): 
 * I've set these credentials for our local XAMPP environment.
 * Make sure we update these values when deploying to InfinityFree.
 * =========================================================
 */

// Defining the database credentials for local testing
$host = "localhost";
$user = "root";
$pass = ""; // Kept empty as per standard XAMPP configuration
$dbname = "weather_app"; // The database we use to store search history

// Establishing the connection using the MySQLi object-oriented approach
$conn = new mysqli($host, $user, $pass, $dbname, 3307);

// Checking for connection errors to help us debug quickly if the server is down
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// If we reach here, the connection is successful!
?>