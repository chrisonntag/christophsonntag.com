<?php

require __DIR__ . '/../vendor/autoload.php';

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

$app->run();
