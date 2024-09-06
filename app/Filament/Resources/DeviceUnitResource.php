<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DeviceUnitResource\Pages;
use App\Filament\Resources\DeviceUnitResource\RelationManagers;
use App\Models\DeviceUnit;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class DeviceUnitResource extends Resource
{
    protected static ?string $model = DeviceUnit::class;

    protected static ?string $tenantRelationshipName = 'customers';

    protected static ?string $navigationIcon = 'heroicon-o-server-stack';

    public static function getModelLabel(): string
    {
        return __('resource.device_unit');
    }

    public static function getPluralModelLabel(): string
    {
        return __('resource.device_unit');
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('serial')
                    ->label(__('resource.serial'))
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('unlock_type')
                    ->label(__('resource.unlock_type'))
                    ->required(),
                Forms\Components\TextInput::make('unlock_code')
                    ->label(__('resource.unlock_code'))
                    ->maxLength(255),
                Forms\Components\Select::make('device_version_id')
                    ->relationship('deviceVersion', 'version')
                    ->label(__('resource.version'))
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('serial')
                    ->label(__('resource.serial'))
                    ->searchable(),
                Tables\Columns\TextColumn::make('unlock_type')
                    ->label(__('resource.unlock_type')),
                Tables\Columns\TextColumn::make('unlock_code')
                    ->label(__('resource.unlock_code'))
                    ->searchable(),
                Tables\Columns\TextColumn::make('deviceVersion.version')
                    ->label(__('resource.version'))
                    ->searchable(),
                Tables\Columns\TextColumn::make('deviceVersion.device.commercial_name')
                    ->label(__('resource.commercial_name'))
                    ->searchable(),
                Tables\Columns\TextColumn::make('deviceVersion.device.brand.name')
                    ->label(ucfirst(__('resource.brand')))
                    ->searchable(),
                Tables\Columns\TextColumn::make('deviceVersion.device.deviceType.name')
                    ->label(ucfirst(__('resource.device_type')))
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
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
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDeviceUnits::route('/'),
            'create' => Pages\CreateDeviceUnit::route('/create'),
            'edit' => Pages\EditDeviceUnit::route('/{record}/edit'),
        ];
    }
}
