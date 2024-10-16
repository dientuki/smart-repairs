<?php

namespace App\Listeners;

use Filament\Events\TenantSet;

class UpdateLatestTeamId
{
    /**
     * Handle the event.
     */
    public function handle(TenantSet $event): void
    {
        $user = $event->getUser();
        $team = $event->getTenant();

        if ($user->latest_team_id !== $team->id) {
            if ($user->teams()->where('teams.id', $team->id)->exists()) {
                $user->latest_team_id = $team->id;
                $user->save();
            } else {
                throw new \Exception('El usuario no pertenece a este equipo.');
            }
        }
    }
}
