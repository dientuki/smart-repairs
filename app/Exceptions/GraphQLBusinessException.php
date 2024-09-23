<?php

namespace App\Exceptions;

use Exception;

class GraphQLBusinessException extends Exception
{
    private $i18nKey;

    public function __construct($i18nKey = false, $message = "", $code = 0, Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);
        $this->i18nKey = $i18nKey;
    }

    public function getI18nKey()
    {
        return $this->i18nKey;
    }

}
