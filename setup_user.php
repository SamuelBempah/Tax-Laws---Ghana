<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config/db_config.php';

// First, disable foreign key checks
$conn->query("SET FOREIGN_KEY_CHECKS = 0");

// Clear existing users
$conn->query("TRUNCATE TABLE admin_users");

// Re-enable foreign key checks
$conn->query("SET FOREIGN_KEY_CHECKS = 1");

// User credentials
$email = 'ixy.chase@gmail.com';
$password = 'Yunikbl4z3';

// Hash the password properly
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert the user
$stmt = $conn->prepare("INSERT INTO admin_users (email, password) VALUES (?, ?)");
$stmt->bind_param("ss", $email, $hashed_password);

if ($stmt->execute()) {
    echo "User created successfully with email: $email<br>";
    echo "You can now log in with these credentials.<br>";
    echo "User ID: " . $conn->insert_id;
} else {
    echo "Error creating user: " . $conn->error;
}

$stmt->close();
$conn->close();
?>
