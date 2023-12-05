<?php

require_once __DIR__ . '/../vendor/autoload.php';
require __DIR__. '/../controller/MailController.php';
require __DIR__. '/../controller/PocketController.php';
require_once __DIR__. '/../config.php';
include __DIR__.'/../model/WebsiteModel.php';

use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Factory\AppFactory;
use Slim\Views\Twig;
use Slim\Views\TwigMiddleware;
use Middlewares\TrailingSlash;
use Slim\Routing\RouteContext;

define("BLOG_DIR", __DIR__ . '/articles/');


$app = AppFactory::create();
$twig = Twig::create('../templates', ['cache' => '../.cache']);

// Add Twig-View Middleware
$app->add(TwigMiddleware::create($app, $twig));
$app->add(new TrailingSlash(false)); // true adds the trailing slash (false removes it)


$app->get('/', function ($request, $response) {
    $view = Twig::fromRequest($request);
    $articles = generateArticles();
    return $view->render($response, 'home.twig', array('articles' => $articles));
})->setName('home');

$app->get('/pgp', function ($request, $response) {
    $view = Twig::fromRequest($request);
    return $view->render($response, 'pgp.twig');
})->setName('pgp');

$app->get('/linktree', function ($request, $response) {
    // Whacky in this place
    $linklist = WebsiteModel::getLinkTreeList();
    $view = Twig::fromRequest($request);
    return $view->render($response, 'linktree.twig', ['links' => $linklist]);
})->setName('linktree');

$app->get('/newsletter', function ($request, $response) {
    $view = Twig::fromRequest($request);
    return $view->render($response, 'newsletter.twig');
})->setName('newsletter');

$app->get('/imprint', function ($request, $response) {
    $view = Twig::fromRequest($request);
    return $view->render($response, 'imprint.twig');
})->setName('imprint');

$app->get('/contact', function ($request, $response) {
    $view = Twig::fromRequest($request);
    return $view->render($response, 'contact.twig');
})->setName('contact');

$app->post('/contact', function ($request, $response) {
    $view = Twig::fromRequest($request);

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
            return $view->render($response, 'contact.twig', ['error' => 'Sorry, an mailing error occured.']);
        } else {
            return $view->render($response, 'contact.twig', ['success' => 'Message has been sent.']);
        }
    } else {
        return $view->render($response, 'contact.twig', ['error' => 'Captcha failed.']);
    }
})->setName('contact-post');

$app->get('/links', function ($request, $response) {
    $view = Twig::fromRequest($request);

    $pocket = new PocketController(POCKET_AKEY);
    $links = $pocket->retrieveStarred(30);
    //print_r($links, false);
    return $view->render($response, 'links.twig', ['links' => $links]);
})->setName('links');

function extract_article($path) {
    if(!file_exists($path)) {
        return array();
    }

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
        'meta' => $meta,
        'content' => $content
    );
}

function fileExtension($s) {
    $n = strrpos($s,".");
    return ($n===false) ? "" : substr($s,$n+1);
}

function generateArticles() {
    $path = BLOG_DIR;
    $dir = new DirectoryIterator($path);
    $articles = array();
    foreach($dir as $file){
        if($file->isFile() && fileExtension($file->getFilename()) == "md"){
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

    return $articles;
}

$app->get('/blog', function ($request, $response) {
    $view = Twig::fromRequest($request);
    $articles = generateArticles();
    return $view->render($response, 'blog.twig', array('articles' => $articles));
})->setName('blog');


$app->get('/blog/{slug}', function (\Psr\Http\Message\ServerRequestInterface $request, \Psr\Http\Message\ResponseInterface $response, $args) {
    $path = BLOG_DIR;
    //open text file and read it
    $handle = $path . '/' . $args['slug'] . '.md';
    $article = extract_article($handle);
    if (!$article) {
        return $response->withStatus(404);
    }

    $slug = $article['meta']['slug'];
    $year = date("Y", $article['meta']['date']);
    $month = date("m", $article['meta']['date']);
    $day = date("d", $article['meta']['date']);

    $routeParser = RouteContext::fromRequest($request)->getRouteParser();
    $location = $routeParser->urlFor('article',
        [
            'slug' => $slug,
            'year' => $year,
            'month' => $month,
            'day' => $day
        ]
    );

    return $response->withHeader("Location", $location)->withStatus(301);
})->setName('article_deprecated');

$app->get('/blog/{year}/{month}/{day}/{slug}', function ($request, $response, $args) {
    $view = Twig::fromRequest($request);

    $path = BLOG_DIR;
    //open text file and read it
    $handle = $path . '/' . $args['slug'] . '.md';
    $article = extract_article($handle);

    if (!$article) {
        return $response->withStatus(404);
    }

    return $view->render($response, 'article.twig', $article);
})->setName('article');

$app->get('/articles/{slug}', function ($request, $response, $args) {
    $view = Twig::fromRequest($request);

    $path = BLOG_DIR;
    //open text file and read it
    $handle = $path . '/' . $args['slug'] . '.md';
    $article = extract_article($handle);

    return $view->render($response, 'article.twig', $article);
})->setName('article_static');

$app->get('/application/soundcloud', function ($request, $response, $args) {
    $view = Twig::fromRequest($request);
    return $view->render($response, 'soundcloud.twig');
})->setName('soundcloud');


$app->run();
