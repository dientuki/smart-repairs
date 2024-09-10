<?php

namespace App\Filament\Team\Resources\SimpleServiceJobResource\Pages;

use App\Filament\Team\Resources\SimpleServiceJobResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListSimpleServiceJobs extends ListRecords
{
    protected static string $resource = SimpleServiceJobResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
