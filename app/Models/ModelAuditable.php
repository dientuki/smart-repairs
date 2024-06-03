<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class ModelAuditable extends Model implements Auditable
{
    use HasUlids;

    use \OwenIt\Auditing\Auditable;
}
