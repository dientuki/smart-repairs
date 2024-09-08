<?php

namespace App\Filament\Team\Resources\DeviceUnitResource\Pages;

use App\Filament\Team\Resources\DeviceUnitResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListDeviceUnits extends ListRecords
{
    protected static string $resource = DeviceUnitResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
