<?php

namespace App\Filament\Team\Resources\SupplierResource\RelationManagers;

use App\Models\Stock;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Actions\AttachAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class StocksRelationManager extends RelationManager
{
    protected static string $relationship = 'stocks';

    public function form(Form $form): Form
    {
        return $form
            ->schema([

            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('quantity')
            ->columns([
                TextColumn::make('part.moduleCategory.name'),
                TextColumn::make('part.brand.name'),
                TextColumn::make('part.part_number'),
                TextColumn::make('quantity')
                    ->badge()
                    ->color(fn ($state, $record) => match (true) {
                        $state == 0 => 'danger',
                        $state < $record->warning => 'warning',
                        default => 'success',
                    }),
                TextColumn::make('warning'),
                TextColumn::make('price'),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                AttachAction::make()
                    ->preloadRecordSelect()
                    ->recordTitle(fn (Stock $record): string =>
                        "{$record->part->moduleCategory->name}"
                        . " {$record->part->brand->name} {$record->part->part_number}")
                    ->form(fn (AttachAction $action): array => [
                        $action->getRecordSelect(),
                        TextInput::make('price'),
                    ]),
            ])
            ->actions([
                Tables\Actions\DetachAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DetachBulkAction::make(),
                ]),
            ]);
    }
}
