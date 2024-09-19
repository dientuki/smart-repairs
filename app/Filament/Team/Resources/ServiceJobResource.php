<?php

namespace App\Filament\Team\Resources;

use App\Enum\DiscountEnum;
use App\Enum\SimpleDiscountEnum;
use App\Filament\Team\Resources\ServiceJobResource\Pages;
use App\Models\ServiceJob;
use App\Traits\RegistersNavigationTrait;
use Filament\Facades\Filament;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ServiceJobResource extends Resource
{
    //use RegistersNavigationTrait;

    protected static ?string $model = ServiceJob::class;

    protected static ?string $navigationIcon = 'heroicon-o-wrench-screwdriver';

    protected static ?int $navigationSort = 30;

    public static function getModelLabel(): string
    {
        return __('resource.service_job');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name'),
                TextInput::make('price')->prefix('$'),
                Select::make('discount_type')->options(function (callable $get) {
                    $team = Filament::getTenant();

                    if ($team->subscription->package->name === 'Basico') {
                        return SimpleDiscountEnum::class; // Enum para precios mayores a 100
                    }
                    return DiscountEnum::class; // Enum para otros casos
                })->reactive()
                ->default(DiscountEnum::None->value),
                TextInput::make('discount_value'),
                Toggle::make('status')

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name'),
                TextColumn::make('price')->money('ARS'),
                TextColumn::make('discount_type'),
                TextColumn::make('discount_value'),
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
            'index' => Pages\ListServiceJobs::route('/'),
            'create' => Pages\CreateServiceJob::route('/create'),
            'edit' => Pages\EditServiceJob::route('/{record}/edit'),
        ];
    }
}
