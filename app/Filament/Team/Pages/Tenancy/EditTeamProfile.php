<?php

namespace App\Filament\Team\Pages\Tenancy;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Pages\Tenancy\EditTenantProfile;

class EditTeamProfile extends EditTenantProfile
{
    public static function getLabel(): string
    {
        return 'Team profile';
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Grid::make(2)->schema([
                    TextInput::make('name')
                        ->required(),
                    TextInput::make('address')
                        ->label(__('resource.address'))
                        ->suffixIcon('heroicon-m-map-pin'),
                    TextInput::make('website')
                        ->url()
                        ->label(__('resource.website'))
                        ->suffixIcon('heroicon-m-globe-alt'),
                    TextInput::make('email')
                        ->email()
                        ->label(__('resource.email'))
                        ->suffixIcon('heroicon-m-envelope'),
                    Repeater::make('phones')
                        ->reorderable(false)
                        ->defaultItems(1)
                        ->label(__('resource.phone'))
                        ->simple(
                    TextInput::make('phones')
                                ->suffixIcon('heroicon-m-phone')
                                ->tel()
                                ->required(),
                        ),
                    FileUpload::make('hash_filename')
                        ->directory('teams')
                        ->acceptedFileTypes(['image/svg+xml'])
                        ->label(__('resource.image'))
                    ]
                )
            ]);
    }
}
