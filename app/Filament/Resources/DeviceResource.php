<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DeviceResource\Pages;
use App\Filament\Resources\DeviceResource\RelationManagers;
use App\Models\Device;
use Filament\Forms;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class DeviceResource extends Resource
{
    protected static ?string $model = Device::class;

    protected static bool $isScopedToTenant = false;

    protected static ?int $navigationSort = 40;

    protected static ?string $navigationGroup = 'Devices';

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('device_type_id')
                    ->relationship('deviceType', 'name')
                    ->preload(),
                Select::make('brand_id')
                    ->relationship('brand', 'name')
                    ->preload(),
                TextInput::make('commercial_name')
                    ->required(),
                TextInput::make('tech_name')
                    ->required(),
                TextInput::make('url')
                    ->suffixIcon('heroicon-m-globe-alt'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('deviceType.name'),
                TextColumn::make('brand.name'),
                TextColumn::make('commercial_name'),
                TextColumn::make('tech_name'),
                TextColumn::make('url')
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
