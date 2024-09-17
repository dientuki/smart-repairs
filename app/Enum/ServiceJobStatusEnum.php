<?php

namespace App\Enum;

use Filament\Support\Contracts\HasLabel;
use App\Traits\EnumAsArrayTrait;

enum ServiceJobStatusEnum: string implements HasLabel
{
    use EnumAsArrayTrait;

    case Active = 'Active';
    case Inactive = 'Inactive';

    /**
     * @param string $value
     * @return string|null
     */
    public function getLabel(): string
    {
        return match ($this) {
            self::Active => __('Active'),
            self::Inactive => __('Inactive'),
        };
    }

    /**
     * Obtiene el valor por defecto para el enum.
     *
     * @return ServiceJobStatusEnum
     */
    public static function default(): self
    {
        // Cambia 'Active' por el valor que quieras como predeterminado
        return self::Active;
    }
}
