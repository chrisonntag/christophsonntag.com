<?php

final class WebsiteModel
{
    static $linkTreeList = [
        ["name" => "Spotify Inbox Playlist", "url" => "https://open.spotify.com/playlist/4PbqKGbteDh1Mnr0xtuZoV?si=uDYSZRU8TGqzmym9z7icMQ"],
        ["name" => "GitHub", "url" => "https://github.com/chrisonntag"],
        ["name" => "LinkedIn", "url" => "https://linkedin.com/in/christophsonntag"],
        ["name" => "Mastodon", "url" => "https://det.social/@christophsonntag"],
    ];

    static function getLinkTreeList() {
        return self::$linkTreeList;
    }
}