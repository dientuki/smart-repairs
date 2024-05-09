<?php

namespace App\Traits;

use Filament\Forms\Components\TextInput;

trait CustomerFieldsTrait
{
    public static function commonFields(): array
    {
        return [
            TextInput::make('first_name')
                ->required(),
            TextInput::make('last_name')
                ->required(),                
            TextInput::make('email')
                ->email()
                ->required(),
            TextInput::make('phone')
                ->tel()
                ->required(), 
        ];
    }
}
