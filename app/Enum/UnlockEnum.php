<?php

namespace App\Enum;

use Filament\Support\Contracts\HasLabel;

enum UnlockEnum: string implements HasLabel
{
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

    /**
     * Returns an array containing the values of all cases in the UnlockEnum.
     *
     * @return array An array of string values representing the cases in the UnlockEnum.
     */
    public static function getAllCasesAsArray(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }

}