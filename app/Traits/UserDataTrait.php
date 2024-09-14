<?php

namespace App\Traits;

use App\Models\Team;

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

    private function getUserName()
    {
        try {
            $user = auth()->guard('web')->user();

            if ($user) {
                return $user->name;
            }

            throw new \Exception('User not found');
        } catch (\Exception $e) {
            throw new \Exception('User not found');
        }
    }

    private function getUserImageUrl()
    {
        try {
            $user = auth()->guard('web')->user();

            if ($user) {
                return $user->imageUrl;
            }

            throw new \Exception('User not found');
        } catch (\Exception $e) {
            throw new \Exception('User not found');
        }
    }

    private function getTeamPackage()
    {
        try {
            $user = auth()->guard('web')->user();

            if ($user) {
                return Team::find($user->latest_team_id)->subscription->package->name;
            }

            throw new \Exception('User not found');
        } catch (\Exception $e) {
            throw new \Exception('User not found');
        }
    }
}
