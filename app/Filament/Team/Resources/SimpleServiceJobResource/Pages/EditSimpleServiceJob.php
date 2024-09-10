<?php

namespace App\Filament\Team\Resources\SimpleServiceJobResource\Pages;

use App\Filament\Team\Resources\SimpleServiceJobResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditSimpleServiceJob extends EditRecord
{
    protected static string $resource = SimpleServiceJobResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
