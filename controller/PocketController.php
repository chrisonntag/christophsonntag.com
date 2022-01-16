<?php

require_once __DIR__ . '/../vendor/autoload.php';
require_once  __DIR__. '/../config.php';

class PocketController {
    private $consumer_key = POCKET_CKEY;
    private $application_key;
    private static $BASE_URL = 'https://getpocket.com/v3/get';
    private $api_url;
    private static $STARRED = '&state=all&favorite=1';
    private static $SORT = '&sort=newest';

    public function __construct($application_key) {
        $this->application_key = $application_key;
        $this->api_url = PocketController::$BASE_URL."?consumer_key=$this->consumer_key&access_token=$this->application_key";
    }

    public function retrieveStarred($count=10) {
        $url = $this->api_url.PocketController::$STARRED.PocketController::$SORT."&count=$count";
        try {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_TCP_KEEPALIVE, 1);
            curl_setopt($ch, CURLOPT_TCP_KEEPIDLE, 2);
            $data = curl_exec($ch);
            if(curl_errno($ch)){
                throw new Exception(curl_error($ch));
            }
            curl_close($ch);
            $data = json_decode($data, true);
            return $data['list'];
        } catch(Exception $e) {
            // do something on exception
        }
    }
}
