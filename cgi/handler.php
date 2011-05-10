<?php
/**
 *	@author Erick Pérez Castellanos <erick.red@gmail.com>
 *
 *	Dependencies:
 *		json php extension
 *		curl php extension
 *		sqlite3 php extension
 *
 *	Notes
 *	url status:
 *		done
 *		undone
 *		error
 *	url size:
 *		in MB
 *	url handlers:
 *		wget
 *		youtube-dl
 *	url user pass:
 *		md5 hash
*/

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
		
		$this->logger = fopen('/tmp/logs.txt', 'a+');
	}
	
	function authenticate_user($params) {
        $password = md5($params['pass']);
        return $this->database->querySingle('SELECT user_id FROM users WHERE username="' . $params['user'] . '" and password="' . $password . '"');
	}

	function fetch_urls($params) {
		$results = $this->database->query('SELECT * FROM urls WHERE user_id=' . $params['user_id']);
		$rvalues = array();
		while ($row = $results->fetchArray()) {
			$local_address = str_replace(dirname(getcwd()) . '/', '', $row['address']);
			$rvalues[] = array('url_id' => $row['url_id'], 'url' => $row['url'], 'url' => $row['url'], 'status' => $row['status'], 'address' => $local_address, 'size' => $row['size']);
		}
		return $rvalues;
	}
	function new_url($params) {
		$file = substr($params['url'], strrpos($params['url'], '/') + 1);
		$sql = 'INSERT INTO urls VALUES(NULL, ' . $params['user_id'] . ', 0, "' . $params['url'] . '", "' . $file . '", 0, ' . $params['bw_limit'] . ')';
		if($this->logger != FALSE) {
			fwrite($this->logger, $sql);
		}
		if($this->database->query($sql)) {
			return true;
		}
		return false;
	}

	function remove_url($params) {
		$filename = $this->database->querySingle('SELECT address FROM urls WHERE url_id=' . $params['url_id']);
		$sql = 'DELETE FROM urls WHERE url_id=' . $params['url_id'];
		if($this->database->query($sql)) {
			//removing file
			unlink($filename);
			return true;
		}
		return false;
	}
}

$obj = new Receiver();
echo json_encode($obj->$_POST['method']($_POST['params']));

?>
