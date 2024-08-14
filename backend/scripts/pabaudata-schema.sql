CREATE DATABASE pabaudata;

USE pabaudata;

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service VARCHAR(255),
  doctor_name VARCHAR(255),
  start_time TIME,
  end_time TIME,
  date DATE
);


