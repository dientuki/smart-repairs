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

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('serial')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('unlock_type')
                    ->required(),
                Forms\Components\TextInput::make('unlock_code')
                    ->maxLength(255),
                Forms\Components\Select::make('device_version_id')
                    ->relationship('deviceVersion', 'version')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('serial')
                    ->searchable(),
                Tables\Columns\TextColumn::make('unlock_type'),
                Tables\Columns\TextColumn::make('unlock_code')
                    ->searchable(),
                Tables\Columns\TextColumn::make('deviceVersion.version')
                    ->searchable(),
                Tables\Columns\TextColumn::make('deviceVersion.device.commercial_name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('deviceVersion.device.brand.name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('deviceVersion.device.deviceType.name')
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
