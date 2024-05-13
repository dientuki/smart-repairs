<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum OrderStatusEnum: string implements HasLabel
{
    const FORBUDGETING = 'for budgeting';
    const BUDGETING = 'budgeting';
    const BUDGETED = 'budgeted';
    const TODO = 'to do';
    const REPAIRING = 'repairing';
    const REPAIRED = 'repaired';
    const READY = 'ready';

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
}
