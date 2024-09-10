<?php

namespace App\Filament\Team\Resources\DeviceTypeCheckResource\Pages;

use App\Filament\Team\Resources\DeviceTypeCheckResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListDeviceTypeChecks extends ListRecords
{
    protected static string $resource = DeviceTypeCheckResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
