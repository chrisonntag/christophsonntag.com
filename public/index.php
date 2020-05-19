<?php

require_once __DIR__ . '/../vendor/autoload.php';
require __DIR__. '/../controller/MailController.php';
require __DIR__. '/../controller/PocketController.php';
require_once __DIR__. '/../config.php';

use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

$app = new Slim\App;
define("BLOG_DIR", __DIR__ . '/../blog/');

$app->add(function (Request $request, Response $response, callable $next) {
    $uri = $request->getUri();
    $path = $uri->getPath();
    if ($path != '/' && substr($path, -1) == '/') {
        // recursively remove slashes when its more than 1 slash
        while(substr($path, -1) == '/') {
            $path = substr($path, 0, -1);
        }

        // permanently redirect paths with a trailing slash
        // to their non-trailing counterpart
        $uri = $uri->withPath($path);
        
        if($request->getMethod() == 'GET') {
            return $response->withRedirect((string)$uri, 301);
        }
        else {
            return $next($request->withUri($uri), $response);
        }
    }

    return $next($request, $response);
});


$container = $app->getContainer();
$container['view'] = function ($container) {
    $templates = __DIR__ . '/../templates/';
    $cache = __DIR__ . '/../tmp/views/';

    $view = new Slim\Views\Twig($templates, compact('cache'));

    $router = $container->get('router');
    $uri = \Slim\Http\Uri::createFromEnvironment(new \Slim\Http\Environment($_SERVER));
    $view->addExtension(new \Slim\Views\TwigExtension($router, $uri));

    $filter = new Twig_SimpleFilter('base_url', function ($string) {
        return preg_replace('/https?:\/\/|(\/.*){1}/', '', $string);
    });
    $view->getEnvironment()->addFilter($filter);

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

$app->get('/links', function ($request, $response) {
    $pocket = new PocketController(POCKET_AKEY);
    $links = $pocket->retrieveStarred(30);
    //print_r($links, false);
    return $this->view->render($response, 'links.twig', ['links' => $links]);
})->setName('links');

function extract_article($path) {
    $handle = fopen($path, 'r');
    $content = stream_get_contents($handle);
    // split the content to get metadata
    $content = explode("\n\n", $content);
    $rawMeta = array_shift($content);
    // metadata is json encoded. so decode it.
    $meta = json_decode($rawMeta,true);
    $meta['date'] = strtotime($meta['date']);
    $content = implode("\n\n", $content);

    $Parsedown = new Parsedown();
    $content = $Parsedown->text($content);

    return array(
        'meta' => $meta ,
        'content' => $content
    );
}

$app->get('/blog', function ($request, $response) {
    $path = BLOG_DIR;
    $dir = new DirectoryIterator($path);
    $articles = array();
    foreach($dir as $file){
        if($file->isFile()){
            $handle = $path . '/' . $file->getFilename();
            $article = extract_article($handle);

            // Cut content after 120 characters (full-word).
            if (preg_match('/^.{1,500}\b/s', $article['content'], $match))
            {
                $article['content'] = $match[0] . '...';
            }
            $articles[$file->getFilename()] = $article;
        }
    }
    // Sort according to given date in descending order.
    usort($articles, function ($item1, $item2) {
        return $item2['meta']['date'] <=> $item1['meta']['date'];
    });

    return $this->view->render($response, 'blog.twig', array('articles' => $articles));
})->setName('blog');

$app->get('/blog/{slug}', function ($request, $response, $args) {
    $path = BLOG_DIR;
    //open text file and read it
    $handle = $path . '/' . $args['slug'] . '.md';
    $article = extract_article($handle);

    return $this->view->render($response, 'article.twig', $article);
})->setName('article');

$app->run();
