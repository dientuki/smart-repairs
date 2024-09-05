<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DeviceTypeResource\Pages;
use App\Models\DeviceType;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Tables;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class DeviceTypeResource extends KnowledgeResource
{
    protected static ?string $model = DeviceType::class;

    protected static ?int $navigationSort = 20;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function getModelLabel(): string
    {
        return __('resource.device_type');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                    ->required()
                    ->translateLabel(),
                FileUpload::make('hash_filename')
                    ->directory('logos')
                    ->label(__('resource.image')),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->translateLabel(),
                ImageColumn::make('hash_filename')->label(__('resource.image')),
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
            'index' => Pages\ListDeviceTypes::route('/'),
            'create' => Pages\CreateDeviceType::route('/create'),
            'edit' => Pages\EditDeviceType::route('/{record}/edit'),
        ];
    }
}
