<?php

namespace App\Enum;

enum OperationStatusEnum: string
{
    case Created = 'Created';
    case Updated = 'Updated';
    case NoChange = 'NoChange';
}
