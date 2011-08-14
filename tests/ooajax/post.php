<?php 

file_put_contents(dirname(__FILE__) . '/dump.txt', print_r($_GET, true));

echo '{"text": "ok"}';