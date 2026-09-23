<?php

// Memastikan folder direktori sementara /tmp dibuat untuk caching Laravel di Vercel
$storageDirs = [
    '/tmp/storage/framework/views',
    '/tmp/storage/framework/data',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/framework/cache',
    '/tmp/storage/logs',
    '/tmp/bootstrap/cache',
];

foreach ($storageDirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

// Forward request ke public/index.php bawaan Laravel
require __DIR__ . '/../public/index.php';
