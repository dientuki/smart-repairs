<?php

namespace App\Enum;

use Filament\Support\Contracts\HasLabel;
use App\Traits\EnumAsArrayTrait;

enum OrderStatusEnum: string implements HasLabel
{
    case FORBUDGETING = 'for budgeting';
    case BUDGETING = 'budgeting';
    case BUDGETED = 'budgeted';
    case TODO = 'to do';
    case REPAIRING = 'repairing';
    case REPAIRED = 'repaired';
    case READY = 'ready';

    use EnumAsArrayTrait;

    public function getLabel(): string {
        return match ($this) {
            self::FORBUDGETING => __('For budgeting'),
            self::BUDGETING => __('Budgeting'),
            self::BUDGETED => __('Budgeted'),
            self::TODO => __('To do'),
            self::REPAIRING => __('Repairing'),
            self::REPAIRED => __('Repaired'),
            self::READY => __('Ready'),
        };
    }

    public static function isValid(string $value): bool {
        return in_array($value, array_column(self::cases(), 'value'), true);
    }
}
