<?php

namespace App\Filament\Resources\DeviceTypeCheckResource\Pages;

use App\Filament\Resources\DeviceTypeCheckResource;
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
