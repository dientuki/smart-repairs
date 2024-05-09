<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DeviceTypeResource\Pages;
use App\Filament\Resources\DeviceTypeResource\RelationManagers;
use App\Models\DeviceType;
use Filament\Forms;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class DeviceTypeResource extends Resource
{
    protected static ?string $model = DeviceType::class;

    protected static bool $isScopedToTenant = false;

    protected static ?int $navigationSort = 20;

    protected static ?string $navigationGroup = 'Devices';

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                    ->required()
                    ->columnSpan('full'),
                Section::make('Express check')
                    ->description('Prevent abuse by limiting the number of requests per period')
                    ->schema([
                        Textarea::make('express_check')
                            ->required(),
                        Toggle::make('express_check_default')
                            ->required(),    
                    ])->columnSpan(2)->columns(1),
                Section::make('Extra check')
                    ->description('Prevent abuse by limiting the number of requests per period')
                    ->schema([
                        Textarea::make('extra_check')
                            ->required(),
                        Toggle::make('extra_check_default')
                            ->required(),                    
                    ])->columnSpan(2)->columns(1),                     
            ])->columns(4);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name'),
                TextColumn::make('express_check')->listWithLineBreaks()->separator(','),
                ToggleColumn::make('express_check_default'),
                TextColumn::make('extra_check')->listWithLineBreaks()->separator(','),
                ToggleColumn::make('extra_check_default'),
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
