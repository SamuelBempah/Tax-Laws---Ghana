<?php
require_once 'config/db_config.php';

// User credentials
$email = 'ixy.chase@gmail.com';
$password = 'Yunikbl4z3';

// Hash the password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Prepare and execute the query
$stmt = $conn->prepare("INSERT INTO admin_users (email, password) VALUES (?, ?)");
$stmt->bind_param("ss", $email, $hashed_password);

if ($stmt->execute()) {
    echo "User added successfully!";
} else {
    echo "Error adding user: " . $conn->error;
}

$stmt->close();
$conn->close();
?>
