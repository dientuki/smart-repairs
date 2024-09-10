<?php

namespace App\Filament\Team\Resources;

use Filament\Resources\Resource;

abstract class KnowledgeResource extends Resource
{
    protected static bool $isScopedToTenant = false;

    public static function getNavigationGroup(): ?string
    {
        return ucfirst(__('resource.knowledge'));
    }
}
