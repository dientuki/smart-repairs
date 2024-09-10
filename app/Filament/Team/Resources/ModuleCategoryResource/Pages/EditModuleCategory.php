<?php

namespace App\Filament\Team\Resources\ModuleCategoryResource\Pages;

use App\Filament\Team\Resources\ModuleCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditModuleCategory extends EditRecord
{
    protected static string $resource = ModuleCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
