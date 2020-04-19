<?php

require_once __DIR__ . '/../vendor/autoload.php';
require __DIR__. '/../controller/MailController.php';
require_once __DIR__. '/../config.php';

$app = new Slim\App;

$container = $app->getContainer();
$container['view'] = function ($container) {
    $templates = __DIR__ . '/../templates/';
    $cache = __DIR__ . '/../tmp/views/';

    $view = new Slim\Views\Twig($templates, compact('cache'));

    $router = $container->get('router');
    $uri = \Slim\Http\Uri::createFromEnvironment(new \Slim\Http\Environment($_SERVER));
    $view->addExtension(new \Slim\Views\TwigExtension($router, $uri));

    return $view;
};

$app->get('/', function ($request, $response) {
    return $this->view->render($response, 'home.twig');
})->setName('home');

$app->get('/pgp', function ($request, $response) {
    return $this->view->render($response, 'pgp.twig');
})->setName('pgp');

$app->get('/newsletter', function ($request, $response) {
    return $this->view->render($response, 'newsletter.twig');
});

$app->get('/imprint', function ($request, $response) {
    return $this->view->render($response, 'imprint.twig');
})->setName('imprint');

$app->get('/contact', function ($request, $response) {
    return $this->view->render($response, 'contact.twig');
})->setName('contact');

$app->post('/contact', function ($request, $response) {
    $first_name = $request->getParam('first_name');
    $last_name = $request->getParam('last_name');
    $email = $request->getParam('email');
    $message = $request->getParam('message');
    $subject = 'Contact Inquiry';
    $gRecaptchaResponse = $request->getParam('g-recaptcha-response');

    $recaptcha = new \ReCaptcha\ReCaptcha(CAPTCHA_SECRET);
    $resp = $recaptcha->setExpectedHostname($_SERVER['SERVER_NAME'])
                      ->verify($gRecaptchaResponse, $_SERVER['REMOTE_ADDR']);

    if ($resp->isSuccess()) {
        $mailer = new MailController();
        if(!$mailer->sendContactMail($first_name, $last_name, $email, $subject, $message)) {
            return $this->view->render($response, 'contact.twig', ['error' => 'Sorry, an mailing error occured.']);
        } else {
            return $this->view->render($response, 'contact.twig', ['success' => 'Message has been sent.']);
        }
    } else {
        return $this->view->render($response, 'contact.twig', ['error' => 'Captcha failed.']);
    }


})->setName('contact-post');

$app->run();
