<?php

namespace App\Filament\Team\Resources\DeviceUnitResource\Pages;

use App\Filament\Team\Resources\DeviceUnitResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditDeviceUnit extends EditRecord
{
    protected static string $resource = DeviceUnitResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
