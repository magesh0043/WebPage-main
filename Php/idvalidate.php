<?php
include 'mongodb.php';
include 'db.php';

class UserManager {
    private $mongoCollection;
    private $mysqlConnection;

    public function __construct($mongoCollection, $mysqlConnection) {
        $this->mongoCollection = $mongoCollection;
        $this->mysqlConnection = $mysqlConnection;
    }

    public function userExistsInMySQL($id) {
        $stmt = $this->mysqlConnection->prepare("SELECT id FROM userdetails WHERE id = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $stmt->store_result();
        $exists = $stmt->num_rows > 0;
        $stmt->close();
        return $exists;
    }

    public function userExistsInMongoDB($id) {
        $existingDocument = $this->mongoCollection->findOne(['_id' => $id]);
        return $existingDocument !== null;
    }

    public function userExists($id) {
        if ($this->userExistsInMySQL($id) || $this->userExistsInMongoDB($id)) {
            return true;
        }
        return false;
    }
}

$userManager = new UserManager($db->userdata, $con);

$id = $_POST['mail'];
if ($userManager->userExists($id)) {
    echo "true";
} else {
    echo "false";
}

$con->close();
