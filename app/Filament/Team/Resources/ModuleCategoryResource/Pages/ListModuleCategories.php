<?php

namespace App\Filament\Team\Resources\ModuleCategoryResource\Pages;

use App\Filament\Team\Resources\ModuleCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListModuleCategories extends ListRecords
{
    protected static string $resource = ModuleCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
