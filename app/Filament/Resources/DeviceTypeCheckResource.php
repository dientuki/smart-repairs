<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DeviceTypeCheckResource\Pages;
use App\Filament\Resources\DeviceTypeCheckResource\RelationManagers;
use App\Models\DeviceTypeCheck;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class DeviceTypeCheckResource extends Resource
{
    protected static ?string $model = DeviceTypeCheck::class;

    protected static ?string $tenantRelationshipName = 'customers';

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('device_type_id')
                    ->relationship(
                        name: 'deviceType',
                        titleAttribute: 'name',
                        modifyQueryUsing: function (Builder $query, string $operation) {

                            if ($operation === 'create') {
                                $query->whereNotIn('id', function ($query) {
                                    $tenant = Filament::getTenant();
                                    $query->select('device_type_id')
                                        ->from('device_type_checks')
                                        ->where('team_id', $tenant->id);
                                });
                            }
                        }
                    )
                    ->preload()
                    ->required()
                    ->disabledOn('edit')
                    ->columnSpan('full'),
                Repeater::make('damages')
                    ->reorderable(false)
                    ->simple(
                        TextInput::make('damages')
                            ->required(),
                    ),
                Repeater::make('features')
                    ->reorderable(false)
                    ->simple(
                        TextInput::make('features')
                            ->required(),
                    )
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('deviceType.name'),
                TextColumn::make('damages'),
                TextColumn::make('features'),
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
            'index' => Pages\ListDeviceTypeChecks::route('/'),
            'create' => Pages\CreateDeviceTypeCheck::route('/create'),
            'edit' => Pages\EditDeviceTypeCheck::route('/{record}/edit'),
        ];
    }
}
