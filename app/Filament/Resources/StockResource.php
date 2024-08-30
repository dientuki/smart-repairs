<?php

namespace App\Filament\Resources;

use App\Filament\Resources\StockResource\Pages;
use App\Filament\Resources\StockResource\RelationManagers;
use App\Filament\Resources\StockResource\RelationManagers\DevicesRelationManager;
use App\Filament\Resources\StockResource\RelationManagers\SuppliersRelationManager;
use App\Models\Part;
use App\Models\Stock;
use Filament\Facades\Filament;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms;
use Filament\Forms\Components\Grid;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class StockResource extends Resource
{
    protected static ?string $model = Stock::class;

    protected static ?string $tenantRelationshipName = 'customers';

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('part_id')
                    ->relationship(
                        name: 'part',
                        modifyQueryUsing: function (Builder $query, string $operation) {
                            if ($operation === 'create') {
                                $query->whereNotIn('id', function ($query) {
                                    $tenant = Filament::getTenant();
                                    $query->select('part_id')
                                        ->from('stocks')
                                        ->where('team_id', $tenant->id);
                                });
                            }
                        }
                    )
                    ->getOptionLabelFromRecordUsing(fn (Model $record) => $record->label)
                    ->preload()
                    ->required()
                    ->disabledOn('edit')
                    ->columnSpan('full'),
                Grid::make(3)
                    ->schema([
                        TextInput::make('price')
                            ->prefix('$')
                            ->required(),
                        TextInput::make('quantity')
                            ->required(),
                        TextInput::make('warning')
                            ->required(),
                    ]),
            ]);
    }


    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('part.moduleCategory.name'),
                TextColumn::make('part.brand.name'),
                TextColumn::make('part.part_number'),
                TextColumn::make('price')->money('ARS'),
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
            DevicesRelationManager::class,
            SuppliersRelationManager::class
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListStocks::route('/'),
            'create' => Pages\CreateStock::route('/create'),
            'edit' => Pages\EditStock::route('/{record}/edit'),
        ];
    }
}
