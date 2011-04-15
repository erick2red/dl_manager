<?php

class Receiver {
	function __construct() {
		chdir('../data/');
		try {
			$r = $this->database = new SQLite3('../data/db.sqlite', SQLITE3_OPEN_READWRITE);
			if(! $r) {
				echo 'Don\'t opened the database' . "\n";
			}
		} catch (Exception $e) {
			echo 'Caught exception: ',  $e->getMessage(), "\n";
		}
	}
	
	function authenticate_user($params) {
        $password = md5($params['pass']);
        return $this->database->querySingle('SELECT user_id FROM users WHERE username="' . $params['user'] . '" and password="' . $password . '"');
	}

/*	
	function new_todo($params) {
		$sql = 'INSERT INTO todos VALUES(NULL, "' . $params['todo'] . '", ' . $params['id_project'] . ', 0)';
		if($this->database->query($sql)) {
			return true;
		}
		return false;
	}
	
	function set_done($params) {
		$sql = 'UPDATE todos SET done=1 WHERE todo="' . $params['todo'] . '" and id_project=' . $params['id_project'];
		if($this->database->query($sql)) {
			return true;
		}
		return false;
	}

	function remove($params) {
		$sql = 'DELETE FROM todos WHERE todo="' . $params['todo'] . '" and id_project=' . $params['id_project'];
		if($this->database->query($sql)) {
			return true;
		}
		return false;
	}
	
	function get_projects($params) {
		$results = $this->database->query('SELECT id_project,name FROM projects');
		$rvalues = array();
		while ($row = $results->fetchArray()) {
			$rvalues[] = array('id' => $row['id_project'], 'name' => $row['name']);
		}
		return $rvalues;
	}
	
	function new_project($params){
		$sql = 'INSERT INTO projects VALUES(NULL, "' . $params['name'] . '")';
		if($this->database->query($sql)) {
			return $this->database->querySingle('SELECT id_project FROM projects WHERE name="' . $params['name'] . '"');
		}
		return 0;
	}
*/	
}

$obj = new Receiver();
echo json_encode($obj->$_POST['method']($_POST['params']));

?>