<?php

namespace App\Enum;

enum UnlockEnum: string
{
    case NONE = 'open';
    case CODE = 'closed';
    case PATTERN = 'closed';
}