<?php

namespace App\Providers;

use App\Http\Middleware\VerifyIsSubscribed;
use Filament\Billing\Providers\Contracts\Provider;
use Illuminate\Http\RedirectResponse;
use Closure;

class SubscriptionsProvider implements Provider
{
    public function getRouteAction(): string | Closure
    {
      return function (): RedirectResponse {
        dd(filament()->getCurrentPanel()->getId());
        return redirect()->route('/');
      };
    }

    public function getSubscribedMiddleware(): string
    {
        return VerifyIsSubscribed::class;
    }
}