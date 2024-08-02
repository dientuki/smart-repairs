<?php

namespace App\Filament\Resources\SupplierResource\RelationManagers;

use App\Models\Stock;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Components\Hidden;
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
                        Hidden::make('team_id')->default(Filament::getTenant()->id),
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
