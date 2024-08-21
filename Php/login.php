<?php

require '../vendor/autoload.php';
include 'db.php';

class User {
    private $con;
    private $redis;
    
    public function __construct($dbConnection, $redisConnection) {
        $this->con = $dbConnection;
        $this->redis = $redisConnection;
    }

    public function authenticate($email, $password) {
        $query = "SELECT ppassword FROM userdetails WHERE id = ?";
        if ($stmt = $this->con->prepare($query)) {
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $stmt->store_result();
            $stored_password='';
            if ($stmt->num_rows > 0) {
                $stmt->bind_result($stored_password);
                $stmt->fetch();
                if ($password === $stored_password) {
                    $stmt->close();
                    return $this->generateSessionToken($email);
                }
            }
            $stmt->close();
        }
        return false;
    }

    private function generateSessionToken($userid){
        $sessionToken = bin2hex(random_bytes(32));
        $this->redis->set("session:$sessionToken", $userid);
        $this->redis->expire("session:$sessionToken", 5);
        return [
            'status' => 'success',
            'token' => $sessionToken
        ];
    }
}

$redis = new Predis\Client([
    'scheme' => 'tcp',
    'host' => '127.0.0.1',
    'port' => 6379,
]);

// Get the email and password from POST request
$email = $_POST['mail'];
$password = $_POST['password'];

// Instantiate the User class and call the authenticate method
$user = new User($con, $redis);
$response = $user->authenticate($email, $password);

if ($response) {
    echo json_encode($response);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid']);
}
