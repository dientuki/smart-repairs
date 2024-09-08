<?php

namespace App\Filament\Team\Resources\DeviceTypeCheckResource\Pages;

use App\Filament\Team\Resources\DeviceTypeCheckResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditDeviceTypeCheck extends EditRecord
{
    protected static string $resource = DeviceTypeCheckResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
