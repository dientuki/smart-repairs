<?php

namespace App\Enum;

use Filament\Support\Contracts\HasLabel;

enum UnlockEnum: string implements HasLabel
{
    case NONE = 'none';
    case CODE = 'code';
    case PATTERN = 'pattern';


    public function getLabel(): string
    {
        return match ($this) {
            self::NONE => __('None'),
            self::CODE => __('Code'),
            self::PATTERN => __('Pattern'),
        };
    }
}