<?php

namespace App\Filament\Team\Pages;

use Filament\Navigation\NavigationItem;
use Filament\Pages\Page;
use Filament\Panel\Concerns\HasTopbar;
use Filament\Pages\Concerns\HasMaxWidth;
use Filament\Support\Enums\MaxWidth;
use Illuminate\Contracts\Support\Htmlable;

class Board extends Page
{
    use HasTopbar;
    use HasMaxWidth;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-group';

    protected static string $layout = 'filament.team.layouts.board';

    protected static string $view = 'filament.team.pages.board';

    protected array $extraBodyAttributes = ['class' => 'overflow-y-scroll'];

    public function getTitle(): string | Htmlable
    {
        return __('pages.board');
    }

    public static function getNavigationLabel(): string
    {
        return __('pages.board');
    }

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

    /**
     * @return array<NavigationItem>
     */
    public static function getNavigationItems(): array
    {
        return [
            NavigationItem::make(static::getNavigationLabel())
                ->group(static::getNavigationGroup())
                ->parentItem(static::getNavigationParentItem())
                ->icon(static::getNavigationIcon())
                ->activeIcon(static::getActiveNavigationIcon())
                ->isActiveWhen(fn (): bool => request()->routeIs(static::getNavigationItemActiveRoutePattern()))
                ->sort(static::getNavigationSort())
                ->badge(static::getNavigationBadge(), color: static::getNavigationBadgeColor())
                ->badgeTooltip(static::getNavigationBadgeTooltip())
                ->url(static::getNavigationUrl())
                ->openUrlInNewTab(true)
        ];
    }
}
