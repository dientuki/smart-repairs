<?php

namespace App\Enum;

enum OrderStatusEnum: string
{
    case OPEN = 'open';
    case CLOSED = 'closed';
}