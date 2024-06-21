<?php

namespace App\Filament\Resources\DeviceResource\RelationManagers;

use Filament\Forms\Components\Select;
use Filament\Tables\Actions\ViewAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Actions\DetachAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PartsRelationManager extends RelationManager
{
    protected static string $relationship = 'parts';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('part_number')
                    ->required()
                    ->maxLength(255),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('part_number')
            ->columns([
                TextColumn::make('moduleCategory.name'),
                TextColumn::make('brand.name'),
                TextColumn::make('part_number'),
            ])
            ->filters([
                //
            ])
            ->headerActions([

            ])
            ->actions([
                ViewAction::make()
                    ->form([
                        Select::make('module_category_id')
                            ->relationship('moduleCategory', 'name')->columns(1),
                        Select::make('brand_id')
                            ->relationship('brand', 'name')->columns(1),
                        TextInput::make('part_number')->columns(1),
                        TextInput::make('observations')->columnSpan(3)->columns(1),
                    ]),
                DetachAction::make(),
            ])
            ->bulkActions([

            ]);
    }
}
