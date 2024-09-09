<?php

namespace App\Filament\Team\Resources;

use App\Enum\DiscountEnum;
use App\Filament\Team\Resources\ServiceJobResource\Pages;
use App\Models\ServiceJob;
use App\Traits\RegistersNavigationTrait;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ServiceJobResource extends Resource
{
    use RegistersNavigationTrait;

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
                Select::make('discount_type')->options(DiscountEnum::class)
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name'),
                TextColumn::make('price')->money('ARS'),
                TextColumn::make('discount_type'),
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
