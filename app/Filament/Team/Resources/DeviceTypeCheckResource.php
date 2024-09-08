<?php

namespace App\Filament\Team\Resources;

use App\Filament\Team\Resources\DeviceTypeCheckResource\Pages;
use App\Models\DeviceTypeCheck;
use Filament\Facades\Filament;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class DeviceTypeCheckResource extends Resource
{
    protected static ?string $model = DeviceTypeCheck::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-check';

    public static function getModelLabel(): string
    {
        return __('resource.device_check');
    }

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
                    ->label(ucfirst(__('resource.device_type')))
                    ->preload()
                    ->required()
                    ->disabledOn('edit')
                    ->columnSpan('full'),
                Repeater::make('damages')
                    ->reorderable(false)
                    ->label(__('resource.damages'))
                    ->simple(
                        TextInput::make('damages')
                            ->required(),
                    ),
                Repeater::make('features')
                    ->reorderable(false)
                    ->label(__('resource.features'))
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
                TextColumn::make('deviceType.name')->label(ucfirst(__('resource.device_type'))),
                TextColumn::make('damages')->label(__('resource.damages')),
                TextColumn::make('features')->label(__('resource.features')),
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
