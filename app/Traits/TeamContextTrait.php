<?php

namespace App\Traits;

trait TeamContextTrait
{
    private function getTeamIdFromContext($context)
    {
        try {
            $team_id = $context->request->cookies->get('team_id');

            $tenants = auth()->user()->teams;

            foreach ($tenants as $tenant) {
                if ($tenant->id == $team_id) {
                    return $team_id;
                }
            }

            throw new \Exception('Team not found');
        } catch (\Exception $e) {
            throw new \Exception('Team not found');
        }
    }
}
