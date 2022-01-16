<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';
require_once  __DIR__. '/../config.php';

class MailController {
    private $host = MAIL_HOST;
    private $username = MAIL_USER;
    private $pass = MAIL_PASS;
    private $port = MAIL_PORT;
    private $mailer;

    private $from = MAIL_FROM;
    private $to = MAIL_TO;

    public function __construct() {
        $this->mailer = new PHPMailer;
        $this->mailer->addAddress($this->to);
    }

    public function sendContactMail($first_name, $last_name, $email, $subject, $message) {
        $this->mailer->addReplyTo($email, 'Reply');
        $this->mailer->From = $this->from;
        $this->mailer->FromName = $first_name . ' ' . $last_name;
        $this->mailer->Subject = $subject;
        $this->mailer->Body = $message;

        return $this->mailer->send();
    }


}
