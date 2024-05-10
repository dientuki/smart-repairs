<?php

namespace App\Filament\Resources;

use App\Enum\OrderStatusEnum;
use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Resources\OrderResource\RelationManagers;
use App\Models\Customer;
use App\Models\Order;
use App\Models\DeviceUnit;
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
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Wizard;
use Filament\Forms\Components\Wizard\Step;
use Filament\Forms\Get;

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
                Wizard::make([
                    Step::make('Customer')
                        ->schema([
                            Select::make('device_id')
                                ->relationship('device')
                                ->getOptionLabelFromRecordUsing(fn (Model $record) => "{$record->brand->name} {$record->commercial_name}")
                                ->searchable(true)
                                ->preload(),
                            Select::make('customer_id')
                                ->relationship('customer')
                                ->getOptionLabelFromRecordUsing(fn (Model $record) => "{$record->first_name} {$record->last_name}")
                                ->native(false)
                                //->searchable(true)
                                ->required()
                                ->createOptionForm([
                                    ...self::commonFields(),
                                ])
                                ->createOptionAction(fn ($action) => $action->mutateFormDataUsing(function (array $data): array {
                                    $data['team_id'] = Filament::getTenant()->id;
                                    return $data;
                                })),
                        ])
                        ->afterValidation(function(Get $get) {
                            $order = Order::updateOrCreate([
                                'device_id' => $get('device_id'),
                                'customer_id' => $get('customer_id'),
                                'team_id' => Filament::getTenant()->id,
                            ]);
                        }),
                    Step::make('Device unit')
                        ->schema([
                            TextInput::make('serial')->require(),
                            Select::make('unlock_type')->options(OrderStatusEnum::class),
                            TextInput::make('unlock_code')
                        ])
                        ->afterValidation(function(Get $get) {
                            $order = DeviceUnit::updateOrCreate([
                                'device_id' => $get('device_id'),
                                'customer_id' => $get('customer_id'),
                                'team_id' => Filament::getTenant()->id,
                            ]);
                        }),
                    Step::make('Obs')
                        ->schema([
                            TextInput::make('commercial_name')
                        ]),
                ])

            ])->columns('full');
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
