<?php

namespace App\Filament\Team\Resources;

use App\Filament\Team\Resources\CustomerResource\Pages;
use App\Models\Customer;
use App\Traits\CustomerFieldsTrait;
use App\Traits\RegistersNavigationTrait;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CustomerResource extends Resource
{
    use CustomerFieldsTrait;

    protected static ?string $model = Customer::class;

    protected static ?string $navigationIcon = 'heroicon-o-identification';

    public static function getModelLabel(): string
    {
        return __('resource.customer');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                ...self::commonFields(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('fullname')
                    ->label(__('resource.fullname')),
                TextColumn::make('email')
                    ->label(__('resource.email'))
                    ->icon('heroicon-m-envelope'),
                TextColumn::make('phone')
                    ->label(__('resource.phone')),
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
            'index' => Pages\ListCustomers::route('/'),
            'create' => Pages\CreateCustomer::route('/create'),
            'edit' => Pages\EditCustomer::route('/{record}/edit'),
        ];
    }
}
