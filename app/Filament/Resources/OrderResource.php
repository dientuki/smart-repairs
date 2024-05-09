<?php

namespace App\Filament\Resources;

use App\Enum\OrderStatusEnum;
use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Resources\OrderResource\RelationManagers;
use App\Models\Customer;
use App\Models\Order;
use Filament\Actions\Modal\Actions\Action;
use Filament\Forms;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Facades\Filament;
use App\Traits\CustomerFieldsTrait;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $tenantRelationshipName = 'customers';

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    use CustomerFieldsTrait;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('status')
                    ->options(OrderStatusEnum::class),                
                Select::make('device_id')
                    ->relationship('device')
                    ->getOptionLabelFromRecordUsing(fn (Model $record) => "{$record->brand->name} {$record->commercial_name}")
                    ->searchable(true)
                    ->preload(),
                Select::make('customer_id')
                    ->relationship('customer', 'name')
                    ->native(false)
                    ->required()
                    ->createOptionForm([
                        ...self::commonFields(), 
                    ])
                    ->createOptionAction(fn ($action) => $action->mutateFormDataUsing(function (array $data): array {
                        $data['team_id'] = Filament::getTenant()->id;
                        return $data;
                    })),
                    
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('status'),
                TextColumn::make('device.commercial_name'),
                TextColumn::make('customer.name'),
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
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
