<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PartResource\Pages;
use App\Filament\Resources\PartResource\RelationManagers;
use App\Models\Part;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PartResource extends Resource
{
    protected static ?string $model = Part::class;

    protected static bool $isScopedToTenant = false;

    protected static ?int $navigationSort = 50;

    protected static ?string $navigationGroup = 'Devices';

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make()->schema([
                    Select::make('module_category_id')
                        ->relationship('moduleCategory', 'name')
                        ->required()
                        ->preload(),
                    Select::make('brand_id')
                        ->relationship('brand', 'name')
                        ->required()
                        ->preload(),
                    TextInput::make('screen_printing')
                        ->requiredWithout('part_number'),
                    TextInput::make('part_number')
                        ->requiredWithout('screen_printing'),
                    TextInput::make('observations')
                        ->columnSpan(2),
                ])->columnSpan(1),
                Section::make()->schema([
                    FileUpload::make('hash_filename')
                        ->directory('parts')
                        ->openable()
                        ->imagePreviewHeight('300')
                        ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                ])->columnSpan(1),
            ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('moduleCategory.name'),
                TextColumn::make('brand.name'),
                TextColumn::make('part_number')->formatStateUsing(fn (Part $record): string =>
                    "{$record->screen_printing} {$record->part_number}"),
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
            RelationManagers\DevicesRelationManager::class,
            RelationManagers\AttachmentsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListParts::route('/'),
            'create' => Pages\CreatePart::route('/create'),
            'edit' => Pages\EditPart::route('/{record}/edit'),
        ];
    }
}
