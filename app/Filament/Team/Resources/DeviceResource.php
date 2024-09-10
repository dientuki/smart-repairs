<?php

namespace App\Filament\Team\Resources;

use App\Filament\Team\Resources\DeviceResource\Pages;
use App\Filament\Team\Resources\DeviceResource\RelationManagers;
use App\Models\Device;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Form;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class DeviceResource extends KnowledgeResource
{
    protected static ?string $model = Device::class;

    protected static ?int $navigationSort = 50;

    protected static ?string $navigationIcon = 'heroicon-o-device-phone-mobile';

    public static function getModelLabel(): string
    {
        return __('resource.device');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('device_type_id')
                    ->relationship('deviceType', 'name')
                    ->label(ucfirst(__('resource.device_type')))
                    ->preload(),
                Select::make('brand_id')
                    ->relationship('brand', 'name')
                    ->label(ucfirst(__('resource.brand')))
                    ->preload(),
                TextInput::make('commercial_name')
                    ->label(__('resource.commercial_name'))
                    ->required(),
                TextInput::make('url')
                    ->label(__('resource.url'))
                    ->suffixIcon('heroicon-m-globe-alt'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('deviceType.name')->label(ucfirst(__('resource.device_type'))),
                TextColumn::make('brand.name')->label(ucfirst(__('resource.brand'))),
                TextColumn::make('commercial_name')->label(__('resource.commercial_name')),
                TextColumn::make('url')
                    ->label(__('resource.url'))
                    ->url(fn ($record) => $record->url ?? '#', true)
                    ->icon('heroicon-m-globe-alt')
                    ->formatStateUsing(fn (?string $state): string => $state ? __("Link") : __("No Link"))
                    ->tooltip(fn (Device $record): string => $record->url ?? __("No URL"))

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
            RelationManagers\PartsRelationManager::class,
            RelationManagers\VersionsRelationManager::class,
            RelationManagers\AttachmentsRelationManager::class,

        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDevices::route('/'),
            'create' => Pages\CreateDevice::route('/create'),
            'edit' => Pages\EditDevice::route('/{record}/edit'),
        ];
    }
}
