<?php

namespace App\Enum;

use Filament\Support\Contracts\HasLabel;
use App\Traits\EnumAsArrayTrait;

enum BudgetStatusEnum: string implements HasLabel
{
    use EnumAsArrayTrait;

    case Pending = 'Pending';
    case Approved = 'Approved';
    case Rejected = 'Rejected';

    /**
     * @param string $value
     * @return string|null
     */
    public function getLabel(): string
    {
        return match ($this) {
            self::Pending => __('Pending'),
            self::Approved => __('Approved'),
            self::Rejected => __('Rejected'),
        };
    }

    /**
     * Obtiene el valor por defecto para el enum.
     *
     * @return BudgetStatusEnum
     */
    public static function default(): self
    {
        return self::Pending;
    }
}
