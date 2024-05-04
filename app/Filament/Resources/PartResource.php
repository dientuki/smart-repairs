<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PartResource\Pages;
use App\Filament\Resources\PartResource\RelationManagers;
use App\Models\Part;
use Filament\Forms;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PartResource extends Resource
{
    protected static ?string $model = Part::class;

    protected static bool $isScopedToTenant = false;    

    protected static ?string $navigationGroup = 'Devices';

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                    ->required(),
                TextInput::make('part_number')
                    ->required(),
                Select::make('brand_id')
                    ->relationship('brand', 'name')
                    ->required()
                    ->preload(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name'),
                TextColumn::make('part_number'),
                TextColumn::make('brand.name'),
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
            'index' => Pages\ListParts::route('/'),
            'create' => Pages\CreatePart::route('/create'),
            'edit' => Pages\EditPart::route('/{record}/edit'),
        ];
    }
}
