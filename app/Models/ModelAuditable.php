<?php

namespace App\Models;

use App\Traits\IdAttributeUppercaseTrait;
use App\Traits\RemoveEmptyStringsTrait;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class ModelAuditable extends Model implements Auditable
{
    use HasUlids;
    use HasFactory;
    use RemoveEmptyStringsTrait;

    use \OwenIt\Auditing\Auditable;

    use IdAttributeUppercaseTrait;
}
