<?php

namespace App\Enum;

use Filament\Support\Contracts\HasLabel;
use App\Traits\EnumAsArrayTrait;

enum RolEnum: string implements HasLabel
{
    use EnumAsArrayTrait;

    case Administrator = 'administrator';
    case Technician = 'technician';
    case Salesperson = 'salesperson';

    public function getLabel(): string
    {
        return match ($this) {
            self::Administrator => __('Administrator'),
            self::Technician => __('Technician'),
            self::Salesperson => __('Salesperson'),
        };
    }

    /**
     * Obtiene el valor por defecto para el enum.
     *
     * @return DiscountEnum
     */
    public static function default(): self
    {
        // Cambia 'None' por el valor que quieras como predeterminado
        return self::Salesperson;
    }
}
