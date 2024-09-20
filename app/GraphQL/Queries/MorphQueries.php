<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Part;
use App\Models\Discount;
use App\Models\ServiceJob;

final readonly class MorphQueries
{
    public function getMorph()
    {
        return [
            'part' => (new Part())->getMorphClass(),
            'discount' => (new Discount())->getMorphClass(),
            'serviceJob' => (new ServiceJob())->getMorphClass(),
        ];
    }
}
