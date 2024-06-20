<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ModuleCategoryResource\Pages;
use App\Filament\Resources\ModuleCategoryResource\RelationManagers;
use App\Models\ModuleCategory;
use Filament\Forms;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ModuleCategoryResource extends Resource
{
    protected static ?string $model = ModuleCategory::class;

    protected static bool $isScopedToTenant = false;

    protected static ?int $navigationSort = 30;

    protected static ?string $navigationGroup = 'Devices';

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name'),
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
            'index' => Pages\ListModuleCategories::route('/'),
            'create' => Pages\CreateModuleCategory::route('/create'),
            'edit' => Pages\EditModuleCategory::route('/{record}/edit'),
        ];
    }
}
