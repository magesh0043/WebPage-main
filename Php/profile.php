<?php
include 'mongodb.php';
require '../vendor/autoload.php';

$token = $_GET['token'];

$redis = new Predis\Client([
    'scheme' => 'tcp',
    'host' => '127.0.0.7',
    'port' => 6379,
]);

$email = $redis->get("session:$token");

// Assuming you have established the MongoDB client and selected the database in mongodb.php
// For example:
// $client = new MongoDB\Client("mongodb://localhost:27017");
// $db = $client->mydatabase;

if ($email) {
    $collection = $db->userdata; // Replace 'mycollection' with your actual collection name
} else {
    echo json_encode(['error' => 'Session expired']);
    exit;
}

// Fetch the user document by id
$user = $collection->findOne(['_id' => $email], [
    'projection' => [
        'age' => 1,
        'gender' => 1,
        'mobile' => 1,
        '_id'=> 1,
        'fname' => 1,
        'lname' => 1,
        'dob'=>1
    ]
]);



if ($user) {
    echo json_encode($user);
} else {
    echo json_encode(['error' => 'User not found']);
}