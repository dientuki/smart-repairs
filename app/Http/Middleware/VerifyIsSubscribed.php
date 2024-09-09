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
        //dd('aca');
        //dd(filament());
        //dd(filament()->getTenant());

        //return redirect()->route('filament.01J780T5ACBCGKDF3BB946XPRD.tenant.billing');

        /*

        if ($user && $user->activePlanSubscriptions()->isEmpty()) {
            if(filament()->getTenant()){
                return redirect()->route('filament.'.filament()->getCurrentPanel()->getId().'.tenant.billing', ['tenant'=> filament()->getTenant()->{filament()->getCurrentPanel()->getTenantSlugAttribute()}]);
            }
            else {
                return redirect()->route('filament.'.filament()->getCurrentPanel()->getId().'.tenant.billing');
            }
        }
            */

        return $next($request);
    }
}
