-- 2. DB Name: weather_app
-- 1. Create the database
CREATE DATABASE IF NOT EXISTS weather_app;
USE weather_app;

-- 2. Create the search history table
CREATE TABLE IF NOT EXISTS search_history (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(255) NOT NULL,
    search_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;