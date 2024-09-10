<?php

namespace App\Filament\Team\Resources;

use App\Filament\Team\Resources\KnowledgeResource;
use App\Filament\Team\Resources\BrandResource\Pages\CreateBrand;
use App\Filament\Team\Resources\BrandResource\Pages\EditBrand;
use App\Filament\Team\Resources\BrandResource\Pages\ListBrands;
use App\Models\Brand;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Tables;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class BrandResource extends KnowledgeResource
{
    protected static ?string $model = Brand::class;

    protected static ?int $navigationSort = 10;

    protected static ?string $navigationIcon = 'heroicon-o-tag';

    public static function getModelLabel(): string
    {
        return __('resource.brand');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                    ->required()
                    ->translateLabel(),
                FileUpload::make('hash_filename')
                    ->directory('logos')
                    ->acceptedFileTypes(['image/svg+xml'])
                    ->label(__('resource.image'))
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->translateLabel(),
                ImageColumn::make('hash_filename')->label(__('resource.image')),
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
            'index' => ListBrands::route('/'),
            'create' => CreateBrand::route('/create'),
            'edit' => EditBrand::route('/{record}/edit'),
        ];
    }
}
