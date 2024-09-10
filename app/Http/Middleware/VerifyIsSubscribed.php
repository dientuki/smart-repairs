<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyIsSubscribed
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $user = $request->user();


        if (!filament()->getTenant()->subscription->is_active) {
            return redirect()->route(
                'filament.' . filament()->getCurrentPanel()->getId() . '.tenant.billing',
                ['tenant' => filament()->getTenant()->id]
            );
        }

        return $next($request);
    }
}
