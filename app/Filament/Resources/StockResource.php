<?php

namespace App\Filament\Resources;

use App\Filament\Resources\StockResource\Pages;
use App\Filament\Resources\StockResource\RelationManagers\DevicesRelationManager;
use App\Filament\Resources\StockResource\RelationManagers\SuppliersRelationManager;
use App\Models\Stock;
use App\Traits\RegistersNavigationTrait;
use Filament\Facades\Filament;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Grid;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class StockResource extends Resource
{
    use RegistersNavigationTrait;

    protected static ?string $model = Stock::class;

    protected static ?string $navigationIcon = 'heroicon-o-book-open';

    public static function getModelLabel(): string
    {
        return __('resource.stock');
    }

    public static function getPluralModelLabel(): string
    {
        return __('resource.stock');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('part_id')
                    ->label(ucfirst(__('resource.part')))
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
                            ->label(__('resource.price'))
                            ->prefix('$')
                            ->required(),
                        TextInput::make('quantity')
                            ->label(__('resource.quantity'))
                            ->required(),
                        TextInput::make('warning')
                            ->label(__('resource.warning'))
                            ->required(),
                    ]),
            ]);
    }


    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('part.moduleCategory.name')
                    ->label(ucfirst(__('resource.module_category'))),
                TextColumn::make('part.brand.name')
                    ->label(ucfirst(__('resource.brand'))),
                TextColumn::make('part.part_number')
                    ->label(__('resource.part_number')),
                TextColumn::make('price')
                    ->label(__('resource.price'))
                    ->money('ARS'),
                TextColumn::make('quantity')
                    ->badge()
                    ->label(__('resource.quantity'))
                    ->color(fn ($state, $record) => match (true) {
                        $state == 0 => 'danger',
                        $state < $record->warning => 'warning',
                        default => 'success',
                    }),
                TextColumn::make('warning')
                    ->label(__('resource.warning')),
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
