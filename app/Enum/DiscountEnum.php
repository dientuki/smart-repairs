<?php

namespace App\Enum;

use Filament\Support\Contracts\HasLabel;
use App\Traits\EnumAsArrayTrait;

enum DiscountEnum: string implements HasLabel
{
    use EnumAsArrayTrait;

    case None = 'None';
    case Percentage = 'Percentage';
    case Amount = 'Amount';

    /**
     * @param string $value
     * @return string|null
     */
    public function getLabel(): string
    {
      return match ($this) {
        self::None => __('None'),
        self::Percentage => __('Percentage'),
        self::Amount => __('Amount'),
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
        return self::None;
    }
}
