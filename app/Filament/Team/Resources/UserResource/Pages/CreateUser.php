<?php

namespace App\Filament\Team\Resources\UserResource\Pages;

use App\Filament\Team\Resources\UserResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    protected static string $resource = UserResource::class;
}
