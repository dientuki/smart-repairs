<?php

namespace App\GraphQL\Queries;

use App\Models\Order;
use App\Traits\TeamContextTrait;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class PartQueries
{
    use TeamContextTrait;

    public function getPartsByOrder(null $root, array $args, GraphQLContext $context): mixed
    {
        $team_id = $this->getTeamIdFromContext($context);

        $order = Order::find($args['orderId']);

        return $order->deviceUnit->deviceVersion->parts->map(function ($part) use ($team_id) {
            $stock = $part->stockForTeam($team_id);

            // Asegúrate de que la parte tiene un ID válido
            if (!$part || !$part->id) {
                throw new \Exception("Part is null or missing an ID");
            }

            // El array devuelto debe tener todos los campos necesarios
            return [
                'id' => $part->id,
                'label' => $part->label,
                'price' => $stock->price,
                'stock' => $stock ? $stock->quantity : 0,
                'image' => $part->image,
            ];
        })->filter();
    }
}
