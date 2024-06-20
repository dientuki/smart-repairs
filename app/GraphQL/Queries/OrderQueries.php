<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Order;

final readonly class OrderQueries
{
    public function getActiveOrders()
    {
        //@todo improve https://www.answeroverflow.com/m/1136334340888989927#solution-1136340488786559106
        $team = auth()->user()->teams;

        $teamIds = [];
        foreach ($team as $t) {
            $teamIds[] = $t->id;
        }

        return Order::whereIn('team_id', $teamIds)->where('status', '!=', 'ready')->get();
    }
}
