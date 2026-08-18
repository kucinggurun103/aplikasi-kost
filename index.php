<?php

/**
 * Laravel - A PHP Framework For Web Artisans
 * Root Fallback Controller for Shared Hosting Deployments
 */

$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? ''
);

// If the file exists directly in public, let webserver handle it
if ($uri !== '/' && file_exists(__DIR__.'/public'.$uri)) {
    return false;
}

require_once __DIR__.'/public/index.php';
