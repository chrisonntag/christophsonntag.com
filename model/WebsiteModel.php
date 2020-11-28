<?php

final class WebsiteModel
{
    static $linkTreeList = [
        ["name" => "Telegram Channel", "url" => "https://t.me/joinchat/AAAAAFg5EuyfyKbkIANSWg"],
        ["name" => "Spotify Inbox Playlist", "url" => "https://open.spotify.com/playlist/4PbqKGbteDh1Mnr0xtuZoV?si=uDYSZRU8TGqzmym9z7icMQ"],
        ["name" => "Donate to Black Equality Fund", "url" => "https://donorbox.org/black-equity-fund"],
    ];

    static function getLinkTreeList() {
        return self::$linkTreeList;
    }
}