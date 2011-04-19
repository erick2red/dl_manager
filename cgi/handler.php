<?php
/*
	url status:
		done
		undone
		error
	url size:
		in MB
	url handlers
		wget
		youtube-dl
*/
function get_remote_size(){
$ch = curl_init();
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt ($ch, CURLOPT_URL, 'http://techreport.com/podcast/trpodcast_ep085.m4a');
curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, 20);
curl_setopt ($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);

// Only calling the head
curl_setopt($ch, CURLOPT_HEADER, true); // header will be at output
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'HEAD'); // HTTP request is 'HEAD'

$content = curl_exec ($ch);
curl_close ($ch);

print_r($content);	
}

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

	function fetch_urls($params) {
		$results = $this->database->query('SELECT * FROM urls WHERE user_id=' . $params['user_id']);
		$rvalues = array();
		while ($row = $results->fetchArray()) {
			$rvalues[] = array('url_id' => $row['url_id'], 'url' => $row['url'], 'url' => $row['url'], 'status' => $row['status'], 'address' => $row['address'], 'size' => $row['size']);
		}
		return $rvalues;
	}
	function new_url($params) {
		$file = substr($params['url'], strrpos($params['url'], '/') + 1);
		$sql = 'INSERT INTO urls VALUES(NULL, ' . $params['user_id'] . ', "undone", "' . $params['url'] . '", "' . $file . '", 0)';
		if($this->database->query($sql)) {
			return true;
		}
		return false;
	}

	function remove_url($params) {
		$sql = 'DELETE FROM urls WHERE url_id=' . $params['url_id'];
		if($this->database->query($sql)) {
			return true;
		}
		return false;
	}

/*	
	function set_done($params) {
		$sql = 'UPDATE todos SET done=1 WHERE todo="' . $params['todo'] . '" and id_project=' . $params['id_project'];
		if($this->database->query($sql)) {
			return true;
		}
		return false;
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