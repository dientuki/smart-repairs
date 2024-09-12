<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Order;
use App\Traits\UserDataTrait;
use Filament\Facades\Filament;

final readonly class OrderQueries
{
    use UserDataTrait;

    public function getActiveOrders()
    {
        //@todo improve https://www.answeroverflow.com/m/1136334340888989927#solution-1136340488786559106
        $team_id = $this->getTeamId();

        return Order::where('team_id', $team_id)->where('status', '!=', 'ready')->get();
    }
}
