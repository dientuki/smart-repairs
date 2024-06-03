<?php

namespace App\Enum;

use Filament\Support\Contracts\HasLabel;
use App\Traits\EnumAsArrayTrait;

enum UnlockEnum: string implements HasLabel
{
    case None = 'none';
    case Code = 'code';
    case Pattern = 'pattern';

    use EnumAsArrayTrait;

    public function getLabel(): string
    {
        return match ($this) {
            self::None => __('None'),
            self::Code => __('Code'),
            self::Pattern => __('Pattern'),
        };
    }
}