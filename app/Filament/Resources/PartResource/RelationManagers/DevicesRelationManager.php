<?php

namespace App\Filament\Resources\PartResource\RelationManagers;

use App\Models\DeviceVersion;
use Filament\Forms;
use Filament\Forms\Components\Select;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Actions\AttachAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class DevicesRelationManager extends RelationManager
{
    protected static string $relationship = 'deviceVersions';

    public function form(Form $form): Form
    {
        return $form
            ->schema([

            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('commercial_name')
            ->columns([
                TextColumn::make('device.brand.name'),
                TextColumn::make('device.commercial_name'),
                TextColumn::make('version'),
                TextColumn::make('description'),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                // phpcs:disable Generic.Files.LineLength.TooLong
                AttachAction::make()
                    ->preloadRecordSelect()
                    ->recordSelect(
                        fn (Select $select) => $select->placeholder('Select a post'),
                    )
                    ->recordSelectSearchColumns(['version'])
                    ->recordTitle(fn (DeviceVersion $record): string => "{$record->device->brand->name} {$record->device->commercial_name} {$record->version} ({$record->description})")
                    ->form(fn (AttachAction $action): array => [
                        $action->getRecordSelect(),
                    ]),
                // phpcs:enable
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
