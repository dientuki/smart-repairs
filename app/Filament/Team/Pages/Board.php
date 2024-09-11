<?php

namespace App\Filament\Team\Pages;

use Filament\Pages\Page;
use Filament\Panel\Concerns\HasTopbar;
use Filament\Pages\Concerns\HasMaxWidth;
use Filament\Support\Enums\MaxWidth;

class Board extends Page
{
    use HasTopbar;
    use HasMaxWidth;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-group';

    protected static string $layout = 'filament.team.layouts.board';

    protected static string $view = 'filament.team.pages.board';

    protected array $extraBodyAttributes = ['class' => 'overflow-y-scroll'];

    public function getMaxWidth(): MaxWidth | string | null
    {
        return MaxWidth::FiveExtraLarge;
    }

    protected function getLayoutData(): array
    {
        return [
            'hasTopbar' => $this->hasTopbar(),
            'maxWidth' => $this->getMaxWidth(),
        ];
    }
}
