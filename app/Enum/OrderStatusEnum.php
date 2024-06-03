<?php

namespace App\Enum;

use Filament\Support\Contracts\HasLabel;
use App\Traits\EnumAsArrayTrait;

enum OrderStatusEnum: string implements HasLabel
{
    case ForBudgeting = 'for budgeting';
    case Budgeting = 'budgeting';
    case Budgeted = 'budgeted';
    case ToDo = 'to do';
    case Repairing = 'repairing';
    case Repaired = 'repaired';
    case Ready = 'ready';

    use EnumAsArrayTrait;

    public function getLabel(): string {
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

    public static function isValid(string $value): bool {
        return in_array($value, array_column(self::cases(), 'value'), true);
    }
}
