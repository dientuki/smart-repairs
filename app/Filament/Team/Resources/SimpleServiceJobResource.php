<?php

namespace App\Filament\Team\Resources;

use App\Models\SimpleServiceJob;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use App\Filament\Team\Resources\SimpleServiceJobResource\Pages;
use App\Traits\RegistersNavigationTrait;
use Filament\Forms\Components\TextInput;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\TextInputColumn;

class SimpleServiceJobResource extends Resource
{
    use RegistersNavigationTrait;

    protected static ?string $model = SimpleServiceJob::class;

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
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name'),
                TextInputColumn::make('price')->rules(['required', 'numeric']),
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
            'index' => Pages\ListSimpleServiceJobs::route('/'),
            'create' => Pages\CreateSimpleServiceJob::route('/create'),
            'edit' => Pages\EditSimpleServiceJob::route('/{record}/edit'),
        ];
    }
}
