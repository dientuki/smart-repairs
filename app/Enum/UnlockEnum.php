<?php

namespace App\Enum;

use Filament\Support\Contracts\HasLabel;
use App\Traits\EnumAsArrayTrait;

enum UnlockEnum: string implements HasLabel
{
    use EnumAsArrayTrait;

    case None = 'none';
    case Code = 'code';
    case Pattern = 'pattern';

    public function getLabel(): string
    {
        return match ($this) {
            self::None => __('None'),
            self::Code => __('Code'),
            self::Pattern => __('Pattern'),
        };
    }
}
