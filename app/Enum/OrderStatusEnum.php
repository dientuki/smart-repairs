<?php

namespace App\Enum;

enum OrderStatusEnum: string
{
    case TOBUDGE = 'to budge';
    case OPEN = 'open';
    case CLOSED = 'closed';
}