<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SupplierResource\Pages;
use App\Filament\Resources\SupplierResource\RelationManagers\ContactsRelationManager;
use App\Filament\Resources\SupplierResource\RelationManagers\StocksRelationManager;
use App\Models\Supplier;
use App\Traits\RegistersNavigationTrait;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\TextInput;
use Filament\Tables\Columns\TextColumn;

class SupplierResource extends Resource
{
    use RegistersNavigationTrait;

    protected static ?string $model = Supplier::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-storefront';

    public static function getModelLabel(): string
    {
        return __('resource.supplier');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                    ->required()
                    ->translateLabel(),
                TextInput::make('email')
                    ->required()
                    ->suffixIcon('heroicon-m-envelope')
                    ->label(__('resource.email')),
                TextInput::make('phone')
                    ->required()
                    ->suffixIcon('heroicon-m-phone')
                    ->label(__('resource.phone')),
                TextInput::make('address')
                    ->required()
                    ->suffixIcon('heroicon-m-map-pin')
                    ->label(__('resource.address')),
                TextInput::make('website')
                    ->required()
                    ->suffixIcon('heroicon-m-globe-alt')
                    ->label(__('resource.website')),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->translateLabel(),
                TextColumn::make('email')
                    ->label(__('resource.email'))
                    ->icon('heroicon-m-envelope'),
                TextColumn::make('phone')
                    ->label(__('resource.phone'))
                    ->icon('heroicon-m-phone'),
                TextColumn::make('address')
                    ->icon('heroicon-m-map-pin')
                    ->label(__('resource.address')),
                TextColumn::make('website')
                    ->label(__('resource.website'))
                    ->url(fn ($record) => $record->url ?? '#', true)
                    ->icon('heroicon-m-globe-alt')
                    ->formatStateUsing(fn (?string $state): string => $state ? __("Link") : __("No Link"))
                    ->tooltip(fn (Supplier $record): string => $record->website ?? __("No URL")),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            ContactsRelationManager::class,
            StocksRelationManager::class
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSuppliers::route('/'),
            'create' => Pages\CreateSupplier::route('/create'),
            'edit' => Pages\EditSupplier::route('/{record}/edit'),
        ];
    }
}
