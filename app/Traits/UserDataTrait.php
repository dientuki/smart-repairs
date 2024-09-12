<?php

namespace App\Traits;

trait UserDataTrait
{
    private function getTeamId()
    {
        try {
            $user = auth()->guard('web')->user();

            if ($user) {
                return $user->latest_team_id;
            }

            throw new \Exception('Team not found');
        } catch (\Exception $e) {
            throw new \Exception('Team not found');
        }
    }

    private function getUserId()
    {
        try {
            $user = auth()->guard('web')->user();

            if ($user) {
                return $user->id;
            }

            throw new \Exception('User not found');
        } catch (\Exception $e) {
            throw new \Exception('User not found');
        }
    }
}
