<?php

namespace App\Enum;

use Filament\Support\Contracts\HasLabel;
use App\Traits\EnumAsArrayTrait;

enum OrderStatusEnum: string implements HasLabel
{
    use EnumAsArrayTrait;

    case ForBudgeting = 'ForBudgeting';
    case Budgeting = 'Budgeting';
    case Budgeted = 'Budgeted';
    case ToDo = 'ToDo';
    case Repairing = 'Repairing';
    case Repaired = 'Repaired';
    case Ready = 'Ready';

    public function getLabel(): string
    {
        return match ($this) {
            self::ForBudgeting => __('For budgeting'),
            self::Budgeting => __('Budgeting'),
            self::Budgeted => __('Budgeted'),
            self::ToDo => __('To do'),
            self::Repairing => __('Repairing'),
            self::Repaired => __('Repaired'),
            self::Ready => __('Ready'),
        };
    }

    public static function isValid(string $value): bool
    {
        return in_array($value, array_column(self::cases(), 'value'), true);
    }

    /**
     * Obtiene el valor por defecto para el enum.
     *
     * @return DiscountEnum
     */
    public static function default(): self
    {
        // Cambia 'None' por el valor que quieras como predeterminado
        return self::ForBudgeting;
    }
}
